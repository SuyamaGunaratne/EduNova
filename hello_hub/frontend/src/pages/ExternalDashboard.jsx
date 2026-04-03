import { useAuth } from "../context/AuthContext";

export default function ExternalDashboard() {
  const { user } = useAuth();

  return (
    <div className="external-dashboard-container" style={{ padding: "2rem" }}>
      <div className="welcome-section" style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" }}>
        <h1>Welcome, {user?.name}!</h1>
        <p>This is the External User Dashboard. Here you can access specific services assigned to your role.</p>
      </div>

      <div className="dashboard-content" style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        <div className="info-card" style={{ padding: "1.5rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏢</div>
          <h3>Boarding Management</h3>
          <p>Register and manage your boarding properties for students.</p>
          <button className="btn-primary" style={{ marginTop: "1rem" }}>View Properties</button>
        </div>

        <div className="info-card" style={{ padding: "1.5rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📧</div>
          <h3>Profile & Settings</h3>
          <p>Manage your external account profile, email, and preferences.</p>
          <button className="btn-secondary" style={{ marginTop: "1rem" }}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
