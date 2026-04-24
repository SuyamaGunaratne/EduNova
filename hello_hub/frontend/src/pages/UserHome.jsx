import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserHome() {
  const { user } = useAuth();

  const services = [
    {
      title: "Facilities & Labs",
      desc: "Browse our modernized catalogue of rooms, labs, and specialized equipment.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17" />
        </svg>
      ),
      link: "/student/resources",
    },
    {
      title: "Booking Workflow",
      desc: "Request resources and track your booking status through the approval process.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      link: "/student/bookings",
    },
    {
      title: "Incident Tickets",
      desc: "Report faults or hardware issues and get updates from our technical team.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <line x1="13" y1="5" x2="13" y2="19" />
        </svg>
      ),
      link: "/student/tickets",
    },
  ];

  const dashboardStats = [
    { name: "Upcoming Bookings", value: "5", icon: "📅" },
    { name: "Active Requests", value: "2", icon: "📝" },
    { name: "Open Tickets", value: "1", icon: "⚠️" },
    { name: "Announcements", value: "3", icon: "🔔" },
  ];

  const quickActions = [
    { label: "Browse Resources", link: "/student/resources" },
    { label: "Submit Ticket", link: "/student/tickets" },
    { label: "My Bookings", link: "/student/bookings" },
  ];

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header" style={{ marginBottom: "32px" }}>
          <div>
            <p className="kicker">Student Dashboard</p>
            <h1>Welcome back, <span style={{ color: "var(--accent)" }}>{user?.name || "Member"}</span></h1>
            <p>This is your central portal for campus bookings, resource access, and support updates.</p>
          </div>
          <div>
            <Link to="/student/bookings" className="cta-btn" style={{ textDecoration: "none" }}>View Bookings</Link>
          </div>
        </div>

        <div className="role-grid" style={{ marginBottom: "24px" }}>
          {dashboardStats.map((stat, index) => (
            <div key={index} className="glass-card" style={{ padding: "24px", height: "100%" }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>{stat.name}</p>
              <div style={{ fontSize: "34px", fontWeight: "800", color: "var(--ink)" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: "30px", marginBottom: "24px" }}>
          <h2>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginTop: "20px" }}>
            {quickActions.map((action, i) => (
              <Link key={i} to={action.link} style={{ textDecoration: "none" }}>
                <div className="action-card" style={{ padding: "18px", borderRadius: "16px", background: "var(--bg-top)", border: "1px solid var(--outline)", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="role-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {services.map((service, index) => (
            <Link to={service.link} key={index} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ height: "100%", transition: "all 0.3s ease" }}>
                <div style={{ width: "48px", height: "48px", background: "var(--teal-light)", borderRadius: "12px", display: "grid", placeItems: "center", marginBottom: "20px", color: "var(--teal)" }}>
                  {service.icon}
                </div>
                <h3 style={{ color: "var(--ink)", marginBottom: "12px", fontWeight: "800" }}>{service.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)", fontWeight: "600" }}>{service.desc}</p>
                <div style={{ marginTop: "20px", color: "var(--purple)", fontWeight: "800", fontSize: "14px" }}>
                  Launch Service →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
