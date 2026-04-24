import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";

export default function ExternalLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout()) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar-container">
        <nav className="external-sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">🌐</span>
            <span className="brand-text">External Portal</span>
          </div>
          <div className="sidebar-actions">
            {/* Action buttons if needed, Topbar handles logout */}
          </div>
        </nav>
      </div>
      
      <main className="dashboard-main-content">
        <Topbar />
        <div className="dashboard-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
