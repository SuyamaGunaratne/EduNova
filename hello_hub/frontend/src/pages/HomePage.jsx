import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user?.role) {
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    }
  }, [token, user, navigate]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="home-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">Smart Campus HUB</span>
          </div>
          <button className="navbar-login-btn" onClick={handleLoginClick}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Welcome to Innovation</div>
            <h1 className="hero-title">
              Smart Campus <span className="highlight">Operations Hub</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your campus experience with our all-in-one platform.
              Manage bookings, resources, support tickets, and stay informed with real-time notifications.
            </p>
            <button className="hero-cta-btn" onClick={handleLoginClick}>
              Get Started Now
            </button>
          </div>
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-item item-1">📚</div>
              <div className="illustration-item item-2">🔧</div>
              <div className="illustration-item item-3">📅</div>
              <div className="illustration-item item-4">🎓</div>
              <div className="floating-card card-1">
                <div className="card-title">Fast Booking</div>
                <div className="card-indicator">✓</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-title">24/7 Support</div>
                <div className="card-indicator">✓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background */}
        <div className="hero-bg"></div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose Smart Campus HUB?</h2>
          <p className="section-subtitle">Powerful features designed for modern campus management</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Dashboard</h3>
              <p className="feature-description">
                Get comprehensive insights with an intuitive dashboard displaying all your campus operations at a glance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Smart Booking</h3>
              <p className="feature-description">
                Reserve campus resources, facilities, and spaces with an easy-to-use booking system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3 className="feature-title">Ticket System</h3>
              <p className="feature-description">
                Report issues and track support requests with our efficient ticketing system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Notifications</h3>
              <p className="feature-description">
                Stay updated with real-time notifications for bookings, tickets, and important announcements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Resource Library</h3>
              <p className="feature-description">
                Browse and manage available campus resources and facilities in one centralized location.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Multi-Role Support</h3>
              <p className="feature-description">
                Different interfaces for Students, Lecturers, Technicians, and Administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="roles-section">
        <div className="roles-container">
          <h2 className="section-title">Designed for Your Role</h2>
          <p className="section-subtitle">Customize your experience based on your campus position</p>

          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon">🎓</div>
              <h3>Student</h3>
              <p>Book facilities, submit support tickets, and access campus resources</p>
            </div>
            <div className="role-card">
              <div className="role-icon">👨‍🏫</div>
              <h3>Lecturer</h3>
              <p>Manage your schedule, access resources, and coordinate with support</p>
            </div>
            <div className="role-card">
              <div className="role-icon">🔧</div>
              <h3>Technician</h3>
              <p>Handle support tickets, manage resources, and maintain campus systems</p>
            </div>
            <div className="role-card">
              <div className="role-icon">🌐</div>
              <h3>External</h3>
              <p>Access authorized campus portals, events, and extended services</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of students and staff already using Smart Campus HUB</p>
          <button className="cta-btn hero-cta-btn" onClick={handleLoginClick} style={{ fontSize: "1.2rem", padding: "16px 32px" }}>
            Login Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2026 Smart Campus Operations Hub. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
