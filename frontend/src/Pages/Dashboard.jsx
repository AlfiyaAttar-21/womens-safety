import '../App.css'

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>♡</span> SafeHer
        </div>

        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="#profile">My Profile</a>
        </div>

        <button
          className="login-btn"
          onClick={() => window.location.href = '/'}
        >
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <h1>Welcome to SafeHer! 💜</h1>
        <p>Your personal safety companion is here to support you.</p>
      </section>

      {/* SOS Section */}
      <section className="dashboard-sos">
        <h2>Need Emergency Help?</h2>
        <p>Access emergency support whenever you need it.</p>

        <button className="dashboard-sos-btn">
          SOS
        </button>

        <span>Emergency Support</span>
      </section>

      {/* Features Section */}
      <section className="dashboard-features">

        <h2>Your Safety Services</h2>
        <p>Choose a service to continue.</p>

        <div className="feature-container">

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Trusted Contacts</h3>
            <p>Add and manage your emergency contacts.</p>
            <button>Open</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛣️</div>
            <h3>Safe Journey</h3>
            <p>Keep your trusted contacts informed about your journey.</p>
            <button>Open</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Incident Reporting</h3>
            <p>Report safety-related incidents.</p>
            <button>Open</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Safety Risk Map</h3>
            <p>Explore safety information about locations.</p>
            <button>Open</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Safety Assistant</h3>
            <p>Get safety guidance from your AI assistant.</p>
            <button>Open</button>
          </div>

          <div className="feature-card" id="profile">
            <div className="feature-icon">👤</div>
            <h3>My Profile</h3>
            <p>View and manage your account details.</p>
            <button
            onClick={() => window.location.href = '/trusted-contacts'}
          >Open</button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer>
        <h2>♡ SafeHer</h2>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <p>© 2026 SafeHer. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Dashboard