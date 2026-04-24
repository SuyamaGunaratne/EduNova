import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resForm, setResForm] = useState({ name: "", type: "LAB", description: "" });

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
        <div className="dashboard-header-container">
          <div className="dashboard-title-group">
            <h1 className="premium-title">Admin Resource Management</h1>
            <p className="premium-subtitle">Oversee campus inventory and approve equipment requests.</p>
          </div>
        </div>

        <div className="admin-grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", gap: "24px", marginTop: "30px" }}>
          {/* Inventory Section */}
          <div className="premium-glass-card">
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
                      <td style={{ maxWidth: "150px" }}>
                        <span className="resource-name" style={{ display: "block", lineHeight: "1.2" }}>{r.name}</span>
                      </td>
                      <td><span className="slot-pill" style={{ fontSize: "10px" }}>{r.type}</span></td>
                      <td>
                        <span className={`status-pill ${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="premium-cta-btn" 
                          style={{ padding: "6px 10px", fontSize: "10px", background: r.status === 'AVAILABLE' ? '#ef4444' : '#10b981' }}
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

          {/* Requests Section */}
          <div className="premium-glass-card">
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
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="premium-row">
                      <td><span className="resource-name">{req.requesterName}</span></td>
                      <td><span className="slot-pill">{req.type}</span></td>
                      <td><span className="date-tag">{req.description}</span></td>
                      <td>
                        {req.status === "PENDING" ? (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button className="premium-cta-btn" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={() => handleRequestAction(req.id, "APPROVED")}>Approve</button>
                            <button className="cancel-btn" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={() => handleRequestAction(req.id, "REJECTED")}>Reject</button>
                          </div>
                        ) : (
                          <span className={`status-pill ${req.status.toLowerCase()}`}>{req.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4">
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

          {/* Add Resource Section */}
          <div className="premium-glass-card">
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
        </div>
      </div>
    </div>
  );
}
