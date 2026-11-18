import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import {
  MapPin, ShieldCheck, AlertTriangle, RefreshCw, Navigation,
  Info, LocateFixed,
} from 'lucide-react'
import api from '../services/api'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import Card from '../components/Card'
import { PageTitle } from '../components/FormBits'

// Create Risk Marker Icon
const createRiskIcon = (color) => {
  return L.divIcon({
    className: 'risk-marker-icon',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })
}

function RiskMap() {

  const [cells, setCells] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  // Fetch Risk Cells from Backend
  const fetchRiskCells = async (showLoading = false) => {

    try {

      if (showLoading) {
        setLoading(true)
      }

      const response = await api.get('/grid-cells')

      setCells(Array.isArray(response.data) ? response.data : [])

      setError('')

    } catch (err) {

      console.error('Risk Map Error:', err)

      // Show error for initial load or manual refresh
      if (showLoading) {
        setError('Unable to load risk map data. Please try again.')
      }

    } finally {

      if (showLoading) {
        setLoading(false)
      }

    }
  }

  // Initial Load and Automatic Refresh Every 5 Seconds
  useEffect(() => {

    // Load risk data when page opens
    fetchRiskCells(true)

    // Automatically fetch updated risk data every 5 seconds
    const interval = setInterval(() => {
      fetchRiskCells(false)
    }, 5000)

    // Stop automatic refresh when component closes
    return () => {
      clearInterval(interval)
    }

  }, [])

  // Get Current Location
  const getMyLocation = () => {

    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError('Location is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })

      },

      () => {

        setLocationError(
          'Unable to access location. Please allow location permission.'
        )

      },

      {
        enableHighAccuracy: true,
        timeout: 10000
      }

    )
  }

  // Get Risk Level
  const getRiskLevel = (score) => {

    if (score === null || score === undefined) return 'Unknown'

    if (score < 30) return 'Low'

    if (score < 60) return 'Medium'

    return 'High'
  }

  // Get Risk Color
  const getRiskColor = (level) => {

    if (level === 'Low') return '#16a34a'

    if (level === 'Medium') return '#d97706'

    if (level === 'High') return '#dc2626'

    return '#64748b'
  }

  // Calculate Risk Counts
  const lowCount = cells.filter(
    cell => getRiskLevel(cell.riskScore) === 'Low'
  ).length

  const mediumCount = cells.filter(
    cell => getRiskLevel(cell.riskScore) === 'Medium'
  ).length

  const highCount = cells.filter(
    cell => getRiskLevel(cell.riskScore) === 'High'
  ).length

const legend = [
    ['#16a34a', 'Low risk (0 to 29)'],
    ['#d97706', 'Medium risk (30 to 59)'],
    ['#dc2626', 'High risk (60 to 100)'],
  ]

  return (
    <AppShell active="map" wide>
      <PageTitle title="Safety risk map" subtitle="See which areas have had reported incidents. Updates every 5 seconds.">
        <Button type="button" variant="secondary" onClick={() => fetchRiskCells(true)}>
          <RefreshCw size={17} /> Refresh
        </Button>
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Map */}
        <div className="isolate overflow-hidden rounded-3xl bg-white shadow-soft">
          {location ? (
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={18}
              style={{ height: '520px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <Marker position={[location.latitude, location.longitude]} icon={createRiskIcon('#2A1B3D')}>
                <Popup>Your current location</Popup>
              </Marker>

              {cells.map((cell) => {
                if (cell.latitude == null || cell.longitude == null) {
                  return null
                }

                const level = getRiskLevel(cell.riskScore)

                return (
                  <Marker
                    key={cell.id}
                    position={[cell.latitude, cell.longitude]}
                    icon={createRiskIcon(getRiskColor(level))}
                  >
                    <Popup>
                      <strong>{level} Risk</strong>
                      <br />
                      Grid Cell: {cell.geohashCell}
                      <br />
                      Risk Score: {cell.riskScore}
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          ) : (
            <div className="grid h-[420px] place-items-center bg-lilac/40 p-8 text-center">
              <div>
                <MapPin className="mx-auto text-ink-faint" size={42} />
                <h2 className="mt-4 font-display text-xl font-bold">Show the map</h2>
                <p className="mx-auto mt-2 max-w-xs text-ink-soft">Allow location access to see risk areas around you.</p>
                <Button type="button" className="mt-5" onClick={getMyLocation}>
                  <LocateFixed size={17} /> Use my location
                </Button>
                {locationError && <p role="alert" className="mt-4 text-sm font-medium text-sos">{locationError}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          {location && (
            <Card className="!p-5">
              <h2 className="flex items-center gap-2 font-display font-bold"><Navigation size={18} /> Your location</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Latitude {location.latitude.toFixed(5)}<br />Longitude {location.longitude.toFixed(5)}
              </p>
              <Button type="button" variant="secondary" className="mt-3" onClick={getMyLocation}>
                <LocateFixed size={16} /> Update
              </Button>
              {locationError && <p role="alert" className="mt-3 text-sm font-medium text-sos">{locationError}</p>}
            </Card>
          )}

          <Card className="!p-5">
            <h2 className="font-display font-bold">Risk levels</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {legend.map(([color, label]) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: color }} /> {label}
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              [ShieldCheck, '#16a34a', lowCount, 'Low'],
              [AlertTriangle, '#d97706', mediumCount, 'Medium'],
              [AlertTriangle, '#dc2626', highCount, 'High'],
            ].map(([Icon, color, count, label]) => (
              <div key={label} className="rounded-2xl bg-white p-3 shadow-soft">
                <Icon className="mx-auto" size={20} color={color} />
                <p className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>{count}</p>
                <p className="text-xs text-ink-soft">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cells */}
      <section className="mt-10" aria-labelledby="cells">
        <h2 id="cells" className="font-display text-xl font-bold">Risk cells</h2>

        {loading ? (
          <p className="mt-4 text-ink-soft">Loading risk information…</p>
        ) : error ? (
          <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[#FBDDE2] p-4 text-[#A11D31]">
            {error}
            <Button type="button" variant="secondary" onClick={() => fetchRiskCells(true)}>Try again</Button>
          </div>
        ) : cells.length === 0 ? (
          <div className="mt-4 rounded-3xl border-2 border-dashed border-ink/15 p-8 text-center">
            <MapPin className="mx-auto text-ink-faint" size={36} />
            <h3 className="mt-3 font-display text-lg font-bold">No risk data yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
              Risk cells appear after incident reports with coordinates are submitted.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {cells.map((cell) => {
              const level = getRiskLevel(cell.riskScore)
              return (
                <div key={cell.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">Grid cell {cell.geohashCell}</p>
                    <p className="text-sm text-ink-soft">Score: {cell.riskScore ?? 'Not calculated'}</p>
                    <p className="text-xs text-ink-faint">
                      Updated {cell.lastCalculatedAt ? new Date(cell.lastCalculatedAt).toLocaleString() : 'not available'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: getRiskColor(level) }}>
                    {level}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <p className="mt-8 flex items-start gap-3 rounded-2xl bg-lilac/60 p-4 text-sm text-ink-soft">
        <Info size={20} className="mt-0.5 shrink-0 text-ink" />
        This map is for information only and does not guarantee safety. In an emergency, call 112.
      </p>
    </AppShell>
  )
}

export default RiskMap
