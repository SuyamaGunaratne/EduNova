import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ExternalLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="page external-dashboard-bg" style={{ minHeight: "100vh" }}>
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🌐</span>
            <span className="brand-text">Smart Campus - External Portal</span>
          </div>
          <div className="navbar-actions">
            <button className="btn-neutral" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
