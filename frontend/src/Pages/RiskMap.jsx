import { useState } from 'react'
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

    setSearchedLocation(location)
  }

  return (
    <div className="riskmap-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>♡</span> SafeHer
        </div>

        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
        </div>

        <button
          className="login-btn"
          onClick={() => window.location.href = '/'}
        >
          Logout
        </button>
      </nav>

      {/* Header */}
      <section className="riskmap-header">
        <h1>Safety Risk Map 🗺️</h1>
        <p>Check safety information about your nearby locations.</p>
      </section>

      {/* Search Location */}
      <section className="riskmap-content">
        <div className="riskmap-form-box">

          <h2>Search Location</h2>
          <p>Enter a location to check its safety information.</p>

          <form onSubmit={handleSearch}>
            <label>Enter Location</label>

            <input
              type="text"
              placeholder="Example: Kothrud, Pune"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button type="submit">
              Search Location
            </button>
          </form>

          {searchedLocation && (
            <div className="riskmap-result">
              <h3>Location Searched</h3>
              <p>📍 {searchedLocation}</p>
              <p>
                Location search completed. Safety information is not
                available yet.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Map Information */}
      <section className="riskmap-info">
        <h2>Location Safety Information</h2>

        <div className="risk-info-grid">

          <div className="risk-info-card">
            <span>🟢</span>
            <h3>Low Risk</h3>
            <p>Areas identified with fewer reported safety concerns.</p>
          </div>

          <div className="risk-info-card">
            <span>🟡</span>
            <h3>Medium Risk</h3>
            <p>Areas where users should remain careful and alert.</p>
          </div>

          <div className="risk-info-card">
            <span>🔴</span>
            <h3>High Risk</h3>
            <p>Areas that may require extra caution and awareness.</p>
          </div>

        </div>

        <p className="riskmap-note">
          Note: These are general risk categories for demonstration.
          Actual location-based risk information is not connected yet.
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

export default RiskMap