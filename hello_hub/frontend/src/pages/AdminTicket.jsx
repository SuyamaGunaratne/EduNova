import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";

export default function AdminTicket() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tickets");
      setTickets(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchTechnicians = async () => {
    try {
      // Mock for now, usually filter users by role TECHNICIAN
      const res = await api.get("/api/auth/me"); // Just to test api
      setTechnicians([{ id: "tech-1", name: "Alice Tech" }, { id: "tech-2", name: "Bob Repair" }]);
    } catch (err) { console.error(err); }
  };

  const handleAssign = async (ticketId, techId, techName) => {
    try {
      await api.put(`/api/tickets/${ticketId}/assign`, { technicianId: techId, technicianName: techName });
      fetchTickets();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page mesh-bg">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <h1>Admin Support Dashboard</h1>
          <p>Assign and monitor reported resource issues.</p>
        </div>

        <div className="glass-card" style={{ marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--outline)" }}>
                <th style={{ padding: "12px" }}>Resource</th>
                <th style={{ padding: "12px" }}>Issue</th>
                <th style={{ padding: "12px" }}>Reporter</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Assign Tech</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: "1px solid var(--outline)" }}>
                  <td style={{ padding: "12px" }}><strong>{ticket.resourceName}</strong></td>
                  <td style={{ padding: "12px" }}>{ticket.issue}</td>
                  <td style={{ padding: "12px" }}>{ticket.reporterName}</td>
                  <td style={{ padding: "12px" }}>
                    <span className={`badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {ticket.status === "OPEN" ? (
                      <select 
                        className="role-chip" 
                        onChange={(e) => {
                          const tech = technicians.find(t => t.id === e.target.value);
                          if(tech) handleAssign(ticket.id, tech.id, tech.name);
                        }}
                      >
                        <option value="">Assign Tech...</option>
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{ticket.assignedTechnicianName}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
