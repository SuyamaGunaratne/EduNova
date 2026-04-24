import React from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function AdminDashboard() {
  const loadUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      alert(`Total users: ${res.data.length}`);
    } catch (err) {
      alert("Error loading users from backend.");
    }
  };

  const adminStats = [
    { name: "Pending Role Requests", value: "7", icon: "📝", link: "/admin/role-requests" },
    { name: "Open Support Tickets", value: "16", icon: "⚠️", link: "/admin/tickets" },
    { name: "Available Resources", value: "42", icon: "🏢", link: "/admin/resources" },
    { name: "Live Alerts", value: "9", icon: "🔔", link: "/admin/dashboard" },
  ];

  const quickActions = [
    { label: "Review Requests", path: "/admin/role-requests" },
    { label: "View Tickets", path: "/admin/tickets" },
    { label: "Manage Resources", path: "/admin/resources" },
    { label: "Operational Alerts", path: "/admin/dashboard" },
  ];

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="kicker">Admin Operations Hub</p>
            <h1>Executive Command Center</h1>
            <p>Track vital campus health metrics, approve requests, and keep operations moving without delays.</p>
          </div>
          <button className="cta-btn secondary" onClick={loadUsers}>
            👥 Check Users
          </button>
        </div>

        <div className="role-grid" style={{ marginBottom: "24px" }}>
          {adminStats.map((stat, i) => (
            <Link to={stat.link} key={i} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ height: "100%", padding: "24px" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>{stat.name}</p>
                <div style={{ fontSize: "34px", fontWeight: "800", color: "var(--ink)" }}>{stat.value}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "30px", marginBottom: "24px" }}>
          <h2>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginTop: "20px" }}>
            {quickActions.map((action, i) => (
              <Link to={action.path} key={i} style={{ textDecoration: "none" }}>
                <div className="action-card" style={{ padding: "18px", borderRadius: "16px", background: "var(--bg-top)", border: "1px solid var(--outline)", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          <div className="glass-card" style={{ padding: "30px" }}>
            <h2>Operational Insights</h2>
            <p style={{ fontSize: "14px", marginBottom: "18px" }}>
              Keep a close watch on incoming requests, facility availability, and system alerts to make faster decisions.
            </p>
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Pending approvals</span>
                <strong>7</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Critical tickets</span>
                <strong>5</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>New announcements</span>
                <strong>3</strong>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: "30px" }}>
            <h2>Recent Activity</h2>
            <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
              <div style={{ padding: "16px", background: "var(--bg-top)", borderRadius: "14px", border: "1px solid var(--outline)" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>New resource approved</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Conference Hall reservation added 1h ago.</p>
              </div>
              <div style={{ padding: "16px", background: "var(--bg-top)", borderRadius: "14px", border: "1px solid var(--outline)" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>Ticket escalated</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Power outage ticket in North Block.</p>
              </div>
              <div style={{ padding: "16px", background: "var(--bg-top)", borderRadius: "14px", border: "1px solid var(--outline)" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>System alert published</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Maintenance window scheduled for tonight.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}