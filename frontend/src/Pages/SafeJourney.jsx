import { useState } from 'react'
import '../App.css'

function SafeJourney() {
  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [journeyDetails, setJourneyDetails] = useState(null)

  function handleStartJourney(e) {
    e.preventDefault()

    if (!startingPoint.trim() || !destination.trim() ||
        !arrivalDate || !arrivalTime) {
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
    const confirmEnd = window.confirm('Are you sure you want to end this journey?')

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

  return (
    <div className="journey-page">

      <nav className="navbar">
        <div className="logo"><span>♡</span> SafeHer</div>

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

      <section className="journey-header">
        <h1>Safe Journey 💜</h1>
        <p>Plan your journey and keep your safety in mind.</p>
      </section>

      <section className="journey-content">

        {!journeyStarted ? (

          <div className="journey-form-box">
            <div className="journey-icon">🚗</div>

            <h2>Plan Your Journey</h2>
            <p>Enter your journey details below.</p>

            <form onSubmit={handleStartJourney}>

              <label>Starting Point</label>
              <input
                type="text"
                placeholder="Enter your starting location"
                value={startingPoint}
                onChange={(e) => setStartingPoint(e.target.value)}
              />

              <label>Destination</label>
              <input
                type="text"
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />

              <label>Expected Arrival Date</label>
              <input
                type="date"
                value={arrivalDate}
                min={new Date().toLocaleDateString('en-CA')}
                onChange={(e) => setArrivalDate(e.target.value)}
              />

              <label>Expected Arrival Time</label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
              />

              <button type="submit" className="start-journey-btn">
                Start Journey
              </button>

            </form>
          </div>

        ) : (

          <div className="journey-status-box">

            <div className="journey-success-icon">✓</div>

            <h2>Your Journey Has Started!</h2>
            <p className="journey-active-text">Journey Status: Active</p>

            <div className="journey-details">

              <div className="journey-detail-item">
                <span>📍 Starting Point</span>
                <h3>{journeyDetails.startingPoint}</h3>
              </div>

              <div className="journey-detail-item">
                <span>🏁 Destination</span>
                <h3>{journeyDetails.destination}</h3>
              </div>

              <div className="journey-detail-item">
                <span>📅 Expected Arrival Date</span>
                <h3>{journeyDetails.arrivalDate}</h3>
              </div>

              <div className="journey-detail-item">
                <span>⏰ Expected Arrival Time</span>
                <h3>{journeyDetails.arrivalTime}</h3>
              </div>

            </div>

            <div className="journey-reminder">
              💜 Stay alert and travel safely!
            </div>

            <button
              type="button"
              className="end-journey-btn"
              onClick={handleEndJourney}
            >
              End Journey
            </button>

          </div>

        )}

      </section>

      <footer>
        <p>© 2026 SafeHer. Your Safety, Our Priority. 💜</p>
      </footer>

    </div>
  )
}

export default SafeJourney