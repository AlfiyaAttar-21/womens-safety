import { useEffect, useState } from 'react'
import {
  FileText, ClipboardList, AlertTriangle, MapPin, CalendarDays,
  Trash2, Eye, MessageCircle, Siren, Navigation, ShieldCheck,
} from 'lucide-react'
import api from '../services/api'
import AppShell from '../components/AppShell'
import Field from '../components/Field'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { SelectField, TextAreaField, PageTitle } from '../components/FormBits'

function IncidentReporting() {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  // Incident coordinates
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [locationStatus, setLocationStatus] = useState('')

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const today = new Date()

  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  // Generate geohash from latitude and longitude
  function generateGeohash(lat, lon, precision = 7) {

    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

    let latMin = -90
    let latMax = 90
    let lonMin = -180
    let lonMax = 180

    let isEven = true
    let bit = 0
    let ch = 0
    let geohash = ''

    while (geohash.length < precision) {

      if (isEven) {

        const mid = (lonMin + lonMax) / 2

        if (lon >= mid) {
          ch |= (1 << (4 - bit))
          lonMin = mid
        } else {
          lonMax = mid
        }

      } else {

        const mid = (latMin + latMax) / 2

        if (lat >= mid) {
          ch |= (1 << (4 - bit))
          latMin = mid
        } else {
          latMax = mid
        }
      }

      isEven = !isEven

      if (bit < 4) {
        bit++
      } else {
        geohash += BASE32[ch]
        bit = 0
        ch = 0
      }
    }

    return geohash
  }

  // Get current location with user's permission
  function useCurrentLocation() {

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.')
      return
    }

    setLocationStatus('Getting your location...')

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude
        const lon = position.coords.longitude

        setLatitude(lat)
        setLongitude(lon)

        setLocationStatus(
          `Location captured: ${lat.toFixed(5)}, ${lon.toFixed(5)}`
        )
      },

      (error) => {

        console.error('Location error:', error)

        if (error.code === 1) {
          setLocationStatus('Location permission denied. Please allow location access.')
        } else if (error.code === 2) {
          setLocationStatus('Your location is currently unavailable.')
        } else {
          setLocationStatus('Unable to get location. Please try again.')
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  // Load logged-in user's reports
  async function fetchReports() {

    try {

      setLoading(true)

      const response = await api.get('/reports/my')

      setReports(Array.isArray(response.data) ? response.data : [])

    } catch (error) {

      console.error('Fetch reports error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to load reports. Please login again if your session expired.'
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // Submit incident report
  async function handleSubmit(e) {

    e.preventDefault()

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !date ||
      !location.trim()
    ) {

      alert('Please fill all the fields')
      return
    }

    if (date > maxDate) {

      alert('Incident date cannot be in the future')
      return
    }

    // Generate geohash only when coordinates are available
    let geohash = null

    if (latitude !== null && longitude !== null) {
      geohash = generateGeohash(latitude, longitude)
    }

    const reportData = {

      title: title.trim(),
      category: category,
      description: description.trim(),
      incidentDate: date,
      location: location.trim(),

      latitude: latitude,
      longitude: longitude,
      geohash: geohash
    }

    try {

      setSubmitting(true)

      console.log('REPORT DATA:', reportData)

      await api.post('/reports', reportData)

      alert('Incident reported successfully!')

      setTitle('')
      setCategory('')
      setDescription('')
      setDate('')
      setLocation('')

      setLatitude(null)
      setLongitude(null)
      setLocationStatus('')

      await fetchReports()

    } catch (error) {

      console.error('Submit report error:', error)

      alert(
        error.response?.data?.message ||
        'Failed to submit report. Please try again.'
      )

    } finally {

      setSubmitting(false)
    }
  }

  // Delete report from database
  async function deleteReport(id) {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report?'
    )

    if (!confirmDelete) {
      return
    }

    try {

      setDeletingId(id)

      await api.delete(`/reports/${id}`)

      setReports(previousReports =>
        previousReports.filter(report => report.id !== id)
      )

      alert('Report deleted successfully!')

    } catch (error) {

      console.error('Delete report error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to delete report.'
      )

    } finally {

      setDeletingId(null)
    }
  }

  // Format date
  function formatDate(value) {

    if (!value) {
      return 'Date not available'
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Category icon
  function getCategoryIcon(value) {

    if (value === 'Harassment' || value === 'Stalking') {
      return <Eye size={17} />
    }

    if (value === 'Unsafe Location') {
      return <MapPin size={17} />
    }

    if (value === 'Verbal Abuse') {
      return <MessageCircle size={17} />
    }

    if (value === 'Physical Threat') {
      return <AlertTriangle size={17} />
    }

    return <FileText size={17} />
  }

return (
    <AppShell active="reports">
      <PageTitle
        title="Incident reports"
        subtitle="Share what happened. Your reports help build a clearer picture of unsafe places."
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-4 py-2 text-sm font-semibold">
          <ClipboardList size={17} /> {reports.length} {reports.length === 1 ? 'report' : 'reports'}
        </span>
      </PageTitle>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Form */}
        <Card className="h-fit">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold"><FileText size={20} /> Report an incident</h2>
          <p className="mb-6 mt-2 flex items-start gap-2 text-sm text-ink-soft">
            <ShieldCheck size={17} className="mt-0.5 shrink-0" />
            Share only what you’re comfortable with. Never include passwords or other account details.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Title" placeholder="A short title" value={title} maxLength="120"
              onChange={(e) => setTitle(e.target.value)} />
            <SelectField label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              <option value="Harassment">Harassment</option>
              <option value="Stalking">Stalking</option>
              <option value="Unsafe Location">Unsafe Location</option>
              <option value="Verbal Abuse">Verbal Abuse</option>
              <option value="Physical Threat">Physical Threat</option>
              <option value="Other">Other</option>
            </SelectField>
            <TextAreaField label="What happened?" rows="5" maxLength="1000" placeholder="Describe the incident"
              value={description} onChange={(e) => setDescription(e.target.value)}
              hint={`${description.length}/1000`} />
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field label="Date" icon={CalendarDays} type="date" max={maxDate} value={date}
                onChange={(e) => setDate(e.target.value)} />
              <Field label="Place" icon={MapPin} placeholder="Where did it happen?" maxLength="200"
                value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="mb-5 rounded-2xl bg-lilac/50 p-4">
              <p className="text-sm font-semibold">Exact location (optional)</p>
              <p className="mt-1 text-sm text-ink-soft">
                If it happened where you are now, capture your coordinates so it appears on the risk map.
              </p>
              <Button type="button" variant="secondary" className="mt-3" onClick={useCurrentLocation} disabled={submitting}>
                <Navigation size={17} /> Use my current location
              </Button>
              {locationStatus && <p className="mt-3 text-sm text-ink-soft" role="status">{locationStatus}</p>}
              {latitude !== null && longitude !== null && (
                <p className="mt-2 text-sm font-medium">
                  Latitude {latitude.toFixed(6)}, longitude {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              <FileText size={17} /> {submitting ? 'Submitting…' : 'Submit report'}
            </Button>
          </form>
        </Card>

        {/* Reports */}
        <section aria-label="My reports">
          {loading ? (
            <div className="space-y-4" aria-busy="true">
              {[1, 2].map((n) => <div key={n} className="h-40 animate-pulse rounded-3xl bg-ink/5" />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-ink/15 p-10 text-center">
              <ClipboardList className="mx-auto text-ink-faint" size={40} />
              <h3 className="mt-4 font-display text-xl font-bold">No reports yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-ink-soft">Reports you submit will show up here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="!p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-lilac">{getCategoryIcon(report.category)}</span>
                    <Badge>{report.category}</Badge>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold">{report.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{report.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> {formatDate(report.incidentDate)}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {report.location}</span>
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === report.id}
                    onClick={() => deleteReport(report.id)}
                    className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-sos ring-1 ring-sos/30 hover:bg-[#FBDDE2] disabled:opacity-60"
                  >
                    <Trash2 size={15} /> {deletingId === report.id ? 'Deleting…' : 'Delete report'}
                  </button>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-3xl bg-sos p-5 text-white">
            <Siren size={24} className="mt-0.5 shrink-0" />
            <div>
              <h3 className="font-display text-lg font-bold">In immediate danger?</h3>
              <p className="mt-1 text-sm text-white/90">
                Move somewhere safer if you can and call 112, India’s emergency number.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

export default IncidentReporting
