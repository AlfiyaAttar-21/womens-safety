
import { useState, useRef } from 'react'
import api from '../services/api'
import {
  ShieldCheck,
  MapPin,
  Navigation,
  CalendarDays,
  Clock,
  Route,
  CheckCircle2,
  CircleDot,
  Flag,
  ArrowLeft,
  CarFront,
  Heart,
  AlertCircle,
  Radio,
  LocateFixed
} from 'lucide-react'
import '../App.css'

function SafeJourney() {
  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')

  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyDetails, setJourneyDetails] = useState(null)

  const [loading, setLoading] = useState(false)
  const [trackingActive, setTrackingActive] = useState(false)
  const [trackingToken, setTrackingToken] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [lastLocation, setLastLocation] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const watchIdRef = useRef(null)
  const userId = sessionStorage.getItem('safeherUserId')

  const today = new Date()

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  async function handleStartJourney(e) {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!userId) {
      setError('Please login again. User information not found.')
      return
    }

    if (
      !startingPoint.trim() ||
      !destination.trim() ||
      !arrivalDate ||
      !arrivalTime
    ) {
      setError('Please fill all the fields.')
      return
    }

    const arrival = new Date(arrivalDate + 'T' + arrivalTime)

    if (arrival <= new Date()) {
      setError('Please select a future arrival date and time.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/journeys/start/' + userId,
        {
          destination: destination.trim(),
          expectedArrivalTime: arrivalDate + 'T' + arrivalTime + ':00'
        }
      )

      const journey = response.data

      if (!journey.id) {
        throw new Error('Journey ID was not received.')
      }

      setJourneyDetails({
        id: journey.id,
        startingPoint: startingPoint.trim(),
        destination: journey.destination || destination.trim(),
        arrivalDate,
        arrivalTime,
        status: journey.status || 'ACTIVE'
      })

      setJourneyStarted(true)
      setMessage('Your journey has been saved successfully!')

    } catch (err) {
      console.error('START JOURNEY ERROR:', err)

      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : '') ||
        err.message ||
        'Unable to start journey.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckIn() {
    if (!journeyDetails?.id || !userId) return

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await api.put(
        '/journeys/' + journeyDetails.id + '/check-in/' + userId
      )

      setMessage('Journey check-in successful!')

    } catch (err) {
      console.error('CHECK-IN ERROR:', err)
      setError(err.response?.data?.message || 'Unable to check in.')
    } finally {
      setLoading(false)
    }
  }

  function stopGpsWatch() {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
      console.log('GPS WATCH STOPPED')
    }
  }

  async function handleStartTracking() {
    setError('')
    setMessage('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    try {
      setLoading(true)

      // Stop any previous GPS watch before starting a new one.
      stopGpsWatch()

      console.log('SENDING TRACKING START REQUEST')

      const response = await api.post('/tracking/start')

      console.log('NEW TRACKING STARTED:', response.data)

      const token = response.data.trackingToken
      const url = response.data.trackingUrl

      if (!token) {
        throw new Error('Tracking token was not received.')
      }

      setTrackingToken(token)
      setTrackingUrl(url || '')
      setTrackingActive(true)

      console.log('TRACKING ACTIVE SET TO TRUE')

      setMessage('Live tracking started. Getting your GPS location...')

      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          console.log('GPS LOCATION RECEIVED:', latitude, longitude)

          setLastLocation({ latitude, longitude })

          try {
            await api.post('/tracking/location', {
              trackingToken: token,
              latitude,
              longitude
            })

            console.log('LOCATION SENT SUCCESSFULLY')

          } catch (err) {
            console.error('LOCATION UPDATE ERROR:', err)

            setError(
              err.response?.data?.message ||
              'Unable to send GPS location to server.'
            )
          }
        },
        (gpsError) => {
          console.error('GPS ERROR:', gpsError)

          setError('GPS error: ' + gpsError.message)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000
        }
      )

      watchIdRef.current = watchId

      console.log('GPS WATCH ID:', watchId)

    } catch (err) {
      console.error('TRACKING ERROR:', err)

      setTrackingActive(false)
      setTrackingToken('')
      setTrackingUrl('')

      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to start live tracking.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleStopTracking() {
    try {
      setLoading(true)
      setError('')

      console.log('STOP TRACKING BUTTON CLICKED')

      stopGpsWatch()

      await api.post('/tracking/stop')

      setTrackingActive(false)
      setTrackingToken('')
      setTrackingUrl('')
      setLastLocation(null)

      setMessage('Live tracking stopped successfully.')

    } catch (err) {
      console.error('STOP TRACKING ERROR:', err)

      setError(err.response?.data?.message || 'Unable to stop tracking.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEndJourney() {
    if (!journeyDetails?.id) return

    if (!window.confirm('Are you sure you want to complete this journey?')) {
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await api.put(
        '/journeys/' + journeyDetails.id + '/complete/' + userId
      )

      if (trackingActive) {
        console.log('STOPPING TRACKING BECAUSE JOURNEY COMPLETED')

        stopGpsWatch()
        await api.post('/tracking/stop')
      }

      setJourneyStarted(false)
      setJourneyDetails(null)
      setTrackingActive(false)
      setTrackingToken('')
      setTrackingUrl('')
      setLastLocation(null)

      setStartingPoint('')
      setDestination('')
      setArrivalDate('')
      setArrivalTime('')

      setMessage('Your journey has been completed successfully!')

    } catch (err) {
      console.error('COMPLETE JOURNEY ERROR:', err)
      setError(err.response?.data?.message || 'Unable to complete journey.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelJourney() {
    if (!journeyDetails?.id) return

    if (!window.confirm('Are you sure you want to cancel this journey?')) {
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      await api.put(
        '/journeys/' + journeyDetails.id + '/cancel/' + userId
      )

      if (trackingActive) {
        console.log('STOPPING TRACKING BECAUSE JOURNEY CANCELLED')

        stopGpsWatch()
        await api.post('/tracking/stop')
      }

      setJourneyStarted(false)
      setJourneyDetails(null)
      setTrackingActive(false)
      setTrackingToken('')
      setTrackingUrl('')
      setLastLocation(null)

      setStartingPoint('')
      setDestination('')
      setArrivalDate('')
      setArrivalTime('')

      setMessage('Your journey has been cancelled.')

    } catch (err) {
      console.error('CANCEL JOURNEY ERROR:', err)
      setError(err.response?.data?.message || 'Unable to cancel journey.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyTrackingLink() {
    try {
      await navigator.clipboard.writeText(trackingUrl)

      setMessage('Tracking link copied successfully!')
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to copy link. Please copy it manually.')
    }
  }

  function formatDate(date) {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(':')
    const date = new Date()

    date.setHours(Number(hours), Number(minutes))

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  function logout() {
    stopGpsWatch()
    sessionStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="sj-page">

      <nav className="sj-navbar">
        <a href="/dashboard" className="sj-brand">
          <div className="sj-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="sj-nav-right">
          <a href="/dashboard" className="sj-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button className="sj-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="sj-hero">
        <div className="sj-hero-content">
          <div className="sj-small-label">
            <Heart size={15} />
            TRAVEL WITH CONFIDENCE
          </div>

          <h1>Safe Journey</h1>

          <p>
            Plan your trip, keep your journey details ready
            and make every journey a safer one.
          </p>

          <div className="sj-hero-note">
            <ShieldCheck size={18} />
            <span>Your safety matters at every step.</span>
          </div>
        </div>

        <div className="sj-hero-art">
          <div className="sj-hero-circle">
            <Navigation size={65} strokeWidth={1.4} />
            <span className="sj-art-heart">
              <Heart size={23} />
            </span>
          </div>
        </div>
      </section>

      <main className="sj-main">

        {error && (
          <div className="sj-info-note" style={{ color: '#c93c37', marginBottom: 15 }}>
            <AlertCircle size={19} />
            <p>{String(error)}</p>
          </div>
        )}

        {message && (
          <div className="sj-info-note" style={{ color: '#55723b', marginBottom: 15 }}>
            <CheckCircle2 size={19} />
            <p>{message}</p>
          </div>
        )}

        {!journeyStarted ? (
          <section className="sj-form-card">

            <div className="sj-section-heading">
              <div className="sj-heading-icon">
                <Route size={23} />
              </div>

              <div>
                <h2>Plan Your Journey</h2>
                <p>Fill in your travel details before you start.</p>
              </div>
            </div>

            <div className="sj-info-note">
              <AlertCircle size={19} />
              <p>
                Enter your correct starting point, destination and
                expected arrival details.
              </p>
            </div>

            <form onSubmit={handleStartJourney} className="sj-form">

              <div className="sj-form-group">
                <label htmlFor="startingPoint">Starting Point</label>
                <div className="sj-input-icon">
                  <CircleDot size={18} />
                  <input
                    id="startingPoint"
                    type="text"
                    placeholder="Enter your starting location"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sj-form-group">
                <label htmlFor="destination">Destination</label>
                <div className="sj-input-icon">
                  <MapPin size={18} />
                  <input
                    id="destination"
                    type="text"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sj-form-group">
                <label htmlFor="arrivalDate">Expected Arrival Date</label>
                <div className="sj-input-icon">
                  <CalendarDays size={18} />
                  <input
                    id="arrivalDate"
                    type="date"
                    value={arrivalDate}
                    min={minDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sj-form-group">
                <label htmlFor="arrivalTime">Expected Arrival Time</label>
                <div className="sj-input-icon">
                  <Clock size={18} />
                  <input
                    id="arrivalTime"
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sj-start-btn"
                disabled={loading}
              >
                <Navigation size={18} />
                {loading ? 'Starting...' : 'Start My Journey'}
              </button>

            </form>

            <div className="sj-form-footer">
              <ShieldCheck size={17} />
              <span>Travel smart. Stay safe. Stay connected.</span>
            </div>
          </section>
        ) : (
          <section className="sj-status-card">

            <div className="sj-status-top">
              <div className="sj-success-icon">
                <CheckCircle2 size={35} />
              </div>

              <div>
                <h2>Your Journey Has Started!</h2>
                <p>Journey ID: {journeyDetails.id}</p>
              </div>

              <span className="sj-active-badge">
                <span></span>
                Active
              </span>
            </div>

            <div className="sj-route-card">
              <div className="sj-route-line">
                <div className="sj-route-point start">
                  <CircleDot size={22} />
                </div>

                <div className="sj-route-dash"></div>

                <div className="sj-route-point end">
                  <Flag size={21} />
                </div>
              </div>

              <div className="sj-route-locations">
                <div>
                  <span>STARTING POINT</span>
                  <h3>{journeyDetails.startingPoint}</h3>
                </div>

                <div className="sj-destination-location">
                  <span>DESTINATION</span>
                  <h3>{journeyDetails.destination}</h3>
                </div>
              </div>
            </div>

            <div className="sj-arrival-details">
              <div className="sj-arrival-item">
                <div className="sj-arrival-icon">
                  <CalendarDays size={21} />
                </div>
                <div>
                  <span>Expected Arrival Date</span>
                  <h3>{formatDate(journeyDetails.arrivalDate)}</h3>
                </div>
              </div>

              <div className="sj-arrival-item">
                <div className="sj-arrival-icon">
                  <Clock size={21} />
                </div>
                <div>
                  <span>Expected Arrival Time</span>
                  <h3>{formatTime(journeyDetails.arrivalTime)}</h3>
                </div>
              </div>
            </div>

            <div className="sj-reminder">
              <Heart size={20} />
              <div>
                <h3>Travel Safely!</h3>
                <p>
                  Stay alert, keep your phone charged and
                  inform someone you trust about your journey.
                </p>
              </div>
            </div>

            <div style={{
              background: '#f0ead6',
              padding: '18px',
              borderRadius: '12px',
              marginTop: '18px'
            }}>
              <h3 style={{ marginTop: 0 }}>
                <Radio size={18} style={{ verticalAlign: 'middle' }} />
                {' '}Live GPS Tracking
              </h3>

              {trackingActive ? (
                <>
                  <p style={{ color: '#55723b' }}>
                    Live tracking is active.
                  </p>

                  {trackingUrl && (
                    <div style={{
                      background: '#ffffff',
                      padding: '12px',
                      borderRadius: '8px',
                      marginTop: '12px'
                    }}>
                      <p><strong>Your Tracking Link:</strong></p>

                      <input
                        type="text"
                        value={trackingUrl}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px',
                          boxSizing: 'border-box',
                          marginBottom: '10px'
                        }}
                      />

                      <button
                        type="button"
                        className="sj-start-btn"
                        onClick={handleCopyTrackingLink}
                      >
                        Copy Tracking Link
                      </button>
                    </div>
                  )}

                  {lastLocation && (
                    <p>
                      Latitude: {lastLocation.latitude.toFixed(6)}
                      <br />
                      Longitude: {lastLocation.longitude.toFixed(6)}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleStopTracking}
                    disabled={loading}
                    className="sj-end-btn"
                  >
                    Stop Live Tracking
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Start sharing your current GPS location with the tracking service.
                  </p>

                  <button
                    type="button"
                    onClick={handleStartTracking}
                    disabled={loading}
                    className="sj-start-btn"
                  >
                    <LocateFixed size={18} />
                    {loading ? 'Please wait...' : 'Start Live Tracking'}
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              disabled={loading}
              className="sj-start-btn"
              style={{ marginTop: '15px' }}
            >
              <CheckCircle2 size={18} />
              Check In
            </button>

            <button
              type="button"
              className="sj-end-btn"
              onClick={handleEndJourney}
              disabled={loading}
              style={{ marginTop: '15px' }}
            >
              <CheckCircle2 size={18} />
              Complete Journey
            </button>

            <button
              type="button"
              className="sj-end-btn"
              onClick={handleCancelJourney}
              disabled={loading}
              style={{ marginTop: '10px', background: '#c93c37' }}
            >
              Cancel Journey
            </button>

          </section>
        )}

        <section className="sj-tips-section">
          <div className="sj-tips-heading">
            <ShieldCheck size={22} />
            <div>
              <h2>Travel Safety Tips</h2>
              <p>A few simple steps for a safer journey.</p>
            </div>
          </div>

          <div className="sj-tips-grid">
            <div className="sj-tip-card">
              <div className="sj-tip-icon"><CarFront size={23} /></div>
              <h3>Keep Your Phone Charged</h3>
              <p>Make sure your phone has enough battery before travelling.</p>
            </div>

            <div className="sj-tip-card">
              <div className="sj-tip-icon"><Heart size={23} /></div>
              <h3>Inform Someone</h3>
              <p>Share your travel plans with someone you trust.</p>
            </div>

            <div className="sj-tip-card">
              <div className="sj-tip-icon"><MapPin size={23} /></div>
              <h3>Know Your Route</h3>
              <p>Be aware of your route and nearby safe places.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="sj-footer">
        <div className="sj-footer-brand">
          <ShieldCheck size={21} />
          <span>SafeHer</span>
        </div>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <span>© 2026 SafeHer. All rights reserved.</span>
      </footer>

    </div>
  )
}

export default SafeJourney
