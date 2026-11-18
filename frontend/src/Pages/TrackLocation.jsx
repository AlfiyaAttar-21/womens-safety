import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Shield, MapPin, Clock } from 'lucide-react'
import api from '../services/api'
import 'leaflet/dist/leaflet.css'

function TrackLocation() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const pathParts = window.location.pathname.split('/')
  const token = pathParts[pathParts.length - 1]

  useEffect(() => {
    let isMounted = true

    const fetchLocation = async () => {
      try {
        const response = await api.get(
          `/tracking/public/${token}`
        )

        if (!isMounted) return

        const latitude = Number(response.data.latitude)
        const longitude = Number(response.data.longitude)

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          (latitude === 0 && longitude === 0)
        ) {
          setLocation(null)
          setError('Waiting for the user GPS location...')
        } else {
          setLocation({
            latitude,
            longitude
          })

          setError('')
          setLastUpdated(new Date().toLocaleTimeString())
        }
      } catch (err) {
        if (!isMounted) return

        setError(
          err.response?.data?.message ||
          'Tracking link is invalid or expired.'
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchLocation()

    const interval = setInterval(fetchLocation, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [token])

return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <header className="bg-ink text-cream">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-ink"><Shield size={21} /></span>
          <div>
            <h1 className="font-display text-xl font-extrabold leading-tight">SafeHer live location</h1>
            <p className="text-sm text-cream/70">Shared with you by a SafeHer user</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-6">
        <section className="rounded-3xl bg-white p-6 shadow-soft" aria-live="polite">
          {loading && <p className="text-ink-soft">Loading location…</p>}

          {!loading && location && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-semibold text-[#136B5D]">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-safe" />
                  </span>
                  Live location received
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft"><Clock size={15} /> Last updated {lastUpdated}. Refreshes every 5 seconds.</p>
              </div>
              <p className="rounded-2xl bg-lilac/60 px-4 py-3 text-sm text-ink-soft">
                {location.latitude}, {location.longitude}
              </p>
            </div>
          )}

          {!loading && !location && (
            <p className="flex items-start gap-2 font-medium text-[#8A5A00]">
              <MapPin size={18} className="mt-0.5 shrink-0" /> {error || 'Waiting for location…'}
            </p>
          )}

          {error && location && <p className="mt-3 text-sm font-medium text-[#8A5A00]">{error}</p>}
        </section>

        {location && (
          <section className="isolate mt-5 overflow-hidden rounded-3xl bg-white shadow-soft" aria-label="Map">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: '60vh', minHeight: '360px', width: '100%' }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <CircleMarker
                center={[location.latitude, location.longitude]}
                radius={12}
                pathOptions={{ color: '#C42A40', fillColor: '#E5384F', fillOpacity: 0.85 }}
              >
                <Popup>SafeHer user location</Popup>
              </CircleMarker>
            </MapContainer>
          </section>
        )}

        <div className="mt-8 text-center text-sm text-ink-soft">
          <p className="font-display font-bold text-ink">SafeHer</p>
          <p>Stay safe. Stay strong. Stay confident.</p>
        </div>
      </main>
    </div>
  )
}

export default TrackLocation
