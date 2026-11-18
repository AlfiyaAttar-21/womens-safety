import { useState, useRef } from 'react'
import api from '../services/api'
import {
  ShieldCheck, MapPin, Navigation, CalendarDays, Clock, Route,
  CheckCircle2, CircleDot, Flag, CarFront, Heart, AlertCircle,
  Radio, LocateFixed, Copy,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import Field from '../components/Field'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { PageTitle } from '../components/FormBits'

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

const tips = [
    [CarFront, 'Charge your phone', 'Make sure you have enough battery before you leave.'],
    [Heart, 'Tell someone', 'Share your plan with a person you trust.'],
    [MapPin, 'Know your route', 'Note safe places along the way, like shops or stations.'],
  ]

  return (
    <AppShell active="journey" onLogout={logout}>
      <PageTitle title="Safe journey" subtitle="Tell us where you’re going and when you’ll arrive. If you don’t check in, your contacts are told." />

      <Alert>{error ? String(error) : ''}</Alert>
      <Alert type="success">{message}</Alert>

      {!journeyStarted ? (
        <Card className="max-w-2xl">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Route size={20} /> Plan your journey</h2>
          <p className="mb-6 mt-1 flex items-start gap-2 text-sm text-ink-soft">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            Enter your real start, destination and expected arrival time.
          </p>

          <form onSubmit={handleStartJourney} noValidate>
            <Field label="Starting point" icon={CircleDot} placeholder="Where are you now?"
              value={startingPoint} onChange={(e) => setStartingPoint(e.target.value)} required />
            <Field label="Destination" icon={MapPin} placeholder="Where are you going?"
              value={destination} onChange={(e) => setDestination(e.target.value)} required />
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field label="Arrival date" icon={CalendarDays} type="date" min={minDate}
                value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
              <Field label="Arrival time" icon={Clock} type="time"
                value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              <Navigation size={17} /> {loading ? 'Starting…' : 'Start my journey'}
            </Button>
          </form>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Journey in progress</h2>
                <p className="text-sm text-ink-soft">Journey ID: {journeyDetails.id}</p>
              </div>
              <Badge tone="safe">Active</Badge>
            </div>

            <ol className="mt-6 space-y-1">
              <li className="flex gap-4">
                <span className="mt-1 text-safe"><CircleDot size={22} /></span>
                <div className="pb-5">
                  <p className="text-sm text-ink-soft">Starting point</p>
                  <p className="font-display text-lg font-bold">{journeyDetails.startingPoint}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 text-sos"><Flag size={21} /></span>
                <div>
                  <p className="text-sm text-ink-soft">Destination</p>
                  <p className="font-display text-lg font-bold">{journeyDetails.destination}</p>
                </div>
              </li>
            </ol>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-lilac/60 p-4">
                <p className="flex items-center gap-2 text-sm text-ink-soft"><CalendarDays size={16} /> Arrival date</p>
                <p className="mt-1 font-semibold">{formatDate(journeyDetails.arrivalDate)}</p>
              </div>
              <div className="rounded-2xl bg-lilac/60 p-4">
                <p className="flex items-center gap-2 text-sm text-ink-soft"><Clock size={16} /> Arrival time</p>
                <p className="mt-1 font-semibold">{formatTime(journeyDetails.arrivalTime)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button type="button" onClick={handleCheckIn} disabled={loading}>
                <CheckCircle2 size={17} /> Check in
              </Button>
              <Button type="button" variant="secondary" onClick={handleEndJourney} disabled={loading}>
                Complete journey
              </Button>
              <Button type="button" variant="danger" onClick={handleCancelJourney} disabled={loading}>
                Cancel journey
              </Button>
            </div>
          </Card>

          <Card className="h-fit">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Radio size={20} /> Live GPS tracking</h2>

            {trackingActive ? (
              <>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#136B5D]">
                  <span className="h-2.5 w-2.5 rounded-full bg-safe" /> Tracking is on
                </p>

                {trackingUrl && (
                  <div className="mt-4">
                    <label htmlFor="trackUrl" className="mb-1.5 block text-sm font-semibold">Your tracking link</label>
                    <div className="flex gap-2">
                      <input id="trackUrl" readOnly value={trackingUrl}
                        className="h-12 min-w-0 flex-1 rounded-2xl bg-cream px-4 text-sm ring-1 ring-ink/15" />
                      <Button type="button" variant="secondary" onClick={handleCopyTrackingLink} aria-label="Copy tracking link">
                        <Copy size={17} />
                      </Button>
                    </div>
                  </div>
                )}

                {lastLocation && (
                  <p className="mt-4 rounded-2xl bg-lilac/60 p-4 text-sm text-ink-soft">
                    Latitude {lastLocation.latitude.toFixed(6)}<br />
                    Longitude {lastLocation.longitude.toFixed(6)}
                  </p>
                )}

                <Button type="button" variant="danger" className="mt-5 w-full" onClick={handleStopTracking} disabled={loading}>
                  Stop live tracking
                </Button>
              </>
            ) : (
              <>
                <p className="mb-5 mt-2 text-sm text-ink-soft">
                  Share your live location with a link your contacts can open in any browser.
                </p>
                <Button type="button" className="w-full" onClick={handleStartTracking} disabled={loading}>
                  <LocateFixed size={17} /> {loading ? 'Please wait…' : 'Start live tracking'}
                </Button>
              </>
            )}
          </Card>
        </div>
      )}

      <section className="mt-12" aria-labelledby="tips">
        <h2 id="tips" className="flex items-center gap-2 font-display text-xl font-bold"><ShieldCheck size={20} /> Before you go</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {tips.map(([Icon, t, d]) => (
            <div key={t} className="rounded-3xl bg-lilac/50 p-5">
              <Icon size={22} />
              <h3 className="mt-3 font-display font-bold">{t}</h3>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

export default SafeJourney
