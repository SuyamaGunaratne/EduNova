import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ activeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const lastPathSegment = location.pathname.split("/").filter(Boolean).pop();
  const resolvedActiveMenu = activeMenu || (lastPathSegment === "dashboard" || lastPathSegment === "resources" || lastPathSegment === "bookings" || lastPathSegment === "tickets" || lastPathSegment === "notifications" || lastPathSegment === "role-requests" ? lastPathSegment : "dashboard");

  const navLinkClass = (menuKey) =>
    `user-nav-link${resolvedActiveMenu === menuKey ? " active" : ""}`;

  const onLogout = () => {
    if (logout()) {
      navigate("/login", { replace: true });
    }
  };

  const goTo = (path = "") => {
    navigate(`/admin${path}`);
  };

  return (
    <nav className="user-nav glass-card">
      <div className="user-nav-brand">
        <div className="user-nav-brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M12 3l7 4v10l-7 4-7-4V7l7-4zm0 2.2L7 8v8l5 2.8 5-2.8V8l-5-2.8zm0 2.3a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
          </svg>
        </div>
        <span>UniSupport</span>
      </div>

      <div className="user-nav-links" role="navigation" aria-label="Admin sections">
        <button type="button" className={navLinkClass("dashboard")} onClick={() => goTo("/dashboard")}>
          Admin Dashboard
        </button>
        <button type="button" className={navLinkClass("resources")} onClick={() => goTo("/resources")}>
          Resources
        </button>
        <button type="button" className={navLinkClass("bookings")} onClick={() => goTo("/bookings")}>
          Bookings
        </button>
        <button type="button" className={navLinkClass("tickets")} onClick={() => goTo("/tickets")}>
          Tickets
        </button>
        <button type="button" className={navLinkClass("role-requests")} onClick={() => goTo("/role-requests")}>
          Role Requests
        </button>
      </div>

    </nav>
  );
}
