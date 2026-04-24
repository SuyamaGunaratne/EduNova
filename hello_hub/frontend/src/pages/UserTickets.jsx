import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ resourceId: "", issue: "" });

  useEffect(() => {
    fetchTickets();
    fetchResources();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tickets/my");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await api.get("/api/resources");
      setResources(res.data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedResource = resources.find(r => r.id === formData.resourceId);
    try {
      await api.post("/api/tickets", {
        ...formData,
        resourceName: selectedResource ? selectedResource.name : ""
      });
      fetchTickets();
      setShowModal(false);
      setFormData({ resourceId: "", issue: "" });
    } catch (err) {
      console.error("Failed to submit ticket", err);
    }
  };

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <h1>Support Tickets</h1>
            <p>Report issues with campus resources or facilities.</p>
          </div>
          <button className="cta-btn" onClick={() => setShowModal(true)}>+ Report Issue</button>
        </div>

        <div className="glass-card" style={{ marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--outline)" }}>
                <th style={{ padding: "12px" }}>Resource</th>
                <th style={{ padding: "12px" }}>Issue</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: "1px solid var(--outline)" }}>
                  <td style={{ padding: "12px" }}><strong>{ticket.resourceName}</strong></td>
                  <td style={{ padding: "12px" }}>{ticket.issue}</td>
                  <td style={{ padding: "12px" }}>
                    <span className={`badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                  </td>
                  <td style={{ padding: "12px" }}>{ticket.assignedTechnicianName || "Unassigned"}</td>
                </tr>
              ))}
              {tickets.length === 0 && !loading && (
                <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: "400px" }}>
            <h2>Report an Issue</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
              <div>
                <label>Resource / Lab</label>
                <select 
                  className="role-chip" 
                  style={{ width: "100%" }}
                  required
                  value={formData.resourceId}
                  onChange={e => setFormData({...formData, resourceId: e.target.value})}
                >
                  <option value="">Select Resource</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Describe the Problem</label>
                <textarea 
                  className="role-chip" 
                  style={{ width: "100%", height: "100px", padding: "10px" }}
                  placeholder="What is wrong with the resource?"
                  required
                  value={formData.issue}
                  onChange={e => setFormData({...formData, issue: e.target.value})}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="cta-btn" style={{ flex: 1 }}>Submit Ticket</button>
                <button type="button" className="cta-btn secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
