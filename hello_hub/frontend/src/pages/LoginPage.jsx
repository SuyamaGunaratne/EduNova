import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, token, loginWithToken, fetchMe } = useAuth();
  const [loginMode, setLoginMode] = useState("google"); // "google" or "email"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && user?.role) {
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    }
  }, [token, user, navigate]);

  const googleLoginUrl =
    import.meta.env.VITE_GOOGLE_LOGIN_URL ||
    "http://localhost:8080/oauth2/authorization/google";

  const startGoogleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call your backend login endpoint
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      // Handle successful login
      if (response.data.token) {
        loginWithToken(response.data.token);
        await fetchMe();
        navigate("/select-role", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-scene-bg">
      <div className="login-split-card">
        <div className="login-copy-column">
          <p className="login-eyebrow">Smart Campus Operations Hub</p>
          <h1 className="login-main-title">Welcome Back</h1>
          <p className="login-main-text">
            {loginMode === "google"
              ? "Sign in with your university Google account to get started."
              : "Enter your email and password to access your account."}
          </p>

          {/* Login Mode Tabs */}
          <div className="login-mode-tabs">
            <button
              className={`mode-tab ${loginMode === "google" ? "active" : ""}`}
              onClick={() => {
                setLoginMode("google");
                setError("");
              }}
            >
              <span className="tab-icon">G</span>
              Google
            </button>
            <button
              className={`mode-tab ${loginMode === "email" ? "active" : ""}`}
              onClick={() => {
                setLoginMode("email");
                setError("");
              }}
            >
              <span className="tab-icon">✉</span>
              Email
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Google Login */}
          {loginMode === "google" && (
            <button className="google-signin-btn" onClick={startGoogleLogin}>
              <span className="google-signin-icon" aria-hidden="true">
                G
              </span>
              Sign in with Google
            </button>
          )}

          {/* Email/Password Login */}
          {loginMode === "email" && (
            <form className="email-login-form" onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="your.email@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="email-login-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="forgot-password-link">
                <a href="#forgot">Forgot your password?</a>
              </p>
            </form>
          )}

          <p className="sign-up-text">
            Don't have an account?{" "}
            <a href="#signup" className="sign-up-link">
              Contact your administrator
            </a>
          </p>
        </div>

        <div className="login-visual-column" aria-hidden="true">
          <div className="login-visual-content">
            <div className="login-visual-item item-1">🔐</div>
            <div className="login-visual-item item-2">📱</div>
            <div className="login-visual-item item-3">✓</div>
          </div>
        </div>
      </div>
    </div>
  );
}
