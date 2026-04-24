import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function UserResources() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ 
    description: "", 
    type: "PROJECTOR",
    date: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/resource-requests/my");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS REQUEST?")) return;
    try {
      await api.delete(`/api/resource-requests/${id}`);
      fetchRequests();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "FAILED TO CANCEL REQUEST";
      alert(errorMsg.toUpperCase());
      console.error("Delete failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.endTime <= formData.startTime) {
      setError("END TIME MUST BE AFTER START TIME");
      return;
    }
    try {
      await api.post("/api/resource-requests", formData);
      fetchRequests();
      setShowModal(false);
      setFormData({ description: "", type: "PROJECTOR", date: "", startTime: "", endTime: "" });
    } catch (err) {
      let msg = err.response?.data?.message || "TIME SLOT HAS ALREADY BOOKED";
      if (msg.toLowerCase().includes("unexpected server error")) {
        msg = "TIME SLOT HAS ALREADY BOOKED";
      }
      setError(msg.toUpperCase());
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      default: return '';
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PROJECTOR': return '📹';
      case 'LAPTOP': return '💻';
      case 'SETUP': return '🖥️';
      case 'LAB': return '🔬';
      case 'SOFTWARE': return '💿';
      default: return '📦';
    }
  };

  return (
    <div className="page mesh-bg dashboard-fade-in">
      <div className="dashboard-shell">
        <div className="dashboard-header-container">
          <div className="dashboard-title-group">
            <h1 className="premium-title">Inventory Requests</h1>
            <p className="premium-subtitle">Request new equipment or facilities for your academic needs.</p>
            <button className="premium-cta-btn" onClick={() => setShowModal(true)}>
              <div className="btn-content">
                <span className="plus-icon">+</span>
                <span>New Request</span>
              </div>
            </button>
          </div>
        </div>

        <div className="premium-glass-card table-section slide-up">
          <div className="section-header">
            <div className="header-dot"></div>
            <h3>Request History</h3>
          </div>

          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Resource Type</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="premium-row">
                    <td>
                      <div className="resource-cell">
                        <div className="resource-icon-box">
                          {getResourceIcon(req.type)}
                        </div>
                        <span className="resource-name">{req.type.charAt(0) + req.type.slice(1).toLowerCase()}</span>
                      </div>
                    </td>
                    <td>
                      {req.date ? (
                        <span className="date-tag">{req.date}</span>
                      ) : (
                        <span className="dimmed-text">—</span>
                      )}
                    </td>
                    <td>
                      {req.startTime ? (
                        <div className="slot-pill">{req.startTime} - {req.endTime}</div>
                      ) : (
                        <span className="dimmed-text">—</span>
                      )}
                    </td>
                    <td><span className="date-tag">{req.description}</span></td>
                    <td>
                      <span className={`status-pill ${getStatusClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === "PENDING" && (
                        <button 
                          className="cancel-icon-btn"
                          onClick={() => handleDelete(req.id || req._id)}
                          title="Cancel Request"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h4>No requests found</h4>
                        <p>Submit a new request to see it here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-card">
            <div className="modal-top-bar">
              <div className="modal-icon">📦</div>
              <div className="modal-titles">
                <h2>New Inventory Request</h2>
                <p>Provide details for the equipment and time slot.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && (
              <div className="premium-error-banner">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-row full">
                <label>Resource Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="PROJECTOR">Projector (📹)</option>
                  <option value="LAPTOP">Laptop (💻)</option>
                  <option value="SETUP">Full PC Setup (🖥️)</option>
                  <option value="LAB">Laboratory Space (🔬)</option>
                  <option value="SOFTWARE">Software License (💿)</option>
                  <option value="OTHER">Other Equipment (📦)</option>
                </select>
              </div>

              <div className="form-grid-3">
                <div className="form-row">
                  <label>Date</label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <label>Start Time</label>
                  <input 
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <label>End Time</label>
                  <input 
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <label>Justification / Description</label>
                <textarea 
                  placeholder="Explain why this resource is needed..."
                  required
                  rows="4"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Request</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
