import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resForm, setResForm] = useState({ name: "", type: "LAB", description: "" });

  const [activeTab, setActiveTab] = useState("INVENTORY");

  useEffect(() => {
    fetchResources();
    fetchRequests();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get("/api/resources");
      setResources(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/resource-requests");
      setRequests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/resources", resForm);
      fetchResources();
      setResForm({ name: "", type: "LAB", description: "" });
      setActiveTab("INVENTORY"); // Switch back to inventory after adding
    } catch (err) { console.error(err); }
  };

  const handleRequestAction = async (id, status) => {
    try {
      await api.put(`/api/resource-requests/${id}/status`, { status });
      fetchRequests();
    } catch (err) { console.error(err); }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await api.put(`/api/resources/${id}/status`, { status });
      fetchResources();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page mesh-bg dashboard-fade-in">
      <div className="dashboard-shell">
        <div className="dashboard-header-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="dashboard-title-group">
            <h1 className="premium-title">Admin Resource Management</h1>
            <p className="premium-subtitle">Oversee campus inventory and approve equipment requests.</p>
          </div>
          
          <div style={{ display: "inline-flex", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.16)", borderRadius: "999px", padding: "6px", gap: "4px", marginTop: "10px" }}>
            {[
              { key: "INVENTORY", label: "Campus Inventory" },
              { key: "REQUESTS", label: "New Equipment Requests" },
              { key: "ADD_RESOURCE", label: "Add New Resource" },
            ].map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? "rgba(124, 58, 237, 0.18)" : "transparent",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                  padding: "10px 18px",
                  color: activeTab === tab.key ? "var(--purple)" : "var(--muted)",
                  fontWeight: 700,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === tab.key ? "0 8px 24px rgba(124, 58, 237, 0.08)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          {/* Inventory Section */}
          {activeTab === "INVENTORY" && (
            <div className="premium-glass-card slide-up">
              <div className="section-header">
                <div className="header-dot"></div>
                <h3>Campus Inventory</h3>
              </div>
              <div className="table-container" style={{ maxHeight: "600px" }}>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Availability</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map(r => (
                      <tr key={r.id} className="premium-row">
                        <td style={{ maxWidth: "250px" }}>
                          <span className="resource-name" style={{ display: "block", lineHeight: "1.2" }}>{r.name}</span>
                        </td>
                        <td><span className="slot-pill" style={{ fontSize: "12px" }}>{r.type}</span></td>
                        <td>
                          <span className={`status-pill ${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="premium-cta-btn" 
                            style={{ padding: "6px 12px", fontSize: "11px", background: r.status === 'AVAILABLE' ? '#ef4444' : '#10b981', boxShadow: "none" }}
                            onClick={() => handleToggleStatus(r.id, r.status === 'AVAILABLE' ? 'BROKEN' : 'AVAILABLE')}
                          >
                            {r.status === 'AVAILABLE' ? 'Mark Broken' : 'Mark Fixed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requests Section */}
          {activeTab === "REQUESTS" && (
            <div className="premium-glass-card slide-up">
              <div className="section-header">
                <div className="header-dot"></div>
                <h3>New Equipment Requests</h3>
              </div>
              <div className="table-container" style={{ maxHeight: "600px" }}>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id} className="premium-row">
                        <td><span className="resource-name" style={{ fontSize: "13px" }}>{req.requesterName}</span></td>
                        <td><span className="slot-pill" style={{ fontSize: "12px" }}>{req.type}</span></td>
                        <td><span className="date-tag" style={{ fontSize: "12px" }}>{req.date || "—"}</span></td>
                        <td><span className="slot-pill" style={{ fontSize: "12px" }}>{req.startTime || "—"} - {req.endTime || "—"}</span></td>
                        <td><span className="date-tag" style={{ fontSize: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", whiteSpace: "nowrap" }}>{req.description}</span></td>
                        <td>
                          {req.status === "PENDING" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button className="submit-btn" style={{ padding: "6px 12px", fontSize: "11px", flex: "none" }} onClick={() => handleRequestAction(req.id, "APPROVED")}>Approve</button>
                              <button className="cancel-btn" style={{ padding: "6px 12px", fontSize: "11px", flex: "none" }} onClick={() => handleRequestAction(req.id, "REJECTED")}>Reject</button>
                            </div>
                          ) : (
                            <span className={`status-pill ${req.status.toLowerCase()}`} style={{ fontSize: "12px" }}>{req.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            <div className="empty-icon">📁</div>
                            <h4>No pending requests</h4>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Resource Section */}
          {activeTab === "ADD_RESOURCE" && (
            <div className="premium-glass-card slide-up" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="section-header">
                <div className="header-dot"></div>
                <h3>Add New Resource</h3>
              </div>
              <div style={{ padding: "30px" }}>
                <form onSubmit={handleCreateResource} className="premium-form">
                  <div className="form-row">
                    <label>Name</label>
                    <input 
                      placeholder="e.g., Computer Lab 3"
                      required
                      value={resForm.name}
                      onChange={e => setResForm({...resForm, name: e.target.value})}
                    />
                  </div>
                  <div className="form-row">
                    <label>Type</label>
                    <select 
                      value={resForm.type}
                      onChange={e => setResForm({...resForm, type: e.target.value})}
                    >
                      <option value="LAB">Laboratory</option>
                      <option value="PROJECTOR">Projector</option>
                      <option value="LAPTOP">Laptop</option>
                      <option value="SETUP">Full PC Setup</option>
                      <option value="CONFERENCE_ROOM">Conference Room</option>
                      <option value="HALL">Hall</option>
                    </select>
                  </div>
                  <div className="form-actions" style={{ marginTop: "20px" }}>
                    <button type="submit" className="submit-btn">Save Resource</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
