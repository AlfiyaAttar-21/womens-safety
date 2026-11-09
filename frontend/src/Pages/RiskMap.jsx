
import { useState } from 'react'
import {
  ShieldCheck,
  MapPin,
  Search,
  AlertTriangle,
  ShieldCheck as SafeIcon,
  Navigation,
  ArrowLeft,
  Info,
  Eye,
  Clock,
  Heart,
  Map
} from 'lucide-react'
import '../App.css'

function RiskMap() {
  const [location, setLocation] = useState('')
  const [searchedLocation, setSearchedLocation] = useState('')

  function handleSearch(e) {
    e.preventDefault()

    if (!location.trim()) {
      alert('Please enter a location')
      return
    }

    setSearchedLocation(location.trim())
  }

  return (
    <div className="rm-page">

      {/* Navbar */}
      <nav className="rm-navbar">

        <a href="/dashboard" className="rm-brand">
          <div className="rm-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="rm-nav-right">

          <a href="/dashboard" className="rm-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            className="rm-logout-btn"
            onClick={() => {
              sessionStorage.removeItem('safeherAccessToken')
              sessionStorage.removeItem('safeherRefreshToken')
              sessionStorage.removeItem('safeherUserId')
              sessionStorage.removeItem('safeherUserName')
              sessionStorage.removeItem('safeherPhoneNumber')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="rm-hero">

        <div className="rm-hero-content">

          <div className="rm-small-label">
            <MapPin size={15} />
            LOCATION AWARENESS
          </div>

          <h1>Safety Risk Map</h1>

          <p>
            Explore location safety awareness and understand
            different risk levels before planning your journey.
          </p>

          <div className="rm-hero-note">
            <ShieldCheck size={18} />
            <span>Stay aware. Stay alert. Stay safe.</span>
          </div>

        </div>

        <div className="rm-hero-art">
          <div className="rm-map-circle">
            <Map size={65} strokeWidth={1.4} />
            <span><MapPin size={25} /></span>
          </div>
        </div>

      </section>

      {/* Main Content */}
      <main className="rm-main">

        {/* Search Card */}
        <section className="rm-search-card">

          <div className="rm-section-heading">

            <div className="rm-heading-icon">
              <Search size={23} />
            </div>

            <div>
              <h2>Search Location</h2>
              <p>Enter a location to explore its safety information.</p>
            </div>

          </div>

          <form onSubmit={handleSearch} className="rm-search-form">

            <label htmlFor="riskLocation">Enter Location</label>

            <div className="rm-search-input">
              <MapPin size={19} />

              <input
                id="riskLocation"
                type="text"
                placeholder="Example: Kothrud, Pune"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

            </div>

            <button type="submit" className="rm-search-btn">
              <Search size={18} />
              Search Location
            </button>

          </form>

          {/* Search Result */}
          {searchedLocation && (

            <div className="rm-result-card">

              <div className="rm-result-icon">
                <MapPin size={23} />
              </div>

              <div className="rm-result-content">
                <span>LOCATION SEARCHED</span>
                <h3>{searchedLocation}</h3>
                <p>
                  Your location search was completed.
                  Verified safety information is not available yet.
                </p>
              </div>

              <div className="rm-result-status">
                <Info size={17} />
                <span>Demo Result</span>
              </div>

            </div>

          )}

        </section>

        {/* Risk Categories */}
        <section className="rm-risk-section">

          <div className="rm-section-title">
            <div>
              <h2>Location Safety Levels</h2>
              <p>Understand the different safety risk categories.</p>
            </div>

            <div className="rm-info-label">
              <Info size={16} />
              Risk Guide
            </div>
          </div>

          <div className="rm-risk-grid">

            {/* Low Risk */}
            <div className="rm-risk-card rm-low">

              <div className="rm-risk-icon">
                <SafeIcon size={27} />
              </div>

              <div className="rm-risk-label">
                LOW RISK
              </div>

              <h3>Low Risk Area</h3>

              <p>
                Areas identified with fewer reported safety concerns.
                Continue following normal safety precautions.
              </p>

              <div className="rm-risk-bottom">
                <ShieldCheck size={16} />
                <span>Remain aware</span>
              </div>

            </div>

            {/* Medium Risk */}
            <div className="rm-risk-card rm-medium">

              <div className="rm-risk-icon">
                <Eye size={27} />
              </div>

              <div className="rm-risk-label">
                MEDIUM RISK
              </div>

              <h3>Medium Risk Area</h3>

              <p>
                Areas where extra awareness may be helpful.
                Prefer familiar and well-lit routes.
              </p>

              <div className="rm-risk-bottom">
                <Eye size={16} />
                <span>Stay alert</span>
              </div>

            </div>

            {/* High Risk */}
            <div className="rm-risk-card rm-high">

              <div className="rm-risk-icon">
                <AlertTriangle size={27} />
              </div>

              <div className="rm-risk-label">
                HIGH RISK
              </div>

              <h3>High Risk Area</h3>

              <p>
                Areas that may require additional caution.
                Consider safer alternatives when possible.
              </p>

              <div className="rm-risk-bottom">
                <AlertTriangle size={16} />
                <span>Extra caution</span>
              </div>

            </div>

          </div>

          <div className="rm-disclaimer">
            <Info size={19} />
            <p>
              <strong>Important:</strong> These risk categories are
              for demonstration only. They do not represent actual
              safety ratings of any location.
            </p>
          </div>

        </section>

        {/* Safety Tips */}
        <section className="rm-tips-section">

          <div className="rm-tips-heading">
            <div className="rm-heading-icon">
              <Heart size={23} />
            </div>

            <div>
              <h2>Smart Safety Tips</h2>
              <p>Simple precautions for safer travel.</p>
            </div>
          </div>

          <div className="rm-tips-grid">

            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <Navigation size={21} />
              </div>
              <div>
                <h3>Choose Familiar Routes</h3>
                <p>Prefer routes you know and areas with public activity.</p>
              </div>
            </div>

            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <Clock size={21} />
              </div>
              <div>
                <h3>Prefer Well-Lit Areas</h3>
                <p>Use properly lit streets, especially during late hours.</p>
              </div>
            </div>

            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <Heart size={21} />
              </div>
              <div>
                <h3>Inform Trusted Contacts</h3>
                <p>Share your travel plans with someone you trust.</p>
              </div>
            </div>

          </div>

        </section>

        {/* Emergency Note */}
        <div className="rm-emergency-note">

          <div className="rm-emergency-icon">
            <AlertTriangle size={23} />
          </div>

          <div>
            <h3>Need Immediate Help?</h3>
            <p>
              If you are in immediate danger, move to a safer place
              if possible and contact emergency services.
              In India, call 112 for emergency assistance.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="rm-footer">

        <div className="rm-footer-brand">
          <ShieldCheck size={21} />
          <span>SafeHer</span>
        </div>

        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <span>© 2026 SafeHer. All rights reserved.</span>

      </footer>

    </div>
  )
}

export default RiskMap
