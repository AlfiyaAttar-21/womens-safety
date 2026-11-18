import { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import {
  Users, MapPin, Navigation, FileText, Bot, UserRound,
  AlertTriangle, ArrowUpRight, X, CheckCircle, Lock, Siren,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import SOSButton from '../components/SOSButton'

function Dashboard() {
  const [userName, setUserName] = useState(
    sessionStorage.getItem('safeherUserName') || 'SafeHer User'
  )

  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(null)
  const [activeAlert, setActiveAlert] = useState(null)
  const [sosLoading, setSosLoading] = useState(false)
  const [pinLoading, setPinLoading] = useState(false)
  const [pinVerified, setPinVerified] = useState(false)
  const [sosMessage, setSosMessage] = useState('')
  const [sosError, setSosError] = useState('')

  const countdownRef = useRef(null)

  // Fetch active SOS alert
  const fetchActiveAlert = async () => {
    try {
      const response = await api.get('/sos/active')

      console.log('ACTIVE SOS RESPONSE:', response.data)

      if (response.data && response.data.id) {
        setActiveAlert(response.data)
        setPinVerified(false)
        return response.data
      }

      setActiveAlert(null)
      return null
    } catch (error) {
      if (error.response?.status === 204) {
        setActiveAlert(null)
        return null
      }

      console.error('Active SOS fetch failed:', error)
      setActiveAlert(null)
      return null
    }
  }

  // Load user and active SOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/users/me')

        console.log('USER RESPONSE:', response.data)

        setUserName(
          sessionStorage.getItem('safeherUserName') || 'SafeHer User'
        )
      } catch (error) {
        console.error('User verification failed:', error)
      }

      await fetchActiveAlert()
      setLoading(false)
    }

    fetchData()

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }
  }, [])

  // Verify Normal PIN before showing SOS buttons
  const handleVerifyNormalPin = async () => {
    const pin = window.prompt('Enter your normal safety PIN:')

    if (pin === null || pin.trim() === '') {
      return
    }

    setPinLoading(true)
    setSosError('')
    setSosMessage('')

    try {
      const response = await api.post('/sos/verify-pin', {
        pin: pin.trim()
      })

      console.log('PIN VERIFICATION RESPONSE:', response.data)

      setPinVerified(true)
      setSosMessage('Normal PIN verified. You can now use SOS controls.')
      setSosError('')
    } catch (error) {
      console.error('PIN VERIFICATION ERROR:', error)

      setPinVerified(false)

      setSosError(
        error.response?.data?.message ||
        'Incorrect PIN. Please try again.'
      )
    } finally {
      setPinLoading(false)
    }
  }

  // Get current GPS location
  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('GPS not supported')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('GPS LOCATION RECEIVED')

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('GPS ERROR:', error.message)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Send actual SOS request
  const sendSOS = async () => {
    console.log('SOS API FUNCTION CALLED')

    setSosLoading(true)
    setSosError('')
    setSosMessage('Sending emergency alert...')

    try {
      const location = await getCurrentLocation()

      console.log('SOS LOCATION:', location)

      const response = await api.post(
        '/sos/trigger',
        location || {}
      )

      console.log('SOS API RESPONSE:', response.data)

      setActiveAlert(response.data)
      setPinVerified(false)

      setSosMessage(
        'SOS alert triggered successfully. Alert ID: ' +
        response.data.id
      )
    } catch (error) {
      console.error('SOS API ERROR:', error)

      setSosMessage('')

      setSosError(
        error.response?.data?.message ||
        error.message ||
        'Unable to trigger SOS. Please try again.'
      )
    } finally {
      setSosLoading(false)
    }
  }

  // Start 5-second countdown
  const handleSOS = () => {
    console.log('SOS BUTTON CLICKED')

    if (!pinVerified || activeAlert || sosLoading || countdown !== null) {
      return
    }

    setSosError('')
    setSosMessage('SOS will be triggered in 5 seconds.')

    let remaining = 5

    setCountdown(remaining)

    countdownRef.current = setInterval(() => {
      remaining--

      console.log('SOS COUNTDOWN:', remaining)

      if (remaining <= 0) {
        clearInterval(countdownRef.current)
        countdownRef.current = null

        setCountdown(null)

        sendSOS()
      } else {
        setCountdown(remaining)
      }
    }, 1000)
  }

  // Cancel SOS before countdown finishes
  const cancelSOS = () => {
    console.log('SOS CANCELLED')

    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }

    setCountdown(null)
    setPinVerified(false)
    setSosMessage('SOS countdown cancelled. No alert was triggered.')
    setSosError('')
  }

  // Resolve active SOS using Normal PIN or Duress PIN
  const handleResolveSOS = async () => {
    console.log('RESOLVE SOS BUTTON CLICKED')

    setSosError('')
    setSosMessage('')

    let alertToResolve = activeAlert

    if (!alertToResolve) {
      alertToResolve = await fetchActiveAlert()
    }

    if (!alertToResolve || !alertToResolve.id) {
      setSosMessage('No active SOS alert found.')
      return
    }

    const pin = window.prompt('Enter your safety PIN:')

    if (pin === null || pin.trim() === '') {
      return
    }

    setPinLoading(true)

    try {
      const response = await api.post(
        `/sos/${alertToResolve.id}/resolve`,
        { pin: pin.trim() }
      )

      console.log('SOS RESOLVE RESPONSE:', response.data)

      setActiveAlert(null)
      setPinVerified(false)

      setSosMessage('Your alert has been resolved successfully.')
      setSosError('')
    } catch (error) {
      console.error('SOS RESOLVE ERROR:', error)

      setSosError(
        error.response?.data?.message ||
        'Unable to resolve alert. Check your PIN.'
      )
    } finally {
      setPinLoading(false)
    }
  }

  // Dashboard services
  const services = [
    {
      title: 'Trusted Contacts',
      description: 'Manage your emergency contacts.',
      icon: Users,
      link: '/trusted-contacts'
    },
    {
      title: 'Safe Journey',
      description: 'Share your journey with trusted people.',
      icon: Navigation,
      link: '/safe-journey'
    },
    {
      title: 'Incident Reporting',
      description: 'Report safety-related incidents.',
      icon: FileText,
      link: '/incident-reporting'
    },
    {
      title: 'Safety Risk Map',
      description: 'Explore safety information about locations.',
      icon: MapPin,
      link: '/risk-map'
    },
    {
      title: 'AI Safety Assistant',
      description: 'Get helpful safety guidance.',
      icon: Bot,
      link: '/ai-assistant'
    },
    {
      title: 'My Profile',
      description: 'Manage your personal information.',
      icon: UserRound,
      link: '/my-profile'
    }
  ]

  // Open page
  const openPage = (link) => {
    window.location.href = link
  }

  // Logout
  const handleLogout = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }

    sessionStorage.removeItem('safeherAccessToken')
    sessionStorage.removeItem('safeherRefreshToken')
    sessionStorage.removeItem('safeherUserId')
    sessionStorage.removeItem('safeherUserName')
    sessionStorage.removeItem('safeherPhoneNumber')

    window.location.href = '/login'
  }

