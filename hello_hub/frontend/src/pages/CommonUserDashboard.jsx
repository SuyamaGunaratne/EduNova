import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CommonUserDashboard() {
  const navigate = useNavigate();
  const { user, roleRequest, token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // If user has an approved role, redirect to their dashboard
    if (user?.role) {
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleRequestRole = () => {
    navigate("/select-role", { replace: true });
  };

  return (
    <div className="page common-dashboard-bg">
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🏛️</span>
            <span className="brand-text">Smart Campus HUB</span>
          </div>
          <div className="navbar-actions">
            <button className="btn-neutral" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="common-dashboard-container">
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome, {user?.name}!</h1>
            <p className="welcome-subtitle">
              You're currently waiting for role approval to access the full Smart Campus Hub.
            </p>
          </div>
        </div>

        <div className="dashboard-content">
          {roleRequest?.status === "PENDING" ? (
            <div className="status-card pending">
              <div className="status-icon">⏳</div>
              <h2>Your role request is pending</h2>
              <p>
                You've requested access as a <strong>{roleRequest?.requestedRole}</strong>.
              </p>
              <p className="status-info">
                An administrator is reviewing your request. This typically takes 24 hours.
              </p>
              <div className="pending-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker">✓</div>
                  <div className="timeline-text">Request Submitted</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker">→</div>
                  <div className="timeline-text">Admin Review</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker">→</div>
                  <div className="timeline-text">Access Granted</div>
                </div>
              </div>
            </div>
          ) : roleRequest?.status === "REJECTED" ? (
            <div className="status-card rejected">
              <div className="status-icon">❌</div>
              <h2>Your request was rejected</h2>
              {roleRequest?.rejectionReason && (
                <p className="rejection-reason">
                  <strong>Reason:</strong> {roleRequest.rejectionReason}
                </p>
              )}
              <p className="status-info">
                Please contact your administrator for more information.
              </p>
              <button className="btn-primary" onClick={handleRequestRole}>
                Request Different Role
              </button>
            </div>
          ) : (
            <div className="status-card">
              <div className="status-icon">👤</div>
              <h2>No active role request</h2>
              <p>You haven't requested a role yet.</p>
              <button className="btn-primary" onClick={handleRequestRole}>
                Request a Role
              </button>
            </div>
          )}

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>{user?.email}</p>
            </div>

            {roleRequest && (
              <>
                <div className="info-card">
                  <div className="info-icon">👥</div>
                  <h3>Requested Role</h3>
                  <p>{roleRequest.requestedRole}</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📅</div>
                  <h3>Request Date</h3>
                  <p>{new Date(roleRequest.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">🔔</div>
                  <h3>Status</h3>
                  <p>
                    <span className={`badge badge-${roleRequest.status.toLowerCase()}`}>
                      {roleRequest.status}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="help-section">
            <h3>Need Help?</h3>
            <p>
              If your request is taking longer than expected or you have questions, please contact the campus administration office.
            </p>
            <a href="mailto:admin@campus.edu" className="btn-link">
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
