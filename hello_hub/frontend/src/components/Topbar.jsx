import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const roleRoot = user?.role?.toLowerCase() === "admin" ? "/admin" :
                   user?.role?.toLowerCase() === "technician" ? "/technician" :
                   user?.role?.toLowerCase() === "lecturer" ? "/lecturer" : "/student";

  const onLogout = () => {
    if (logout()) {
      navigate("/login", { replace: true });
    }
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const goToNotifications = () => {
    setIsNotificationOpen(false);
    navigate(`${roleRoot}/notifications`);
  };

  return (
    <div className="topbar">
      <div className="topbar-actions">
        <button type="button" className="icon-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M10.5 4a6.5 6.5 0 014.99 10.67l4.42 4.42-1.41 1.41-4.42-4.42A6.5 6.5 0 1110.5 4zm0 2a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
          </svg>
        </button>
        
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className={`icon-btn${isNotificationOpen ? " active" : ""}`}
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <svg viewBox="0 0 24 24" role="img">
              <path d="M12 3a5 5 0 00-5 5v2.18c0 .74-.2 1.46-.57 2.1L5 15v1h14v-1l-1.43-2.72a4.5 4.5 0 01-.57-2.1V8a5 5 0 00-5-5zm0 19a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z" />
            </svg>
            <span className="icon-dot" aria-hidden="true"></span>
          </button>

          {isNotificationOpen && (
            <div className="popup-container">
              <div className="popup-header">
                <h3>Notifications</h3>
                <span className="popup-badge">2 New</span>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <div className="notification-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="notification-content">
                    <p>Your booking for Lab 1 was approved.</p>
                    <span>Just now</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon" style={{ color: "var(--amber)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="notification-content">
                    <p>Ticket #1024 is awaiting your response.</p>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
              <button 
                className="cta-btn secondary" 
                style={{ width: "100%", marginTop: "16px", padding: "10px", fontSize: "0.9rem" }}
                onClick={goToNotifications}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>

        <button type="button" className="icon-btn" aria-label="Profile">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
          </svg>
        </button>
        <button type="button" className="cta-btn secondary" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
