import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

export default function AdminRoleRequests() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      navigate("/unauthorized", { replace: true });
      return;
    }

    fetchPendingRequests();
  }, [token, user, navigate]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/auth/role-requests/pending");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load pending requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessing(true);
    try {
      await api.post("/api/auth/role-request/approve", {
        requestId,
      });
      // Remove from list
      setRequests(requests.filter((r) => r.id !== requestId));
      setSelectedRequest(null);
    } catch (err) {
      setError("Failed to approve request");
      console.error("Error approving request:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    setProcessing(true);
    try {
      await api.post("/api/auth/role-request/reject", {
        requestId,
        rejectionReason,
      });
      // Remove from list
      setRequests(requests.filter((r) => r.id !== requestId));
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (err) {
      setError("Failed to reject request");
      console.error("Error rejecting request:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-role-requests-page">
      <div className="requests-container">
        <div className="requests-header">
          <h1>Role Request Management</h1>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading pending requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h2>All requests processed</h2>
            <p>There are no pending role requests at the moment.</p>
          </div>
        ) : (
          <div className="requests-layout">
            <div className="requests-list">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`request-item ${selectedRequest?.id === request.id ? "active" : ""}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="request-header">
                    <h3 className="request-name">{request.userName}</h3>
                    <span className="request-role-badge">{request.requestedRole}</span>
                  </div>
                  <p className="request-email">{request.userEmail}</p>
                  <p className="request-date">
                    Requested: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {selectedRequest && (
              <div className="request-details">
                <div className="details-header">
                  <h2>Request Details</h2>
                  <button className="btn-close" onClick={() => setSelectedRequest(null)}>
                    ✕
                  </button>
                </div>

                <div className="details-section">
                  <h3>User Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedRequest.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedRequest.userEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedRequest.userId}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Request Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Requested Role:</span>
                    <span className="detail-value role-badge">
                      {selectedRequest.requestedRole}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Request Date:</span>
                    <span className="detail-value">
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value status-pending">PENDING</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Actions</h3>

                  <div className="action-group approve">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "✓ Approve Request"}
                    </button>
                    <p className="action-hint">User will immediately get access to their requested dashboard</p>
                  </div>

                  <div className="action-group reject">
                    <textarea
                      className="rejection-textarea"
                      placeholder="Provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      disabled={processing}
                      rows="4"
                    />
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={processing || !rejectionReason.trim()}
                    >
                      {processing ? "Processing..." : "✕ Reject Request"}
                    </button>
                    <p className="action-hint">User will receive a rejection notification</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
