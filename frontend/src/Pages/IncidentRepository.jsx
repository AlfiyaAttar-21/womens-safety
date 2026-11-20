
import { useState } from 'react'
import {
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  FileText,
  MapPin,
  CalendarDays,
  Trash2,
  PlusCircle,
  Heart,
  LockKeyhole,
  ClipboardList
} from 'lucide-react'
import '../App.css'

function IncidentReporting() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [reports, setReports] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const today = new Date()
  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !date ||
      !location.trim()
    ) {
      setError('Please fill in all the fields.')
      return
    }

    if (date > maxDate) {
      setError('Incident date cannot be in the future.')
      return
    }

    const newReport = {
      id: Date.now(),
      title: title.trim(),
      category,
      description: description.trim(),
      date,
      location: location.trim()
    }

    setReports((previousReports) => [newReport, ...previousReports])

    setTitle('')
    setCategory('')
    setDescription('')
    setDate('')
    setLocation('')
    setMessage('Your incident report has been added successfully.')
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report?'
    )

    if (!confirmDelete) return

    setReports((previousReports) =>
      previousReports.filter((report) => report.id !== id)
    )

    setMessage('Incident report deleted successfully.')
    setError('')
  }

  function formatDate(value) {
    return new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function logout() {
    sessionStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="ir-page">
      <nav className="ir-navbar">
        <a href="/dashboard" className="ir-brand">
          <span className="ir-brand-icon">
            <ShieldCheck size={24} />
          </span>
          <span>SafeHer</span>
        </a>

        <div className="ir-nav-right">
          <a href="/dashboard" className="ir-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button className="ir-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="ir-hero">
        <div className="ir-hero-content">
          <span className="ir-eyebrow">
            <ShieldCheck size={15} />
            YOUR VOICE MATTERS
          </span>

          <h1>Incident Reporting</h1>

          <p>
            Report an incident and keep a record of important details.
            Your safety and well-being matter to us.
          </p>

          <div className="ir-hero-note">
            <Heart size={18} />
            <span>You are not alone. Your safety matters.</span>
          </div>
        </div>

        <div className="ir-hero-art">
          <div className="ir-hero-circle">
            <FileText size={65} strokeWidth={1.4} />
            <span className="ir-art-shield">
              <ShieldCheck size={23} />
            </span>
          </div>
        </div>
      </section>

      <main className="ir-main">
        {error && (
          <div className="ir-alert ir-error">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="ir-alert ir-success">
            <ShieldCheck size={19} />
            <span>{message}</span>
          </div>
        )}

        <section className="ir-form-card">
          <div className="ir-section-heading">
            <div className="ir-heading-icon">
              <PlusCircle size={23} />
            </div>

            <div>
              <h2>Report an Incident</h2>
              <p>Enter the details of the incident below.</p>
            </div>
          </div>

          <div className="ir-info-note">
            <LockKeyhole size={19} />
            <p>
              Provide accurate information so you can maintain a useful
              record of the incident.
            </p>
          </div>

          <form className="ir-form" onSubmit={handleSubmit}>
            <div className="ir-form-group">
              <label htmlFor="ir-title">Incident Title</label>
              <input
                id="ir-title"
                type="text"
                placeholder="Enter incident title"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="ir-form-group">
              <label htmlFor="ir-category">Incident Category</label>
              <select
                id="ir-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select incident category</option>
                <option value="Harassment">Harassment</option>
                <option value="Stalking">Stalking</option>
                <option value="Unsafe Location">Unsafe Location</option>
                <option value="Verbal Abuse">Verbal Abuse</option>
                <option value="Physical Threat">Physical Threat</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="ir-form-group">
              <label htmlFor="ir-date">Incident Date</label>
              <div className="ir-input-icon">
                <CalendarDays size={18} />
                <input
                  id="ir-date"
                  type="date"
                  value={date}
                  max={maxDate}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ir-form-group">
              <label htmlFor="ir-location">Incident Location</label>
              <div className="ir-input-icon">
                <MapPin size={18} />
                <input
                  id="ir-location"
                  type="text"
                  placeholder="Enter incident location"
                  value={location}
                  maxLength={150}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ir-form-group ir-full-width">
              <label htmlFor="ir-description">Incident Description</label>
              <textarea
                id="ir-description"
                placeholder="Describe what happened..."
                value={description}
                maxLength={1000}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <span className="ir-character-count">
                {description.length}/1000 characters
              </span>
            </div>

            <button type="submit" className="ir-submit-btn">
              <FileText size={18} />
              Submit Report
            </button>
          </form>
        </section>

        <section className="ir-reports-section">
          <div className="ir-reports-heading">
            <div>
              <span className="ir-section-label">YOUR RECORDS</span>
              <h2>My Incident Reports</h2>
              <p>View the incident reports you have added.</p>
            </div>

            <div className="ir-report-count">
              <ClipboardList size={19} />
              <span>{reports.length} Reports</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="ir-empty-state">
              <div className="ir-empty-icon">
                <FileText size={35} />
              </div>
              <h3>No Reports Yet</h3>
              <p>
                Your submitted incident records will appear here.
              </p>
            </div>
          ) : (
            <div className="ir-reports-grid">
              {reports.map((report) => (
                <article className="ir-report-card" key={report.id}>
                  <div className="ir-report-card-top">
                    <span className="ir-category-badge">
                      {report.category}
                    </span>

                    <button
                      type="button"
                      className="ir-delete-btn"
                      onClick={() => handleDelete(report.id)}
                      aria-label="Delete report"
                      title="Delete report"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <h3>{report.title}</h3>

                  <p className="ir-report-description">
                    {report.description}
                  </p>

                  <div className="ir-report-meta">
                    <span>
                      <CalendarDays size={15} />
                      {formatDate(report.date)}
                    </span>

                    <span>
                      <MapPin size={15} />
                      {report.location}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="ir-support-note">
          <Heart size={22} />
          <div>
            <h3>Your Safety Comes First</h3>
            <p>
              If you are in immediate danger, move to a safer place and
              contact local emergency services or someone you trust.
            </p>
          </div>
        </div>
      </main>

      <footer className="ir-footer">
        <div className="ir-footer-brand">
          <ShieldCheck size={22} />
          <span>SafeHer</span>
        </div>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <span>© 2026 SafeHer. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default IncidentReporting
