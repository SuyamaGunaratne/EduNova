import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

export default function PendingRoleRequestPage() {
  const navigate = useNavigate();
  const { roleRequest, token, logout, setUser, setRoleRequest } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(roleRequest?.status || "PENDING");
  const pollingIntervalRef = useRef(null);

  // Auto-polling for approval status
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const checkApprovalStatus = async () => {
      try {
        const res = await api.get("/api/auth/check-approval");
        const { user, hasApprovedRole, roleRequest: latestRequest } = res.data;

        // Update user in context
        setUser(user);

        if (latestRequest) {
          setStatus(latestRequest.status);
          setRoleRequest(latestRequest);

          // If approved, update local state and redirect
          if (latestRequest.status === "APPROVED" && hasApprovedRole) {
            console.log("✅ Role approved! Redirecting to dashboard...");
            // Stop polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            // Redirect to appropriate dashboard
            setTimeout(() => {
              navigate(`/${user.role.toLowerCase()}`, { replace: true });
            }, 500);
          }
        }
      } catch (err) {
        console.error("Error checking approval status:", err);
      }
    };

    // Initial check
    checkApprovalStatus();

    // Set up polling every 3 seconds
    pollingIntervalRef.current = setInterval(checkApprovalStatus, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [token, navigate, setUser, setRoleRequest]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/api/auth/check-approval");
      const { user, hasApprovedRole, roleRequest: latestRequest } = res.data;

      // Update context
      setUser(user);
      if (latestRequest) {
        setStatus(latestRequest.status);
        setRoleRequest(latestRequest);

        // If approved, redirect
        if (latestRequest.status === "APPROVED" && hasApprovedRole) {
          setTimeout(() => {
            navigate(`/${user.role.toLowerCase()}`, { replace: true });
          }, 500);
        }
      }
    } catch (err) {
      console.error("Error refreshing status:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (logout()) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="page pending-request-bg">
      <div className="pending-request-container">
        <div className="pending-request-card">
          {status === "PENDING" && (
            <>
              <div className="pending-icon">⏳</div>
              <h1 className="pending-title">Role Request Pending</h1>
              <p className="pending-description">
                Your request to access <strong>{roleRequest?.requestedRole}</strong> has been sent to the administrator.
              </p>

              <div className="pending-details">
                <div className="detail-item">
                  <span className="detail-label">Requested Role:</span>
                  <span className="detail-value">{roleRequest?.requestedRole}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value status-badge status-pending">PENDING APPROVAL</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Request Date:</span>
                  <span className="detail-value">
                    {new Date(roleRequest?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pending-message">
                <strong>What happens next?</strong>
                <p>
                  An administrator will review your request. Once approved, you'll be automatically redirected to your dashboard.
                </p>
                <p style={{ fontSize: "0.9em", marginTop: "10px", color: "#666" }}>
                  ⟳ <em>Checking for approval every 3 seconds...</em>
                </p>
              </div>

              <div className="pending-actions">
                <button className="btn-refresh" onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? "Checking..." : "🔄 Check Status"}
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}

          {status === "REJECTED" && (
            <>
              <div className="pending-icon rejected">❌</div>
              <h1 className="pending-title">Request Rejected</h1>
              <p className="pending-description">
                Your request for <strong>{roleRequest?.requestedRole}</strong> has been rejected by the administrator.
              </p>

              <div className="pending-details">
                <div className="detail-item">
                  <span className="detail-label">Requested Role:</span>
                  <span className="detail-value">{roleRequest?.requestedRole}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value status-badge status-rejected">REJECTED</span>
                </div>
                {roleRequest?.rejectionReason && (
                  <div className="detail-item">
                    <span className="detail-label">Reason:</span>
                    <span className="detail-value">{roleRequest.rejectionReason}</span>
                  </div>
                )}
              </div>

              <div className="pending-message warning">
                <strong>Next Steps</strong>
                <p>
                  Please contact your administrator for more information about why your request was rejected.
                </p>
              </div>

              <div className="pending-actions">
                <button className="btn-retry" onClick={() => navigate("/select-role", { replace: true })}>
                  Request Different Role
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}

          {status === "APPROVED" && (
            <>
              <div className="pending-icon approved">✓</div>
              <h1 className="pending-title">Request Approved!</h1>
              <p className="pending-description">
                Congratulations! Your request for <strong>{roleRequest?.requestedRole}</strong> has been approved.
              </p>
              <p className="redirect-message">Redirecting to your dashboard...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
