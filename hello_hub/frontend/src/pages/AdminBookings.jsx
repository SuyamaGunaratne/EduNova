import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function AdminBookings() {
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState("");

  const handleAction = async (id, newStatus) => {
    try {
      await api.put(`/api/bookings/${id}/status`, {
        status: newStatus,
        reason: reason
      });
      fetchBookings();
      setSelectedBooking(null);
      setReason("");
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  const filteredBookings = bookings.filter((b) => filter === "ALL" || b.status === filter);

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header" style={{ marginBottom: "20px" }}>
          <div>
            <h1>Admin Resource Bookings</h1>
            <p>Review and manage all resource booking requests across the campus.</p>
          </div>
          <div style={{ display: "inline-flex", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.16)", borderRadius: "999px", padding: "6px", gap: "4px" }}>
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "rgba(124, 58, 237, 0.18)" : "transparent",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                  padding: "10px 16px",
                  color: filter === f ? "var(--purple)" : "var(--muted)",
                  fontWeight: 700,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  boxShadow: filter === f ? "0 8px 24px rgba(124, 58, 237, 0.08)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ width: "100%" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--outline)" }}>
                  <th style={{ padding: "12px" }}>User</th>
                  <th style={{ padding: "12px" }}>Resource</th>
                  <th style={{ padding: "12px" }}>Time Slot</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: "1px solid var(--outline)" }}>
                    <td style={{ padding: "12px" }}>
                      <strong>{booking.userName}</strong>
                    </td>
                    <td style={{ padding: "12px" }}>{booking.resourceName}</td>
                    <td style={{ padding: "12px" }}>
                      {booking.date} {booking.startTime} - {booking.endTime}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        className={`badge ${booking.status.toLowerCase()}`}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            booking.status === "APPROVED"
                              ? "#e6f4ea"
                              : booking.status === "PENDING"
                              ? "#fff4e5"
                              : booking.status === "CANCELLED"
                              ? "#f3f4f6"
                              : "#fce8e6",
                          color:
                            booking.status === "APPROVED"
                              ? "#1e7e34"
                              : booking.status === "PENDING"
                              ? "#b45d00"
                              : booking.status === "CANCELLED"
                              ? "#6b7280"
                              : "#d93025",
                        }}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      {booking.status === "PENDING" ? (
                        <button className="cta-btn" style={{ padding: "6px 12px", fontSize: "13px" }} onClick={() => setSelectedBooking(booking)}>
                          Review
                        </button>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "13px" }}>Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="glass-card" style={{ maxWidth: "500px" }}>
            <h2>Review Booking Request</h2>
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
              <p>Requested by: <strong>{selectedBooking.userName}</strong></p>
              <p>Target Resource: <strong>{selectedBooking.resourceName}</strong></p>
              <p>Purpose: {selectedBooking.purpose}</p>
              <p>Attendees: {selectedBooking.attendees || "N/A"}</p>
            </div>
            
            <textarea
              className="role-chip"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--outline)", backgroundColor: "#fff", height: "80px", cursor: "text" }}
              placeholder="Add review feedback or reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button 
                className="cta-btn" 
                style={{ flex: 1 }} 
                onClick={() => handleAction(selectedBooking.id, "APPROVED")}
              >
                Approve Request
              </button>
              <button 
                className="cta-btn" 
                style={{ flex: 1, backgroundColor: "#d93025", backgroundImage: "none" }} 
                onClick={() => handleAction(selectedBooking.id, "REJECTED")}
              >
                Reject Request
              </button>
              <button 
                type="button" 
                className="cta-btn secondary" 
                style={{ flex: 0.5 }} 
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
