import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function Userbookings() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    resourceId: "",
    resourceName: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);

  // Predefined list of suitable campus resources for better UX
  const defaultResources = [
    { id: "res1", name: "Computer Lab 01 (Advanced Computing)", type: "LAB", status: "AVAILABLE" },
    { id: "res2", name: "Computer Lab 02 (Network & Security)", type: "LAB", status: "AVAILABLE" },
    { id: "res3", name: "Main Auditorium (East Wing)", type: "HALL", status: "AVAILABLE" },
    { id: "res4", name: "Seminar Room A (Management Block)", type: "ROOM", status: "AVAILABLE" },
    { id: "res5", name: "Digital Library (Zone 4)", type: "SPACE", status: "AVAILABLE" },
    { id: "res6", name: "Smart Classroom 102", type: "ROOM", status: "AVAILABLE" },
    { id: "res7", name: "IoT Innovation Lab", type: "LAB", status: "BROKEN" },
    { id: "res8", name: "Projector Hub - Mobile Unit B", type: "DEVICE", status: "AVAILABLE" },
  ];

  useEffect(() => {
    fetchBookings();
    fetchResources();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await api.get("/api/resources");
      // Use API resources if available, else fallback to default for UI demo
      setResources(res.data.length > 0 ? res.data : defaultResources);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources(defaultResources);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "resource") {
        const selectedResource = resources.find(r => r.id === value);
        setFormData(prev => ({ 
            ...prev, 
            resourceId: value, 
            resourceName: selectedResource ? selectedResource.name : ""
        }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/bookings", {
          ...formData,
          attendees: parseInt(formData.attendees) || 0
      });
      fetchBookings();
      setShowModal(false);
      setFormData({ resourceId: "", resourceName: "", date: "", startTime: "", endTime: "", purpose: "", attendees: "" });
    } catch (err) {
      let msg = err.response?.data?.message || "TIME SLOT HAS ALREADY BOOKED";
      if (msg.toLowerCase().includes("unexpected server error")) {
        msg = "TIME SLOT HAS ALREADY BOOKED";
      }
      setError(msg.toUpperCase());
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS RESERVATION?")) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("FAILED TO CANCEL RESERVATION");
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'LAB': return '🖥️';
      case 'HALL': return '🏛️';
      case 'ROOM': return '🏫';
      case 'SPACE': return '📚';
      case 'DEVICE': return '📹';
      default: return '📍';
    }
  };

  return (
    <div className="page mesh-bg dashboard-fade-in">
      <div className="dashboard-shell">
        <div className="dashboard-header-container">
          <div className="dashboard-title-group">
            <h1 className="premium-title">Resource Hub</h1>
            <p className="premium-subtitle">Manage your campus facility reservations and equipment usage.</p>
            <button className="premium-cta-btn" onClick={() => setShowModal(true)}>
              <div className="btn-content">
                <span className="plus-icon">+</span>
                <span>Reserve Space</span>
              </div>
            </button>
          </div>
        </div>

        <div className="premium-glass-card table-section slide-up">
          <div className="section-header">
            <div className="header-dot"></div>
            <h3>Recent Bookings</h3>
          </div>
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Resource / Lab</th>
                  <th>Scheduled Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th className="text-center">Manage</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="premium-row">
                    <td>
                      <div className="resource-cell">
                        <div className="resource-icon-box">
                          {getResourceIcon(resources.find(r => r.name === booking.resourceName)?.type)}
                        </div>
                        <span className="resource-name">{booking.resourceName}</span>
                      </div>
                    </td>
                    <td><span className="date-tag">{booking.date}</span></td>
                    <td>
                      <div className="slot-pill">
                        {booking.startTime} — {booking.endTime}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {booking.status === "APPROVED" || booking.status === "PENDING" ? (
                        <button 
                          className="cancel-icon-btn"
                          onClick={() => handleCancel(booking.id)}
                          title="Cancel Reservation"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                          </svg>
                        </button>
                      ) : (
                        <span className="dimmed-text">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">🗓️</div>
                <h4>No active reservations</h4>
                <p>Click the button above to reserve a lab or resource.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-card">
            <div className="modal-top-bar">
              <div className="modal-icon">✨</div>
              <div className="modal-titles">
                <h2>New Reservation</h2>
                <p>Please fill in the details for your booking request.</p>
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
                <label>Select Resource</label>
                <div className="custom-select">
                  <select 
                    name="resource" 
                    required 
                    onChange={handleInputChange}
                    value={formData.resourceId}
                  >
                    <option value="">Choose a lab or equipment...</option>
                    {resources.map(r => (
                      <option key={r.id} value={r.id} disabled={r.status === "BROKEN"}>
                        {getResourceIcon(r.type)} {r.name} {r.status === "BROKEN" ? "— [In Maintenance]" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-row">
                  <label>Date</label>
                  <input type="date" name="date" required onChange={handleInputChange} value={formData.date} />
                </div>
                <div className="form-row">
                  <label>Start Time</label>
                  <input type="time" name="startTime" required onChange={handleInputChange} value={formData.startTime} />
                </div>
                <div className="form-row">
                  <label>End Time</label>
                  <input type="time" name="endTime" required onChange={handleInputChange} value={formData.endTime} />
                </div>
              </div>

              <div className="form-row full">
                <label>Purpose of Use</label>
                <textarea 
                  name="purpose" 
                  rows="2" 
                  required 
                  placeholder="Tell us what you'll be using this resource for..."
                  onChange={handleInputChange}
                  value={formData.purpose}
                ></textarea>
              </div>

              <div className="form-row">
                <label>Total Attendees</label>
                <input 
                  type="number" 
                  name="attendees" 
                  placeholder="e.g. 15"
                  onChange={handleInputChange}
                  value={formData.attendees}
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
