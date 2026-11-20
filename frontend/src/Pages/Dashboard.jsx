import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import AppShell from '../components/AppShell'

import {
  Users,
  MapPin,
  Navigation,
  FileText,
  Bot,
  UserRound,
  Bell,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  X,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react'

function Dashboard() {
  const [pin, setPin] = useState('')
  const [resolvePin, setResolvePin] = useState('')

  const [showPinInput, setShowPinInput] = useState(false)
  const [pinVerified, setPinVerified] = useState(false)
  const [activeAlert, setActiveAlert] = useState(null)

  const [pinLoading, setPinLoading] = useState(false)
  const [sosLoading, setSosLoading] = useState(false)
  const [resolveLoading, setResolveLoading] = useState(false)

  const [countdown, setCountdown] = useState(null)

  const [sosMessage, setSosMessage] = useState('')
  const [sosError, setSosError] = useState(false)

  const countdownRef = useRef(null)

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

  const openPage = (link) => {
    window.location.href = link
  }

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data

    if (typeof data === 'string') return data
    if (data?.message) return data.message

    return fallback
  }

  useEffect(() => {
    const checkActiveAlert = async () => {
      try {
        const response = await api.get('/sos/active')

        if (response.status === 200 && response.data) {
          setActiveAlert(response.data)
        }
      } catch (error) {
        if (error.response?.status !== 204) {
          console.error('Active SOS Error:', error)
        }
      }
    }

    checkActiveAlert()

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  const handleVerifyPin = async (e) => {
    e.preventDefault()

    if (!pin.trim()) {
      setSosError(true)
      setSosMessage('Please enter your PIN.')
      return
    }

    setPinLoading(true)
    setSosMessage('')
    setSosError(false)

    try {
      await api.post('/sos/verify-pin', {
        pin: pin.trim()
      })

      setPinVerified(true)
      setShowPinInput(false)
      setPin('')

      setSosMessage('PIN verified successfully.')
      setSosError(false)

    } catch (error) {
      console.error('PIN Verification Error:', error)

      setSosError(true)
      setSosMessage(
        getErrorMessage(error, 'Incorrect PIN. Please try again.')
      )
    } finally {
      setPinLoading(false)
    }
  }

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({})
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => resolve({}),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const triggerSOS = async () => {
    setSosLoading(true)
    setSosMessage('Triggering your emergency alert...')
    setSosError(false)

    try {
      const location = await getCurrentLocation()

      const response = await api.post('/sos/trigger', location)

      setActiveAlert(response.data)
      setPinVerified(false)
      setShowPinInput(false)
      setCountdown(null)

      setSosMessage('SOS alert triggered successfully.')

    } catch (error) {
      console.error('SOS Error:', error)

      setSosError(true)
      setSosMessage(
        getErrorMessage(error, 'Unable to trigger SOS alert. Please try again.')
      )
    } finally {
      setSosLoading(false)
    }
  }

  const handleSOS = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }

    setSosMessage('')
    setSosError(false)
    setCountdown(5)

    let seconds = 5

    countdownRef.current = setInterval(() => {
      seconds -= 1
      setCountdown(seconds)

      if (seconds <= 0) {
        clearInterval(countdownRef.current)
        countdownRef.current = null

        setCountdown(null)
        triggerSOS()
      }
    }, 1000)
  }

  const cancelSOS = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }

    setCountdown(null)
    setSosMessage('SOS countdown cancelled. No alert was triggered.')
    setSosError(false)
  }

  const handleResolveSOS = async (e) => {
    e.preventDefault()

    if (!resolvePin.trim()) {
      setSosError(true)
      setSosMessage('Please enter your Normal PIN.')
      return
    }

    if (!activeAlert?.id) {
      setSosError(true)
      setSosMessage('Active SOS alert ID is not available.')
      return
    }

    setResolveLoading(true)
    setSosMessage('')
    setSosError(false)

    try {
      await api.post(`/sos/${activeAlert.id}/resolve`, {
        pin: resolvePin.trim()
      })

      setActiveAlert(null)
      setResolvePin('')

      setSosMessage('SOS alert resolved successfully.')
      setSosError(false)

    } catch (error) {
      console.error('Resolve SOS Error:', error)

      setSosError(true)
      setSosMessage(
        getErrorMessage(error, 'Unable to resolve SOS alert. Please try again.')
      )
    } finally {
      setResolveLoading(false)
    }
  }

  return (
    <AppShell active="dashboard" wide>

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

        <div>
          <h2 className="text-2xl font-bold text-[#2c2a1e]">
            Dashboard
          </h2>

          <p className="text-[#6b6550] text-sm mt-1">
            Welcome back! Stay safe and confident.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button className="relative p-3 bg-white rounded-xl shadow-sm text-[#6b6550]">
            <Bell size={21} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={() => openPage('/my-profile')}
            className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl shadow-sm"
          >
            <div className="w-10 h-10 bg-[#e7dbbf] text-[#6b7a3a] rounded-full flex items-center justify-center">
              <UserRound size={22} />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-[#2c2a1e]">
                My Account
              </p>
              <p className="text-xs text-[#6b6550]">
                SafeHer User
              </p>
            </div>
          </button>

        </div>
      </header>

      {/* WELCOME SECTION */}
      <section className="bg-gradient-to-r from-[#6b7a3a] to-[#8d9d4f] rounded-2xl p-8 text-white mb-8 relative overflow-hidden">

        <div className="relative z-10">
          <p className="text-[#f0ead6] text-sm font-medium mb-2">
            YOUR SAFETY MATTERS
          </p>

          <h1 className="text-3xl font-bold mb-3">
            Welcome to SafeHer!
          </h1>

          <p className="text-[#f5f0e0] max-w-xl">
            Your personal safety companion is here to help you
            stay protected, connected and confident.
          </p>
        </div>

        <ShieldCheck
          size={150}
          className="absolute right-10 top-5 text-white opacity-10"
        />
      </section>

      {/* EMERGENCY ASSISTANCE */}
      <section className="bg-[#e7dbbf] rounded-2xl p-6 shadow-sm border border-[#d9cfb0] mb-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#2c2a1e]">
              Emergency Assistance
            </h2>

            <p className="text-sm text-[#6b6550]">
              Need help? Emergency support is important.
            </p>
          </div>
        </div>

        {activeAlert ? (

          <div className="bg-red-50 border border-red-200 rounded-xl p-5">

            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-red-600" size={25} />

              <div>
                <h3 className="font-bold text-red-700">
                  SOS Alert Active
                </h3>

                <p className="text-sm text-red-600">
                  Your emergency alert is currently active.
                </p>
              </div>
            </div>

            <p className="text-sm text-red-700 mb-5">
              Your trusted contacts may have received your emergency notification.
            </p>

            <form onSubmit={handleResolveSOS}>

              <label className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                Enter Normal PIN to resolve SOS
              </label>

              <div className="flex flex-col sm:flex-row gap-3">

                <input
                  type="password"
                  value={resolvePin}
                  onChange={(e) => setResolvePin(e.target.value)}
                  placeholder="Enter Normal PIN"
                  maxLength={6}
                  autoComplete="off"
                  className="w-full sm:max-w-sm px-4 py-3 rounded-xl border border-[#d9cfb0] bg-white outline-none focus:ring-2 focus:ring-[#8d9d4f]"
                />

                <button
                  type="submit"
                  disabled={resolveLoading}
                  className="bg-[#6b7a3a] hover:bg-[#52612b] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition"
                >
                  {resolveLoading ? 'Resolving...' : 'Resolve SOS'}
                </button>

              </div>

            </form>

          </div>

        ) : (

          <>

            {!showPinInput && !pinVerified && countdown === null && (

              <div>
                <button
                  onClick={() => {
                    setShowPinInput(true)
                    setSosMessage('')
                    setSosError(false)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-xl transition flex items-center gap-3"
                >
                  <ShieldAlert size={23} />
                  SOS Emergency
                </button>

                <p className="text-xs text-[#6b6550] mt-3">
                  Press the button during an emergency to continue.
                </p>
              </div>

            )}

            {showPinInput && !pinVerified && countdown === null && (

              <form onSubmit={handleVerifyPin}>

                <label className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                  Enter your Normal PIN or Duress PIN
                </label>

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter your PIN"
                    maxLength={6}
                    autoComplete="off"
                    className="w-full sm:max-w-sm px-4 py-3 rounded-xl border border-[#d9cfb0] bg-white outline-none focus:ring-2 focus:ring-[#8d9d4f]"
                  />

                  <button
                    type="submit"
                    disabled={pinLoading}
                    className="bg-[#6b7a3a] hover:bg-[#52612b] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition"
                  >
                    {pinLoading ? 'Verifying...' : 'Continue'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPinInput(false)
                      setPin('')
                      setSosMessage('')
                      setSosError(false)
                    }}
                    className="bg-white border border-[#d9cfb0] text-[#6b6550] font-semibold px-6 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            )}

            {pinVerified && countdown === null && (

              <div>

                <div className="flex items-center gap-2 text-green-800 mb-4">
                  <CheckCircle2 size={20} />

                  <span className="text-sm font-semibold">
                    PIN verified successfully.
                  </span>
                </div>

                <button
                  onClick={handleSOS}
                  disabled={sosLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold px-10 py-3 rounded-xl transition"
                >
                  SOS Emergency
                </button>

                <button
                  onClick={() => {
                    setPinVerified(false)
                    setShowPinInput(false)
                    setPin('')
                    setSosMessage('')
                  }}
                  className="ml-3 bg-white border border-[#d9cfb0] hover:bg-[#f5f0e0] text-[#6b6550] font-semibold px-8 py-3 rounded-xl transition"
                >
                  Cancel
                </button>

              </div>

            )}

            {countdown !== null && (

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-red-600" size={28} />

                  <div>
                    <h3 className="font-bold text-red-700 text-lg">
                      SOS Alert Starting...
                    </h3>

                    <p className="text-sm text-red-600">
                      Your emergency alert will be triggered shortly.
                    </p>
                  </div>
                </div>

                <div className="text-5xl font-bold text-red-600 mb-4">
                  {countdown}
                </div>

                <button
                  onClick={cancelSOS}
                  className="bg-white border border-red-300 hover:bg-red-100 text-red-700 font-bold px-8 py-3 rounded-xl transition"
                >
                  <span className="flex items-center gap-2">
                    <X size={18} />
                    Cancel SOS
                  </span>
                </button>

              </div>

            )}

          </>

        )}

        {sosMessage && (
          <p
            role="status"
            className={`text-sm mt-4 font-medium ${
              sosError ? 'text-red-700' : 'text-green-800'
            }`}
          >
            {sosMessage}
          </p>
        )}

        <p className="text-xs text-[#6b6550] mt-3">
          Press SOS only during an emergency.
        </p>

      </section>

      {/* SAFETY SERVICES */}
      <section>

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-xl font-bold text-[#2c2a1e]">
              Your Safety Services
            </h2>

            <p className="text-sm text-[#6b6550] mt-1">
              Choose a service to continue.
            </p>
          </div>

          <span className="text-sm text-[#6b7a3a] font-semibold">
            6 Services
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {services.map((service) => {
            const Icon = service.icon

            return (
              <button
                key={service.title}
                onClick={() => openPage(service.link)}
                className="text-left bg-white border border-[#d9cfb0] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition group"
              >

                <div className="flex justify-between items-center mb-5">

                  <div className="w-12 h-12 rounded-xl bg-[#f0ead6] text-[#6b7a3a] flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <ArrowUpRight
                    size={21}
                    className="text-[#8d9d4f] group-hover:translate-x-1 group-hover:-translate-y-1 transition"
                  />

                </div>

                <h3 className="font-bold text-lg text-[#2c2a1e] mb-2">
                  {service.title}
                </h3>

                <p className="text-sm text-[#6b6550] leading-relaxed">
                  {service.description}
                </p>

              </button>
            )
          })}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="mt-10 py-6 text-center">
        <div className="flex justify-center items-center gap-2 text-[#6b7a3a] font-bold text-lg mb-2">
          <ShieldCheck size={20} />
          SafeHer
        </div>

        <p className="text-sm text-[#6b6550]">
          Stay Safe. Stay Strong. Stay Confident.
        </p>

        <p className="text-xs text-[#99917b] mt-2">
          © 2026 SafeHer. All rights reserved.
        </p>
      </footer>

    </AppShell>
  )
}

export default Dashboard