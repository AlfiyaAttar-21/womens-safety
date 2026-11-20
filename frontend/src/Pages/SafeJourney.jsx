import { useState, useRef } from 'react'
import api from '../services/api'
import AppShell from '../components/AppShell'

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
  Heart,
  AlertCircle,
  Radio,
  Copy,
  XCircle,
  LocateFixed,
  Play,
  Square,
  CheckCircle
} from 'lucide-react'

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

      stopGpsWatch()

      const response = await api.post('/tracking/start')

      const token = response.data.trackingToken
      const url = response.data.trackingUrl

      if (!token) {
        throw new Error('Tracking token was not received.')
      }

      setTrackingToken(token)
      setTrackingUrl(url || '')
      setTrackingActive(true)

      setMessage('Live tracking started. Getting your GPS location...')

      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          setLastLocation({ latitude, longitude })

          try {
            await api.post('/tracking/location', {
              trackingToken: token,
              latitude,
              longitude
            })
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

  const inputClass =
    'w-full rounded-xl border border-[#D9CFB0] bg-white px-4 py-3 pl-11 text-[#2C2A1E] outline-none transition focus:border-[#8D9D4F] focus:ring-2 focus:ring-[#8D9D4F]/20'

  const primaryButton =
    'flex items-center justify-center gap-2 rounded-xl bg-[#8D9D4F] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#6B7A3A] disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <AppShell active="journey" wide>

      {/* PAGE HEADING */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7EED5] text-[#6B7A3A]">
            <Route size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#2C2A1E]">
              Safe Journey
            </h1>
            <p className="text-sm text-[#77745F]">
              Plan your trip and stay connected.
            </p>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#E7E3D2]">
        <div className="flex flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row md:px-10 md:py-14">

          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-[#6B7A3A]">
              <Heart size={15} />
              TRAVEL WITH CONFIDENCE
            </div>

            <h2 className="text-4xl font-bold leading-tight text-[#2C2A1E] md:text-5xl">
              Your Journey.
              <br />
              <span className="text-[#8D9D4F]">Your Safety.</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#68654F]">
              Plan your trip, keep your journey details ready and make every
              journey a safer one with SafeHer.
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm font-medium text-[#6B7A3A]">
              <ShieldCheck size={20} />
              Your safety matters at every step.
            </div>

          </div>

          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-[#8D9D4F] text-white shadow-xl md:h-52 md:w-52">
            <Navigation size={85} strokeWidth={1.3} />
          </div>

        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm">{String(error)}</p>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#C9D6A8] bg-[#F0EAD6] p-4 text-[#55723B]">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* JOURNEY FORM */}
      {!journeyStarted ? (

        <section className="rounded-3xl border border-[#D9CFB0] bg-white p-6 shadow-sm md:p-9">

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAD6] text-[#6B7A3A]">
              <Route size={27} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2C2A1E]">
                Plan Your Journey
              </h2>
              <p className="mt-1 text-sm text-[#85816B]">
                Fill in your travel details before you start.
              </p>
            </div>
          </div>

          <div className="mb-7 flex gap-3 rounded-xl bg-[#F0EAD6] p-4 text-sm text-[#6B7A3A]">
            <AlertCircle size={20} className="shrink-0" />
            <p>
              Enter your correct starting point, destination and expected
              arrival details.
            </p>
          </div>

          <form onSubmit={handleStartJourney} className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label htmlFor="startingPoint" className="mb-2 block text-sm font-semibold text-[#494735]">
                  Starting Point
                </label>

                <div className="relative">
                  <CircleDot size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]" />

                  <input
                    id="startingPoint"
                    type="text"
                    placeholder="Enter your starting location"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="destination" className="mb-2 block text-sm font-semibold text-[#494735]">
                  Destination
                </label>

                <div className="relative">
                  <MapPin size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]" />

                  <input
                    id="destination"
                    type="text"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arrivalDate" className="mb-2 block text-sm font-semibold text-[#494735]">
                  Expected Arrival Date
                </label>

                <div className="relative">
                  <CalendarDays size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]" />

                  <input
                    id="arrivalDate"
                    type="date"
                    value={arrivalDate}
                    min={minDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arrivalTime" className="mb-2 block text-sm font-semibold text-[#494735]">
                  Expected Arrival Time
                </label>

                <div className="relative">
                  <Clock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]" />

                  <input
                    id="arrivalTime"
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              className={primaryButton + ' w-full md:w-auto'}
              disabled={loading}
            >
              <Navigation size={19} />
              {loading ? 'Starting...' : 'Start My Journey'}
            </button>

          </form>

          <div className="mt-8 flex items-center gap-2 border-t border-[#E8E1CD] pt-5 text-sm text-[#77745F]">
            <ShieldCheck size={18} className="text-[#8D9D4F]" />
            Travel smart. Stay safe. Stay connected.
          </div>

        </section>

      ) : (

        /* ACTIVE JOURNEY */
        <section className="rounded-3xl border border-[#D9CFB0] bg-white p-6 shadow-sm md:p-9">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EED5] text-[#6B7A3A]">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#2C2A1E]">
                  Your Journey Has Started!
                </h2>
                <p className="mt-1 text-sm text-[#85816B]">
                  Journey ID: {journeyDetails.id}
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-[#E7EED5] px-4 py-2 text-sm font-bold text-[#55723B]">
              <span className="h-2 w-2 rounded-full bg-[#8D9D4F]"></span>
              Active
            </span>

          </div>

          {/* ROUTE DETAILS */}
          <div className="mb-7 rounded-2xl bg-[#F7F5EC] p-6">

            <div className="mb-5 flex items-center gap-3 text-[#8D9D4F]">
              <Route size={22} />
              <h3 className="font-bold text-[#2C2A1E]">
                Your Travel Route
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="flex gap-3">
                <CircleDot size={23} className="mt-1 shrink-0 text-[#8D9D4F]" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#85816B]">
                    Starting Point
                  </span>
                  <p className="mt-1 font-semibold text-[#2C2A1E]">
                    {journeyDetails.startingPoint}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Flag size={23} className="mt-1 shrink-0 text-[#8D9D4F]" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#85816B]">
                    Destination
                  </span>
                  <p className="mt-1 font-semibold text-[#2C2A1E]">
                    {journeyDetails.destination}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays size={23} className="mt-1 shrink-0 text-[#8D9D4F]" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#85816B]">
                    Expected Arrival Date
                  </span>
                  <p className="mt-1 font-semibold text-[#2C2A1E]">
                    {formatDate(journeyDetails.arrivalDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock size={23} className="mt-1 shrink-0 text-[#8D9D4F]" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#85816B]">
                    Expected Arrival Time
                  </span>
                  <p className="mt-1 font-semibold text-[#2C2A1E]">
                    {formatTime(journeyDetails.arrivalTime)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* CHECK IN */}
          <div className="mb-7 rounded-2xl border border-[#D9CFB0] p-6">

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-[#F0EAD6] p-3 text-[#6B7A3A]">
                <CheckCircle size={23} />
              </div>

              <div>
                <h3 className="font-bold text-[#2C2A1E]">
                  Journey Check-in
                </h3>
                <p className="text-sm text-[#85816B]">
                  Confirm that you are safe during your journey.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              disabled={loading}
              className={primaryButton}
            >
              <CheckCircle2 size={19} />
              Check In Now
            </button>

          </div>

          {/* LIVE TRACKING */}
          <div className="mb-7 rounded-2xl border border-[#D9CFB0] p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-[#F0EAD6] p-3 text-[#6B7A3A]">
                <Radio size={23} />
              </div>

              <div>
                <h3 className="font-bold text-[#2C2A1E]">
                  Live Location Tracking
                </h3>
                <p className="text-sm text-[#85816B]">
                  Share your live location during your journey.
                </p>
              </div>
            </div>

            {!trackingActive ? (

              <button
                type="button"
                onClick={handleStartTracking}
                disabled={loading}
                className={primaryButton}
              >
                <Play size={18} />
                {loading ? 'Starting Tracking...' : 'Start Live Tracking'}
              </button>

            ) : (

              <div className="space-y-4">

                <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-green-600"></span>
                  <span className="font-semibold text-sm">
                    Live tracking is active
                  </span>
                </div>

                {lastLocation && (
                  <div className="rounded-xl bg-[#F7F5EC] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#6B7A3A]">
                      <LocateFixed size={18} />
                      Latest GPS Location
                    </div>

                    <p className="text-sm text-[#2C2A1E]">
                      Latitude: {lastLocation.latitude}
                    </p>

                    <p className="text-sm text-[#2C2A1E]">
                      Longitude: {lastLocation.longitude}
                    </p>
                  </div>
                )}

                {trackingUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#494735]">
                      Tracking Link
                    </label>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={trackingUrl}
                        readOnly
                        className="min-w-0 flex-1 rounded-xl border border-[#D9CFB0] bg-[#F7F5EC] px-4 py-3 text-sm text-[#2C2A1E]"
                      />

                      <button
                        type="button"
                        onClick={handleCopyTrackingLink}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#F0EAD6] px-4 py-3 font-semibold text-[#6B7A3A] hover:bg-[#E7DBBF]"
                      >
                        <Copy size={17} />
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleStopTracking}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <Square size={17} />
                  Stop Live Tracking
                </button>

              </div>
            )}

          </div>

          {/* JOURNEY ACTIONS */}
          <div className="grid gap-4 border-t border-[#E8E1CD] pt-6 sm:grid-cols-2">

            <button
              type="button"
              onClick={handleEndJourney}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6B7A3A] px-5 py-3 font-semibold text-white transition hover:bg-[#52612D] disabled:opacity-60"
            >
              <CheckCircle2 size={19} />
              Complete Journey
            </button>

            <button
              type="button"
              onClick={handleCancelJourney}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              <XCircle size={19} />
              Cancel Journey
            </button>

          </div>

        </section>

      )}

      {/* SAFETY REMINDER */}
      <section className="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9CFB0] bg-[#E7DBBF] p-5 md:p-6">

        <div className="shrink-0 rounded-xl bg-[#F5F0E0] p-3 text-[#6B7A3A]">
          <ShieldCheck size={25} />
        </div>

        <div>
          <h3 className="mb-1 font-bold text-[#2C2A1E]">
            Your Safety Matters
          </h3>

          <p className="text-sm leading-relaxed text-[#6B6550]">
            Always share your journey details with someone you trust.
            Keep your phone charged and stay aware of your surroundings.
          </p>
        </div>

      </section>

    </AppShell>
  )
}

export default SafeJourney