const light = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-cream px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-white disabled:opacity-60'
  const outline = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-cream ring-1 ring-cream/40 transition-colors hover:bg-white/10 disabled:opacity-60'

  return (
    <AppShell active="dashboard" onLogout={handleLogout}>
      <header>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Hi, {loading ? '…' : userName}
        </h1>
        <p className="mt-1 text-ink-soft">Your safety tools are ready.</p>
      </header>

      {/* Emergency */}
      <section aria-labelledby="sos-title" className="mt-8 rounded-[2rem] bg-ink p-6 text-cream md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 id="sos-title" className="font-display text-2xl font-bold">Emergency help</h2>
            <p className="mt-2 max-w-md text-cream/75">
              {activeAlert
                ? 'An alert is active. Resolve it with your PIN once you are safe.'
                : pinVerified
                  ? 'SOS is ready. Press it, then you have 5 seconds to cancel.'
                  : 'Enter your normal PIN to unlock the SOS button.'}
            </p>

            {activeAlert && (
              <div role="alert" className="mt-5 rounded-2xl bg-sos/25 p-4 ring-1 ring-sos/60">
                <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={18} /> Active SOS alert</p>
                <p className="mt-1 text-sm text-cream/85">Alert ID: {activeAlert.id}</p>
                <p className="text-sm text-cream/85">Status: {activeAlert.state}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {!activeAlert && !pinVerified && (
                <button type="button" onClick={handleVerifyNormalPin} disabled={pinLoading} className={light}>
                  <Lock size={17} /> {pinLoading ? 'Verifying PIN…' : 'Enter normal PIN'}
                </button>
              )}

              {!activeAlert && pinVerified && (
                <button type="button" onClick={cancelSOS} disabled={sosLoading} className={outline}>
                  <X size={17} /> {countdown !== null ? `Cancel SOS (${countdown})` : 'Cancel SOS'}
                </button>
              )}

              {activeAlert && (
                <button type="button" onClick={handleResolveSOS} disabled={pinLoading} className={light}>
                  {pinLoading ? 'Verifying PIN…' : 'Resolve alert with PIN'}
                </button>
              )}
            </div>

            {countdown !== null && (
              <div role="alert" className="mt-5 rounded-2xl bg-sos/25 p-4 ring-1 ring-sos/60">
                <p className="font-bold">SOS will be sent in {countdown} seconds.</p>
                <p className="mt-1 text-sm text-cream/85">If this was accidental, press Cancel SOS now.</p>
              </div>
            )}

            {sosMessage && (
              <p role="status" className="mt-4 flex items-start gap-2 text-sm font-medium text-[#9BE3D5]">
                <CheckCircle size={17} className="mt-0.5 shrink-0" /> {sosMessage}
              </p>
            )}
            {sosError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-medium text-[#FFB4BF]">
                <X size={17} className="mt-0.5 shrink-0" /> {sosError}
              </p>
            )}

            <p className="mt-5 text-xs text-cream/55">
              An SOS alert may send an emergency SMS to your confirmed trusted contacts.
            </p>
          </div>

          <div className="mx-auto">
            {activeAlert ? (
              <div className="grid h-40 w-40 place-items-center rounded-full bg-sos/25 ring-4 ring-sos"><Siren size={56} /></div>
            ) : pinVerified ? (
              <SOSButton
                size={160}
                onClick={handleSOS}
                disabled={sosLoading || countdown !== null}
                label={sosLoading ? '…' : countdown !== null ? String(countdown) : 'SOS'}
              />
            ) : (
              <div className="grid h-40 w-40 place-items-center rounded-full bg-white/10 text-center text-cream/70">
                <span><Lock className="mx-auto mb-1" size={30} /><span className="text-sm font-semibold">Locked</span></span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Your safety tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.title}
                type="button"
                onClick={() => openPage(service.link)}
                className="group rounded-3xl bg-white p-6 text-left shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lilac text-ink"><Icon size={23} /></span>
                  <ArrowUpRight size={20} className="text-ink-faint group-hover:text-ink" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{service.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{service.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink-soft">
        © 2026 SafeHer. Stay safe. Stay strong. Stay confident.
      </div>
    </AppShell>
  )
}

export default Dashboard
