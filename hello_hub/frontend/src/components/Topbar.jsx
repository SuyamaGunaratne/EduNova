import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const roleRoot = user?.role?.toLowerCase() === "admin" ? "/admin" :
                   user?.role?.toLowerCase() === "technician" ? "/technician" :
                   user?.role?.toLowerCase() === "lecturer" ? "/lecturer" : "/student";

  const notificationEndpoint = user?.role?.toLowerCase() === "admin" ? "/api/notifications/admin" : "/api/notifications/my";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(notificationEndpoint);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user, notificationEndpoint]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const onLogout = () => {
    if (logout()) {
      navigate("/login", { replace: true });
    }
  };

  const toggleNotifications = () => {
    setIsNotificationOpen((current) => !current);
  };

  const handleNotificationClick = async (notification) => {
    if (notification.read) {
      return;
    }

    try {
      await api.put(`/api/notifications/${notification.id}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const goToProfile = () => {
    navigate(roleRoot);
  };

  return (
    <div className="topbar">
      <div className="topbar-actions">
        <div className="notification-wrapper">
          <button
            type="button"
            className="icon-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={toggleNotifications}
          >
            <svg viewBox="0 0 24 24" role="img">
              <path d="M12 3a5 5 0 00-5 5v2.18c0 .74-.2 1.46-.57 2.1L5 15v1h14v-1l-1.43-2.72a4.5 4.5 0 01-.57-2.1V8a5 5 0 00-5-5zm0 19a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z" />
            </svg>
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
          </button>

          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="popup-header">
                <h3>Notifications</h3>
                <span className="popup-badge">{unreadCount} Unread</span>
              </div>
              {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: "18px" }}>
                  <p>No notifications yet.</p>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.slice(0, 5).map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      className={`notification-item${notification.read ? "" : " unread"}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label="Profile"
          title="Profile"
          onClick={goToProfile}
        >
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
