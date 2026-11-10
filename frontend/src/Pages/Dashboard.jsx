
import { useEffect, useRef, useState } from 'react'
import api from '../services/api'

import {
  LayoutDashboard,
  Users,
  MapPin,
  Navigation,
  FileText,
  Bot,
  UserRound,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  X,
  CheckCircle
} from 'lucide-react'

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

  return (
    <div className="min-h-screen bg-[#faf8f2] flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#f5f0e0] border-r border-[#d9cfb0] min-h-screen fixed left-0 top-0 flex flex-col">

        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#8d9d4f] text-white p-2 rounded-xl">
            <ShieldCheck size={25} />
          </div>

          <h1 className="text-2xl font-bold text-[#2c2a1e]">
            Safe<span className="text-[#8d9d4f]">Her</span>
          </h1>
        </div>

        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-[#6b6550] uppercase mb-4 px-3">
            Main Menu
          </p>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#e7dbbf] text-[#6b7a3a] font-semibold">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          {[
            { name: 'Trusted Contacts', icon: Users, link: '/trusted-contacts' },
            { name: 'Safe Journey', icon: Navigation, link: '/safe-journey' },
            { name: 'Incident Reports', icon: FileText, link: '/incident-reporting' },
            { name: 'Safety Risk Map', icon: MapPin, link: '/risk-map' },
            { name: 'AI Assistant', icon: Bot, link: '/ai-assistant' }
          ].map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => openPage(item.link)}
                className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-[#6b6550] hover:bg-[#e7dbbf] hover:text-[#6b7a3a] transition"
              >
                <Icon size={20} />
                {item.name}
              </button>
            )
          })}
        </div>

        <div className="mt-auto p-4 border-t border-[#d9cfb0]">
          <button
            onClick={() => openPage('/my-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#6b6550] hover:bg-[#e7dbbf] rounded-xl"
          >
            <Settings size={20} />
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-2xl font-bold text-[#2c2a1e]">
              Dashboard
            </h2>

            <p className="text-[#6b6550] text-sm mt-1">
              Welcome back! Stay safe and confident.
            </p>
          </div>

          <div className="flex items-center gap-5">

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
                  {loading ? 'Loading...' : userName}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#6b7a3a] to-[#8d9d4f] rounded-2xl p-8 text-white mb-8 relative overflow-hidden">

          <div className="relative z-10">
            <p className="text-[#f0ead6] text-sm font-medium mb-2">
              YOUR SAFETY MATTERS
            </p>

            <h1 className="text-3xl font-bold mb-3">
              Welcome to SafeHer, {userName}!
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

        {/* Emergency SOS */}
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

          {/* Active SOS Details */}
          {activeAlert && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">

              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <AlertTriangle size={20} />
                Active SOS Alert
              </div>

              <p className="text-sm text-red-700 mb-2">
                Alert ID: {activeAlert.id}
              </p>

              <p className="text-sm text-red-700">
                Status: {activeAlert.state}
              </p>
            </div>
          )}

          {/* SOS and PIN Buttons */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Initial Green PIN Button */}
            {!activeAlert && !pinVerified && (
              <button
                type="button"
                onClick={handleVerifyNormalPin}
                disabled={pinLoading}
                className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
              >
                {pinLoading ? 'Verifying PIN...' : 'Enter Normal PIN'}
              </button>
            )}

            {/* Show SOS and Cancel after PIN verification */}
            {!activeAlert && pinVerified && (
              <>
                <button
                  type="button"
                  onClick={handleSOS}
                  disabled={sosLoading || countdown !== null}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {sosLoading ? 'Sending SOS...' : 'SOS Emergency'}
                </button>

                <button
                  type="button"
                  onClick={cancelSOS}
                  disabled={sosLoading}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <X size={18} />
                    {countdown !== null
                      ? `Cancel SOS (${countdown})`
                      : 'Cancel SOS'}
                  </span>
                </button>
              </>
            )}

            {/* Resolve button when alert is active */}
            {activeAlert && (
              <button
                type="button"
                onClick={handleResolveSOS}
                disabled={pinLoading}
                className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
              >
                {pinLoading ? 'Verifying PIN...' : 'Resolve Alert with PIN'}
              </button>
            )}

          </div>

          {countdown !== null && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
              <p className="text-lg font-bold text-red-700">
                SOS will be triggered in {countdown} seconds.
              </p>

              <p className="text-sm text-red-700 mt-1">
                If this was accidental, click Cancel SOS immediately.
              </p>
            </div>
          )}

          {sosMessage && (
            <p className="text-sm text-green-700 font-semibold mt-3 flex items-center gap-2">
              <CheckCircle size={17} />
              {sosMessage}
            </p>
          )}

          {sosError && (
            <p className="text-sm text-red-700 font-semibold mt-3 flex items-center gap-2">
              <X size={17} />
              {sosError}
            </p>
          )}

          <p className="text-xs text-[#6b6550] mt-3">
            An SOS alert may send an emergency SMS to your confirmed trusted contacts.
          </p>
        </section>

        {/* Services */}
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
                <div
                  key={service.title}
                  onClick={() => openPage(service.link)}
                  className="bg-white p-6 rounded-2xl border border-[#d9cfb0] shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
                >

                  <div className="flex justify-between items-start mb-5">

                    <div className="p-3 rounded-xl bg-[#f0ead6] text-[#6b7a3a]">
                      <Icon size={24} />
                    </div>

                    <ArrowUpRight size={20} className="text-[#8a7e65}" />
                  </div>

                  <h3 className="font-bold text-[#2c2a1e] text-lg mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#6b6550] mb-5">
                    {service.description}
                  </p>

                  <span className="text-sm font-semibold text-[#6b7a3a]">
                    Open Service →
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[#d9cfb0] flex justify-between text-sm text-[#6b6550]">

          <p>© 2026 SafeHer. All rights reserved.</p>

          <p className="flex items-center gap-2">
            <Clock size={15} />
            Stay Safe. Stay Confident.
          </p>
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
