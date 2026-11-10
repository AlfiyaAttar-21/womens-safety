
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Map,
  Info,
  LocateFixed
} from 'lucide-react'

import api from '../services/api'
import '../App.css'

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

  return (

    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>

        <div>

          <h1 style={styles.heading}>
            <MapPin size={27} /> Safety Risk Map
          </h1>

          <p style={styles.subtitle}>
            Explore available safety risk information in your area.
          </p>

        </div>

        <button
          onClick={() => fetchRiskCells(true)}
          style={styles.refreshButton}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Information Box */}
      <div style={styles.infoBox}>

        <Info size={20} />

        <span>
          Risk information is based on data available in the system.
          Risk information refreshes automatically every 5 seconds.
        </span>

      </div>

      {/* Current Location */}
      <div style={styles.locationCard}>

        <div>

          <h3 style={styles.cardHeading}>
            <Navigation size={19} /> Your Current Location
          </h3>

          {location ? (

            <p style={styles.locationText}>
              Latitude: {location.latitude.toFixed(5)}
              <br />
              Longitude: {location.longitude.toFixed(5)}
            </p>

          ) : (

            <p style={styles.locationText}>
              Allow location access to view your location on the map.
            </p>

          )}

          {locationError && (
            <p style={styles.errorText}>{locationError}</p>
          )}

        </div>

        <button
          onClick={getMyLocation}
          style={styles.locationButton}
        >
          <LocateFixed size={17} />
          Use My Location
        </button>

      </div>

      {/* Map View */}
      <div style={styles.mapCard}>

        <h3 style={styles.cardHeading}>
          <Map size={20} /> Map View
        </h3>

        {location ? (

          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={18}
            style={{
              height: '380px',
              width: '100%',
              borderRadius: '10px'
            }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Current Location Marker */}
            <Marker
              position={[location.latitude, location.longitude]}
              icon={createRiskIcon('#16a34a')}
            >

              <Popup>
                Your Current Location
              </Popup>

            </Marker>

            {/* Risk Cell Markers */}
            {cells.map((cell) => {

              if (
                cell.latitude == null ||
                cell.longitude == null
              ) {
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

          <div style={styles.mapPlaceholder}>

            <MapPin size={42} />

            <h3>Location Not Selected</h3>

            <p>
              Click "Use My Location" to display the map.
            </p>

          </div>

        )}

      </div>

      {/* Risk Level Legend */}
      <div style={styles.legendCard}>

        <h3 style={styles.legendHeading}>
          Risk Level Legend
        </h3>

        <div style={styles.legendItem}>

          <span
            style={{
              ...styles.legendDot,
              backgroundColor: '#16a34a'
            }}
          ></span>

          <span>Low Risk (0 - 29)</span>

        </div>

        <div style={styles.legendItem}>

          <span
            style={{
              ...styles.legendDot,
              backgroundColor: '#d97706'
            }}
          ></span>

          <span>Medium Risk (30 - 59)</span>

        </div>

        <div style={styles.legendItem}>

          <span
            style={{
              ...styles.legendDot,
              backgroundColor: '#dc2626'
            }}
          ></span>

          <span>High Risk (60 - 100)</span>

        </div>

      </div>

      {/* Risk Overview */}
      <h2 style={styles.sectionHeading}>
        Risk Overview
      </h2>

      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <ShieldCheck color="#16a34a" size={27} />

          <h2 style={{
            ...styles.statNumber,
            color: '#16a34a'
          }}>
            {lowCount}
          </h2>

          <p>Low Risk Cells</p>

        </div>

        <div style={styles.statCard}>

          <AlertTriangle color="#d97706" size={27} />

          <h2 style={{
            ...styles.statNumber,
            color: '#d97706'
          }}>
            {mediumCount}
          </h2>

          <p>Medium Risk Cells</p>

        </div>

        <div style={styles.statCard}>

          <AlertTriangle color="#dc2626" size={27} />

          <h2 style={{
            ...styles.statNumber,
            color: '#dc2626'
          }}>
            {highCount}
          </h2>

          <p>High Risk Cells</p>

        </div>

      </div>

      {/* Available Risk Cells */}
      <h2 style={styles.sectionHeading}>
        Available Risk Cells
      </h2>

      {loading ? (

        <p style={styles.message}>
          Loading risk information...
        </p>

      ) : error ? (

        <div style={styles.errorBox}>

          {error}

          <button
            onClick={() => fetchRiskCells(true)}
            style={styles.retryButton}
          >
            Try Again
          </button>

        </div>

      ) : cells.length === 0 ? (

        <div style={styles.emptyBox}>

          <MapPin size={35} color="#64748b" />

          <h3>No Risk Data Available</h3>

          <p>
            No grid cells have been calculated yet.
            Submit reports with location coordinates and configure
            risk calculation to populate this section.
          </p>

        </div>

      ) : (

        <div style={styles.cellList}>

          {cells.map((cell) => {

            const level = getRiskLevel(cell.riskScore)

            return (

              <div
                key={cell.id}
                style={styles.cellCard}
              >

                <div>

                  <h3 style={styles.cellTitle}>
                    Grid Cell: {cell.geohashCell}
                  </h3>

                  <p style={styles.cellText}>
                    Risk Score: {cell.riskScore ?? 'Not calculated'}
                  </p>

                  <p style={styles.cellText}>
                    Last Updated:{' '}
                    {cell.lastCalculatedAt
                      ? new Date(cell.lastCalculatedAt).toLocaleString()
                      : 'Not available'}
                  </p>

                </div>

                <span
                  style={{
                    ...styles.riskBadge,
                    backgroundColor: getRiskColor(level)
                  }}
                >
                  {level} Risk
                </span>

              </div>

            )

          })}

        </div>

      )}

      {/* Safety Reminder */}
      <div style={styles.safetyNote}>

        <ShieldCheck size={21} />

        <div>

          <strong>Safety Reminder</strong>

          <p>
            This map is an informational tool, not a guarantee of safety.
            For emergencies in India, call 112.
          </p>

        </div>

      </div>

    </div>

  )
}

// CSS Styles
const styles = {

  page: {
    padding: '25px',
    color: '#1e293b',
    maxWidth: '1200px',
    margin: '0 auto'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '22px'
  },

  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '27px',
    margin: '0 0 8px'
  },

  subtitle: {
    color: '#64748b',
    margin: 0
  },

  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 17px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: 'white',
    cursor: 'pointer'
  },

  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#eef2ff',
    color: '#3730a3',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px'
  },

  locationCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    marginBottom: '20px'
  },

  cardHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    margin: '0 0 12px',
    fontSize: '19px'
  },

  locationText: {
    color: '#64748b',
    lineHeight: '1.7',
    margin: 0
  },

  locationButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 17px',
    cursor: 'pointer'
  },

  mapCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    marginBottom: '25px'
  },

  mapPlaceholder: {
    height: '300px',
    background: '#f1f5f9',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    textAlign: 'center'
  },

  // Risk Legend Styles
  legendCard: {
    background: 'white',
    padding: '18px',
    borderRadius: '10px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },

  legendHeading: {
    fontSize: '18px',
    margin: '0 0 15px'
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '12px',
    color: '#475569',
    fontSize: '14px'
  },

  legendDot: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    display: 'inline-block'
  },

  sectionHeading: {
    fontSize: '21px',
    margin: '25px 0 15px'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '15px'
  },

  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },

  statNumber: {
    fontSize: '30px',
    margin: '10px 0 5px'
  },

  message: {
    color: '#64748b',
    padding: '20px'
  },

  emptyBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#64748b'
  },

  cellList: {
    display: 'grid',
    gap: '12px'
  },

  cellCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    background: 'white',
    padding: '18px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },

  cellTitle: {
    margin: '0 0 8px',
    fontSize: '16px'
  },

  cellText: {
    color: '#64748b',
    fontSize: '13px',
    margin: '5px 0'
  },

  riskBadge: {
    color: 'white',
    padding: '7px 13px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  },

  safetyNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#f0fdf4',
    color: '#166534',
    padding: '17px',
    borderRadius: '10px',
    marginTop: '25px'
  },

  errorText: {
    color: '#dc2626',
    fontSize: '13px'
  },

  errorBox: {
    background: '#fef2f2',
    color: '#b91c1c',
    padding: '20px',
    borderRadius: '10px'
  },

  retryButton: {
    marginLeft: '12px',
    padding: '8px 12px',
    cursor: 'pointer'
  }

}

export default RiskMap
