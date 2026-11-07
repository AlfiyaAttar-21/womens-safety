import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import TrustedContacts from './Pages/TrustedContacts'

function App() {
  const path = window.location.pathname

  // Login Page
  if (path === '/login') {
    return <Login />
  }

  // Register Page
  if (path === '/register') {
    return <Register />
  }

   // Dashborad Page
  if (path === '/dashboard') {
    return <Dashboard />
  }

   // TrustedContact Page
  if (path === '/trusted-contacts') {
    return <TrustedContacts />
  }

  return (
    <div className="app">

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <span>♡</span> SafeHer
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
        </div>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => window.location.href = '/login'}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => window.location.href = '/register'}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">

        <div className="hero-content">
          <span className="welcome-tag">YOUR SAFETY MATTERS</span>

          <h1>
            Your Safety.<br />
            Your Freedom.<br />
            <span>Your Confidence.</span>
          </h1>

          <p>
            A smart safety companion designed to help women
            stay safe, connected and confident wherever they go.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => window.location.href = '/register'}
            >
              Get Started →
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                document.getElementById('features').scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              Explore Features
            </button>
          </div>

          <div className="trust-text">
            Your safety is our priority.
          </div>
        </div>

        <div className="hero-visual">
          <div className="safety-card">
            <div className="shield-icon">🛡️</div>
            <h2>Stay Safe, Stay Confident</h2>
            <p>Your personal safety companion</p>

            <div className="status-box">
              <span className="status-dot"></span>
              Safety starts with awareness
            </div>

            <div className="sos-preview">
              <span>EMERGENCY SUPPORT</span>
              <div className="sos-circle">SOS</div>
              <p>Quick access to emergency assistance</p>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-heading">
          <span>WHAT WE OFFER</span>
          <h2>Your Safety, Simplified</h2>
          <p>Smart tools to support you in your everyday journey.</p>
        </div>

        <div className="feature-container">

          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>SOS Emergency</h3>
            <p>Quickly send emergency alerts to your trusted contacts.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Trusted Contacts</h3>
            <p>Manage the people who matter most during emergencies.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Live Location</h3>
            <p>Share your location with trusted people when needed.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛣️</div>
            <h3>Safe Journey</h3>
            <p>Keep your trusted contacts informed during your journey.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Safety Assistant</h3>
            <p>Get helpful safety guidance with AI-powered assistance.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Safety Risk Map</h3>
            <p>Explore safety information about different locations.</p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>Empowering Women Through Technology</h2>
        <p>
          SafeHer brings safety tools and smart technology together
          to help women feel more confident in their everyday lives.
        </p>
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

export default App