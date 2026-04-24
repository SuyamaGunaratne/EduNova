import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications/my");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load user notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="page mesh-bg dashboard-fade-in">
      <div className="dashboard-shell">
        <div className="dashboard-header-container">
          <div className="dashboard-title-group">
            <h1 className="premium-title">Notifications</h1>
            <p className="premium-subtitle">Keep track of approval status and updates for your equipment requests.</p>
          </div>
        </div>

        <div className="premium-glass-card slide-up">
          <div className="section-header">
            <div className="header-dot"></div>
            <h3>My Notifications</h3>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>No notifications yet</h4>
              <p>Action on your equipment requests will appear here.</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
