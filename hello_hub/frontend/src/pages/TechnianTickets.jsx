import React, { useState } from 'react';
import api from '../api/axiosClient';

export default function TechnianTickets() {
  const [tickets, setTickets] = useState([
    {
      id: "T-1001",
      resourceId: "RES-005",
      resourceName: "Projector B (Lab 101)",
      issue: "Lamp failure / No display",
      priority: "HIGH",
      assignedAt: "2026-04-20 09:30 AM",
      status: "IN_PROGRESS"
    },
    {
      id: "T-1002",
      resourceId: "RES-012",
      resourceName: "Conference Room A",
      issue: "HDMI cable port damaged",
      priority: "MEDIUM",
      assignedAt: "2026-04-21 02:00 PM",
      status: "ASSIGNED"
    }
  ]);

  const technicianStats = [
    { name: "Assigned Tickets", value: tickets.length, icon: "🧰" },
    { name: "High Priority", value: tickets.filter(t => t.priority === "HIGH").length, icon: "🔥" },
    { name: "Open Alerts", value: 4, icon: "🚨" },
    { name: "Resources Online", value: 76, icon: "🔌" },
  ];

  const quickActions = [
    { label: "New Inspection", link: "/technician/tickets" },
    { label: "My Schedule", link: "/technician/schedule" },
    { label: "Submit Report", link: "/technician/report" },
    { label: "Team Updates", link: "/technician/tickets" },
  ];

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header" style={{ marginBottom: "20px" }}>
          <div>
            <p className="kicker">Technician Command Center</p>
            <h1>Assigned Maintenance Work</h1>
            <p>Monitor assigned tickets, update status, and keep campus systems running smoothly.</p>
          </div>
          <div className="glass-card" style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#1e7e34" }}></div>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>Technician Online</span>
          </div>
        </div>

        <div className="role-grid" style={{ marginBottom: "24px" }}>
          {technicianStats.map((stat, index) => (
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
              <a href={action.link} key={i} className="action-card" style={{ display: "block", padding: "18px", borderRadius: "16px", background: "var(--bg-top)", border: "1px solid var(--outline)", textAlign: "center", textDecoration: "none", color: "var(--ink)" }}>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>{action.label}</p>
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px", marginTop: "20px" }}>
          {tickets.map(ticket => (
            <div key={ticket.id} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: ticket.priority === "HIGH" ? "4px solid #d93025" : "4px solid #f9ab00" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "bold" }}>#{ticket.id}</span>
                  <h3 style={{ marginTop: "4px" }}>{ticket.resourceName}</h3>
                  <span style={{ fontSize: "11px", backgroundColor: "var(--outline)", padding: "2px 6px", borderRadius: "4px" }}>Resource ID: {ticket.resourceId}</span>
                </div>
                <span className={`badge ${ticket.status.toLowerCase()}`} style={{ 
                  padding: "4px 8px", 
                  borderRadius: "6px", 
                  fontSize: "11px", 
                  fontWeight: "bold",
                  backgroundColor: ticket.status === "IN_PROGRESS" ? "#e8f0fe" : "#f1f3f4",
                  color: ticket.status === "IN_PROGRESS" ? "#1967d2" : "#5f6368"
                }}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--bg-top)", borderRadius: "8px", border: "1px solid var(--outline)" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)", margin: 0 }}>{ticket.issue}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "12px", color: "var(--muted)" }}>
                <span>Assigned: {ticket.assignedAt}</span>
                <span style={{ color: ticket.priority === "HIGH" ? "#d93025" : "#b45d00", fontWeight: "bold" }}>{ticket.priority} PRIORITY</span>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button 
                  className="cta-btn" 
                  style={{ flex: 1, fontSize: "13px", padding: "8px" }}
                  onClick={async () => {
                    try {
                      await api.put(`/api/resources/${ticket.resourceId}/status`, { status: "AVAILABLE" });
                      alert(`Resource ${ticket.resourceName} marked as AVAILABLE!`);
                      setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: "COMPLETED" } : t));
                    } catch (err) {
                      console.error("Failed to update resource status:", err);
                    }
                  }}
                >
                  Mark as Repaired
                </button>
                <button className="cta-btn secondary" style={{ flex: 1, fontSize: "13px", padding: "8px" }}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
            <h3>No Pending Tickets</h3>
            <p>All assigned maintenance tasks are completed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
