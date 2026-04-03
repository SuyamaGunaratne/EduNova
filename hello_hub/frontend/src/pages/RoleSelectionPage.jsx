import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const roles = ["STUDENT", "LECTURER", "TECHNICIAN", "EXTERNAL"];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setUser, setRoleRequest } = useAuth();
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/api/auth/select-role", { role: selectedRole });
      
      // Update auth context with user and role request info
      setUser(res.data.user);
      setRoleRequest(res.data.roleRequest);

      // Navigate to pending request page
      navigate("/pending-role-approval", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request role");
      console.error("Role request error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page role-scene-bg">
      <div className="role-split-card">
        <div className="role-copy-column">
          <p className="login-eyebrow">First Login Setup</p>
          <h1 className="role-main-title">Select your access role</h1>
          <p className="role-main-text">
            Choose the role you want to use. Your request will be reviewed by an administrator.
            Once approved, you'll have access to your role-specific dashboard.
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="role-option-grid">
            {roles.map((role) => (
              <button
                key={role}
                className={`role-option-btn ${selectedRole === role ? "active" : ""}`}
                onClick={() => setSelectedRole(role)}
                type="button"
                disabled={submitting}
              >
                <span className="role-option-title">{role}</span>
                <span className="role-option-subtitle">Request {role.toLowerCase()} access</span>
              </button>
            ))}
          </div>

          <button className="role-continue-btn" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Sending request..." : "Request Role"}
          </button>

          <p className="role-info-text">
            💡 Only administrators can create accounts. Contact your administrator if you don't see your role.
          </p>
        </div>

        <div className="role-visual-column" aria-hidden="true">
          <div className="role-visual-glow" />
          <div className="role-badge role-badge-student">STUDENT</div>
          <div className="role-badge role-badge-lecturer">LECTURER</div>
          <div className="role-badge role-badge-technician">TECHNICIAN</div>
          <div className="role-badge role-badge-external">EXTERNAL</div>
          <div className="role-visual-icons">
            <div className="visual-icon icon-1">🎓</div>
            <div className="visual-icon icon-2">👨‍🏫</div>
            <div className="visual-icon icon-3">🔧</div>
            <div className="visual-icon icon-4">🌐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
