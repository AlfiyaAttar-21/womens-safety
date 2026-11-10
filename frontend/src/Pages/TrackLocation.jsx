
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
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
    <div style={{
      minHeight: '100vh',
      background: '#faf8f2',
      padding: '25px',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{
        maxWidth: '1100px',
        margin: 'auto'
      }}>

        <div style={{
          background: '#8d9d4f',
          color: 'white',
          padding: '22px',
          borderRadius: '14px',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>
            ♡ SafeHer Live Tracking
          </h1>

          <p style={{ marginBottom: 0 }}>
            Live location shared by a SafeHer user
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '14px',
          marginBottom: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>

          <h2>Location Status</h2>

          {loading && (
            <p>Loading location...</p>
          )}

          {!loading && location && (
            <div>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                ● Location received
              </p>

              <p>
                Latitude: {location.latitude}
              </p>

              <p>
                Longitude: {location.longitude}
              </p>

              <p>
                Last updated: {lastUpdated}
              </p>

              <p style={{ color: '#666' }}>
                Location refreshes automatically every 5 seconds.
              </p>
            </div>
          )}

          {!loading && !location && (
            <p style={{ color: '#b7791f' }}>
              {error || 'Waiting for location...'}
            </p>
          )}

          {error && location && (
            <p style={{ color: '#b7791f' }}>
              {error}
            </p>
          )}
        </div>

        {location && (
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>

            <h2>Live Location Map</h2>

            <MapContainer
              center={[
                location.latitude,
                location.longitude
              ]}
              zoom={16}
              scrollWheelZoom={true}
              style={{
                height: '450px',
                width: '100%',
                borderRadius: '12px'
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <CircleMarker
                center={[
                  location.latitude,
                  location.longitude
                ]}
                radius={12}
                pathOptions={{
                  color: '#c93c37',
                  fillColor: '#e74c3c',
                  fillOpacity: 0.8
                }}
              >
                <Popup>
                  SafeHer User Location
                </Popup>
              </CircleMarker>
            </MapContainer>

          </div>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          color: '#6b6550'
        }}>
          <p>♡ SafeHer India</p>
          <p>Stay Safe. Stay Strong. Stay Confident.</p>
        </div>

      </div>
    </div>
  )
}

export default TrackLocation
