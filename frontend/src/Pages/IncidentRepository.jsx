
import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  FileText,
  ClipboardList,
  AlertTriangle,
  MapPin,
  CalendarDays,
  Trash2,
  ArrowLeft,
  Heart,
  Eye,
  MessageCircle,
  Siren,
  Navigation
} from 'lucide-react'

import api from '../services/api'
import '../App.css'

function IncidentReporting() {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  // Incident coordinates
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [locationStatus, setLocationStatus] = useState('')

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const today = new Date()

  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  // Generate geohash from latitude and longitude
  function generateGeohash(lat, lon, precision = 7) {

    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

    let latMin = -90
    let latMax = 90
    let lonMin = -180
    let lonMax = 180

    let isEven = true
    let bit = 0
    let ch = 0
    let geohash = ''

    while (geohash.length < precision) {

      if (isEven) {

        const mid = (lonMin + lonMax) / 2

        if (lon >= mid) {
          ch |= (1 << (4 - bit))
          lonMin = mid
        } else {
          lonMax = mid
        }

      } else {

        const mid = (latMin + latMax) / 2

        if (lat >= mid) {
          ch |= (1 << (4 - bit))
          latMin = mid
        } else {
          latMax = mid
        }
      }

      isEven = !isEven

      if (bit < 4) {
        bit++
      } else {
        geohash += BASE32[ch]
        bit = 0
        ch = 0
      }
    }

    return geohash
  }

  // Get current location with user's permission
  function useCurrentLocation() {

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.')
      return
    }

    setLocationStatus('Getting your location...')

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude
        const lon = position.coords.longitude

        setLatitude(lat)
        setLongitude(lon)

        setLocationStatus(
          `Location captured: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
        )
      },

      (error) => {

        console.error('Location error:', error)

        if (error.code === 1) {
          setLocationStatus('Location permission denied. Please allow location access.')
        } else if (error.code === 2) {
          setLocationStatus('Your location is currently unavailable.')
        } else {
          setLocationStatus('Unable to get location. Please try again.')
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  // Load logged-in user's reports
  async function fetchReports() {

    try {

      setLoading(true)

      const response = await api.get('/reports/my')

      setReports(Array.isArray(response.data) ? response.data : [])

    } catch (error) {

      console.error('Fetch reports error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to load reports. Please login again if your session expired.'
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // Submit incident report
  async function handleSubmit(e) {

    e.preventDefault()

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !date ||
      !location.trim()
    ) {

      alert('Please fill all the fields')
      return
    }

    if (date > maxDate) {

      alert('Incident date cannot be in the future')
      return
    }

    // Generate geohash only when coordinates are available
    let geohash = null

    if (latitude !== null && longitude !== null) {
      geohash = generateGeohash(latitude, longitude)
    }

    const reportData = {

      title: title.trim(),
      category: category,
      description: description.trim(),
      incidentDate: date,
      location: location.trim(),

      latitude: latitude,
      longitude: longitude,
      geohash: geohash
    }

    try {

      setSubmitting(true)

      console.log('REPORT DATA:', reportData)

      await api.post('/reports', reportData)

      alert('Incident reported successfully!')

      setTitle('')
      setCategory('')
      setDescription('')
      setDate('')
      setLocation('')

      setLatitude(null)
      setLongitude(null)
      setLocationStatus('')

      await fetchReports()

    } catch (error) {

      console.error('Submit report error:', error)

      alert(
        error.response?.data?.message ||
        'Failed to submit report. Please try again.'
      )

    } finally {

      setSubmitting(false)
    }
  }

  // Delete report from database
  async function deleteReport(id) {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report?'
    )

    if (!confirmDelete) {
      return
    }

    try {

      setDeletingId(id)

      await api.delete(`/reports/${id}`)

      setReports(previousReports =>
        previousReports.filter(report => report.id !== id)
      )

      alert('Report deleted successfully!')

    } catch (error) {

      console.error('Delete report error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to delete report.'
      )

    } finally {

      setDeletingId(null)
    }
  }

  // Format date
  function formatDate(value) {

    if (!value) {
      return 'Date not available'
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Category icon
  function getCategoryIcon(value) {

    if (value === 'Harassment' || value === 'Stalking') {
      return <Eye size={17} />
    }

    if (value === 'Unsafe Location') {
      return <MapPin size={17} />
    }

    if (value === 'Verbal Abuse') {
      return <MessageCircle size={17} />
    }

    if (value === 'Physical Threat') {
      return <AlertTriangle size={17} />
    }

    return <FileText size={17} />
  }

  return (

    <div className="ir-page">

      {/* Navbar */}
      <nav className="ir-navbar">

        <a href="/dashboard" className="ir-brand">
          <div className="ir-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="ir-nav-right">

          <a href="/dashboard" className="ir-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            className="ir-logout-btn"
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

      {/* Hero */}
      <section className="ir-hero">

        <div className="ir-hero-content">

          <div className="ir-small-label">
            <ShieldCheck size={15} />
            YOUR VOICE MATTERS
          </div>

          <h1>Incident Reporting</h1>

          <p>
            Share details of safety-related incidents.
            Your reports can help create awareness and support safer spaces.
          </p>

          <div className="ir-hero-note">
            <Heart size={18} />
            <span>
              Your experience matters. Your voice deserves to be heard.
            </span>
          </div>

        </div>

        <div className="ir-hero-art">

          <div className="ir-hero-circle">
            <ClipboardList size={65} strokeWidth={1.4} />
            <span><Heart size={23} /></span>
          </div>

        </div>

      </section>

      {/* Main */}
      <main className="ir-main">

        {/* Form */}
        <section className="ir-form-card">

          <div className="ir-section-heading">

            <div className="ir-heading-icon">
              <FileText size={23} />
            </div>

            <div>
              <h2>Report an Incident</h2>
              <p>Provide the details below to create your report.</p>
            </div>

          </div>

          <div className="ir-privacy-note">

            <ShieldCheck size={20} />

            <p>
              Please share only the information you feel comfortable
              providing. Avoid including passwords or other sensitive
              account details.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="ir-form">

            <div className="ir-form-group">

              <label htmlFor="incidentTitle">
                Incident Title
              </label>

              <input
                id="incidentTitle"
                type="text"
                placeholder="Enter a short title"
                value={title}
                maxLength="120"
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>

            <div className="ir-form-group">

              <label htmlFor="incidentCategory">
                Incident Category
              </label>

              <select
                id="incidentCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                <option value="">Select incident category</option>
                <option value="Harassment">Harassment</option>
                <option value="Stalking">Stalking</option>
                <option value="Unsafe Location">Unsafe Location</option>
                <option value="Verbal Abuse">Verbal Abuse</option>
                <option value="Physical Threat">Physical Threat</option>
                <option value="Other">Other</option>

              </select>

            </div>

            <div className="ir-form-group ir-full-width">

              <label htmlFor="incidentDescription">
                Incident Description
              </label>

              <textarea
                id="incidentDescription"
                placeholder="Describe what happened..."
                rows="5"
                maxLength="1000"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <span className="ir-character-count">
                {description.length}/1000 characters
              </span>

            </div>

            <div className="ir-form-group">

              <label htmlFor="incidentDate">
                Incident Date
              </label>

              <div className="ir-input-icon">

                <CalendarDays size={18} />

                <input
                  id="incidentDate"
                  type="date"
                  max={maxDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

              </div>

            </div>

            <div className="ir-form-group">

              <label htmlFor="incidentLocation">
                Incident Location
              </label>

              <div className="ir-input-icon">

                <MapPin size={18} />

                <input
                  id="incidentLocation"
                  type="text"
                  placeholder="Enter incident location"
                  maxLength="200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

              </div>

            </div>

            {/* Coordinates */}
            <div className="ir-form-group ir-full-width">

              <label>
                Incident Coordinates (Optional)
              </label>

              <p>
                If the incident happened at your current location,
                click the button below to capture its coordinates.
              </p>

              <button
                type="button"
                className="ir-submit-btn"
                onClick={useCurrentLocation}
                disabled={submitting}
              >

                <Navigation size={18} />
                Use My Current Location

              </button>

              {locationStatus && (
                <p style={{ marginTop: '10px' }}>
                  {locationStatus}
                </p>
              )}

              {latitude !== null && longitude !== null && (

                <p style={{ marginTop: '8px' }}>
                  Latitude: {latitude.toFixed(6)}
                  <br />
                  Longitude: {longitude.toFixed(6)}
                </p>

              )}

            </div>

            <button
              type="submit"
              className="ir-submit-btn"
              disabled={submitting}
            >

              <FileText size={18} />

              {submitting
                ? 'Submitting...'
                : 'Submit Incident Report'}

            </button>

          </form>

          <div className="ir-form-footer">

            <ShieldCheck size={17} />

            <span>
              Speak up. Create awareness. Support safer spaces.
            </span>

          </div>

        </section>

        {/* Reports */}
        <section className="ir-reports-section">

          <div className="ir-reports-heading">

            <div>
              <h2>My Incident Reports</h2>
              <p>Review the reports you have submitted.</p>
            </div>

            <div className="ir-report-count">
              <ClipboardList size={19} />
              <span>{reports.length} Reports</span>
            </div>

          </div>

          {loading ? (

            <div className="ir-empty-state">
              <h3>Loading your reports...</h3>
            </div>

          ) : reports.length === 0 ? (

            <div className="ir-empty-state">

              <div className="ir-empty-icon">
                <ClipboardList size={42} />
              </div>

              <h3>No Reports Submitted Yet</h3>

              <p>
                Your submitted incident reports will appear here.
                Use the form above to add your first report.
              </p>

            </div>

          ) : (

            <div className="ir-reports-grid">

              {reports.map((report) => (

                <article
                  className="ir-report-card"
                  key={report.id}
                >

                  <div className="ir-report-top">

                    <div className="ir-report-icon">
                      {getCategoryIcon(report.category)}
                    </div>

                    <span className="ir-category-badge">
                      {report.category}
                    </span>

                  </div>

                  <h3>{report.title}</h3>

                  <div className="ir-report-description">

                    <span>Description</span>

                    <p>{report.description}</p>

                  </div>

                  <div className="ir-report-meta">

                    <div>
                      <CalendarDays size={16} />
                      <span>
                        {formatDate(report.incidentDate)}
                      </span>
                    </div>

                    <div>
                      <MapPin size={16} />
                      <span>{report.location}</span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="ir-delete-btn"
                    disabled={deletingId === report.id}
                    onClick={() => deleteReport(report.id)}
                  >

                    <Trash2 size={16} />

                    {deletingId === report.id
                      ? 'Deleting...'
                      : 'Delete Report'}

                  </button>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* Support Note */}
        <div className="ir-support-note">

          <div className="ir-support-icon">
            <Siren size={23} />
          </div>

          <div>

            <h3>Need immediate help?</h3>

            <p>
              If you are in immediate danger, move to a safer place
              if possible and contact local emergency services.
              In India, you can call 112 for emergency assistance.
            </p>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="ir-footer">

        <div className="ir-footer-brand">
          <ShieldCheck size={21} />
          <span>SafeHer</span>
        </div>

        <p>Stay Safe. Stay Strong. Stay Confident.</p>

        <span>© 2026 SafeHer. All rights reserved.</span>

      </footer>

    </div>

  )
}

export default IncidentReporting
