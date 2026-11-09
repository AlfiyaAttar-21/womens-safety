
import { useState } from 'react'
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
  AlertCircle
} from 'lucide-react'
import '../App.css'

function SafeJourney() {
  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyDetails, setJourneyDetails] = useState(null)

  const today = new Date()
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  function handleStartJourney(e) {
    e.preventDefault()

    if (
      !startingPoint.trim() ||
      !destination.trim() ||
      !arrivalDate ||
      !arrivalTime
    ) {
      alert('Please fill all the fields')
      return
    }

    const arrival = new Date(`${arrivalDate}T${arrivalTime}`)

    if (arrival <= new Date()) {
      alert('Please select a future arrival date and time')
      return
    }

    setJourneyDetails({
      startingPoint: startingPoint.trim(),
      destination: destination.trim(),
      arrivalDate,
      arrivalTime
    })

    setJourneyStarted(true)
  }

  function handleEndJourney() {
    const confirmEnd = window.confirm(
      'Are you sure you want to end this journey?'
    )

    if (confirmEnd) {
      setJourneyStarted(false)
      setJourneyDetails(null)
      setStartingPoint('')
      setDestination('')
      setArrivalDate('')
      setArrivalTime('')
      alert('Your journey has been completed!')
    }
  }

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
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

  return (
    <div className="sj-page">

      {/* Navbar */}
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

          <button
            className="sj-logout-btn"
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

      {/* Main */}
      <main className="sj-main">

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
                  />
                </div>
              </div>

              <button type="submit" className="sj-start-btn">
                <Navigation size={18} />
                Start My Journey
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
                <p>Your journey details are ready.</p>
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

            <button
              type="button"
              className="sj-end-btn"
              onClick={handleEndJourney}
            >
              <CheckCircle2 size={18} />
              End Journey
            </button>

          </section>

        )}

        {/* Safety Tips */}
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
              <div className="sj-tip-icon"><PhoneIcon /></div>
              <h3>Keep Your Phone Charged</h3>
              <p>Make sure your phone has enough battery before travelling.</p>
            </div>

            <div className="sj-tip-card">
              <div className="sj-tip-icon"><UsersIcon /></div>
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

      {/* Footer */}
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

function PhoneIcon() {
  return <CarFront size={23} />
}

function UsersIcon() {
  return <Heart size={23} />
}

export default SafeJourney
