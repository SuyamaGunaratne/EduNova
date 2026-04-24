import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ExternalDashboard() {
  const { user } = useAuth();

  const externalStats = [
    { name: "Active Listings", value: "18", icon: "🏠" },
    { name: "Current Bookings", value: "32", icon: "🗓️" },
    { name: "Messages", value: "6", icon: "✉️" },
    { name: "Pending Approvals", value: "2", icon: "🟡" },
  ];

  const quickActions = [
    { label: "View Properties", path: "/external/properties" },
    { label: "Update Profile", path: "/external/profile" },
    { label: "View Requests", path: "/external/requests" },
    { label: "Contact Support", path: "/external/support" },
  ];

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="kicker">External Partner Hub</p>
            <h1>Partner Resource Center</h1>
            <p>Manage your external services, bookings, and account activity in one central place.</p>
          </div>
          <button className="cta-btn secondary">Edit Profile</button>
        </div>

        <div className="role-grid" style={{ marginBottom: "24px" }}>
          {externalStats.map((stat, index) => (
            <div key={index} className="glass-card" style={{ padding: "24px", height: "100%" }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{stat.icon}</div>
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>{stat.name}</p>
              <div style={{ fontSize: "34px", fontWeight: "800", color: "var(--ink)" }}>{stat.value}</div>
            </div>
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
            <h2>Recent Activity</h2>
            <div style={{ display: "grid", gap: "16px", marginTop: "18px" }}>
              <div style={{ padding: "16px", background: "var(--bg-top)", borderRadius: "14px", border: "1px solid var(--outline)" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>New booking request</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Booking request for shared workspace approved.</p>
              </div>
              <div style={{ padding: "16px", background: "var(--bg-top)", borderRadius: "14px", border: "1px solid var(--outline)" }}>
                <p style={{ margin: "0 0 6px", fontWeight: 700 }}>Message received</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Support team sent an update about your listing.</p>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: "30px" }}>
            <h2>Account Summary</h2>
            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>Partner name</span>
                <strong>{user?.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>Role</span>
                <strong>External</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}>
                <span>Status</span>
                <strong>Active</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
