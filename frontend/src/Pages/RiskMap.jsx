
import { useState } from 'react'
import {
  ShieldCheck,
  ArrowLeft,
  MapPin,
  Search,
  LocateFixed,
  AlertCircle,
  Navigation,
  Heart,
  Info,
  Map,
  Phone
} from 'lucide-react'
import '../App.css'

function RiskMap() {
  const [location, setLocation] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchedLocation, setSearchedLocation] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    setError('')
    setSearchedLocation('')

    if (!location.trim()) {
      setError('Please enter a location to search.')
      return
    }

    setSearchedLocation(location.trim())
  }

  function handleCurrentLocation() {
    setError('')

    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.')
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
        setError('')
      },
      (gpsError) => {
        setError('Unable to get your location: ' + gpsError.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000
      }
    )
  }

  function logout() {
    sessionStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="rm-page">
      <nav className="rm-navbar">
        <a href="/dashboard" className="rm-brand">
          <span className="rm-brand-icon">
            <ShieldCheck size={24} />
          </span>
          <span>SafeHer</span>
        </a>

        <div className="rm-nav-right">
          <a href="/dashboard" className="rm-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button className="rm-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="rm-hero">
        <div className="rm-hero-content">
          <span className="rm-eyebrow">
            <MapPin size={15} />
            STAY AWARE. STAY SAFE.
          </span>

          <h1>Safety Risk Map</h1>

          <p>
            Explore locations, stay aware of your surroundings
            and make informed decisions while travelling.
          </p>

          <div className="rm-hero-note">
            <ShieldCheck size={18} />
            <span>Your awareness is your first line of safety.</span>
          </div>
        </div>

        <div className="rm-hero-art">
          <div className="rm-hero-circle">
            <Map size={65} strokeWidth={1.4} />
            <span className="rm-art-heart">
              <Heart size={23} />
            </span>
          </div>
        </div>
      </section>

      <main className="rm-main">
        <section className="rm-search-card">
          <div className="rm-section-heading">
            <div className="rm-heading-icon">
              <Search size={23} />
            </div>

            <div>
              <h2>Explore a Location</h2>
              <p>Search for a place you want to explore.</p>
            </div>
          </div>

          <form className="rm-search-form" onSubmit={handleSearch}>
            <div className="rm-search-input">
              <MapPin size={19} />
              <input
                type="text"
                placeholder="Enter city, area or location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="rm-search-btn">
              <Search size={18} />
              Search
            </button>

            <button
              type="button"
              className="rm-location-btn"
              onClick={handleCurrentLocation}
              disabled={loading}
            >
              <LocateFixed size={18} />
              {loading ? 'Locating...' : 'My Location'}
            </button>
          </form>

          {error && (
            <div className="rm-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </section>

        <section className="rm-map-card">
          <div className="rm-map-heading">
            <div>
              <h2>Explore the Map</h2>
              <p>View your searched location on the map.</p>
            </div>
            <MapPin size={23} />
          </div>

          {searchedLocation ? (
            <div className="rm-location-result">
              <MapPin size={20} />
              <div>
                <strong>Location searched</strong>
                <p>{searchedLocation}</p>
              </div>
            </div>
          ) : null}

          {currentLocation && (
            <div className="rm-location-result">
              <LocateFixed size={20} />
              <div>
                <strong>Your current coordinates</strong>
                <p>
                  Latitude: {currentLocation.latitude.toFixed(6)}
                  <br />
                  Longitude: {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          <div className="rm-map-placeholder">
            <div className="rm-map-placeholder-icon">
              <Map size={48} />
            </div>
            <h3>Map View</h3>
            <p>
              Location search and current GPS coordinates are available.
              Connect a map provider to display the interactive map here.
            </p>
          </div>

          <div className="rm-map-disclaimer">
            <Info size={17} />
            <span>
              This page does not currently display verified live safety
              ratings or danger-zone information.
            </span>
          </div>
        </section>

        <section className="rm-tips-section">
          <div className="rm-tips-heading">
            <ShieldCheck size={23} />
            <div>
              <h2>Smart Safety Tips</h2>
              <p>Keep these precautions in mind when travelling.</p>
            </div>
          </div>

          <div className="rm-tips-grid">
            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <MapPin size={23} />
              </div>
              <h3>Know Your Surroundings</h3>
              <p>
                Learn about the area and identify nearby public places
                before travelling.
              </p>
            </div>

            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <Navigation size={23} />
              </div>
              <h3>Plan Your Route</h3>
              <p>
                Prefer familiar routes and plan your journey in advance.
              </p>
            </div>

            <div className="rm-tip-card">
              <div className="rm-tip-icon">
                <Heart size={23} />
              </div>
              <h3>Stay Connected</h3>
              <p>
                Inform trusted contacts about your travel plans.
              </p>
            </div>
          </div>
        </section>

        <section className="rm-emergency-card">
          <div className="rm-emergency-icon">
            <Phone size={25} />
          </div>

          <div>
            <h3>Need Emergency Assistance?</h3>
            <p>
              If you are in immediate danger, move to a safer place
              and contact emergency services or someone you trust.
            </p>
            <strong>India Emergency Helpline: 112</strong>
          </div>
        </section>
      </main>

      <footer className="rm-footer">
        <div className="rm-footer-brand">
          <ShieldCheck size={22} />
          <span>SafeHer</span>
        </div>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <span>© 2026 SafeHer. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default RiskMap
