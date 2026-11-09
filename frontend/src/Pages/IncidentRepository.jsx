
import { useState } from 'react'
import '../App.css'

function IncidentReporting() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [reports, setReports] = useState([])

  function handleSubmit(e) {
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

    const newReport = {
      title: title.trim(),
      category,
      description: description.trim(),
      date,
      location: location.trim()
    }

    setReports([...reports, newReport])

    setTitle('')
    setCategory('')
    setDescription('')
    setDate('')
    setLocation('')

    alert('Incident reported successfully!')
  }

  function deleteReport(index) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report?'
    )

    if (confirmDelete) {
      const updatedReports = reports.filter(
        (report, i) => i !== index
      )

      setReports(updatedReports)
    }
  }

  return (
    <div className="incident-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>♡</span> SafeHer
        </div>

        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
        </div>

        <button
          className="login-btn"
          onClick={() => window.location.href = '/'}
        >
          Logout
        </button>
      </nav>

      {/* Header */}
      <section className="incident-header">
        <h1>Incident Reporting 📝</h1>
        <p>Report safety-related incidents and help create awareness.</p>
      </section>

      {/* Report Form */}
      <section className="incident-form-section">
        <div className="incident-form-box">

          <div className="incident-icon">📋</div>

          <h2>Report an Incident</h2>
          <p>Enter the details of your incident below.</p>

          <form onSubmit={handleSubmit}>

            <label>Incident Title</label>
            <input
              type="text"
              placeholder="Enter incident title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Incident Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Harassment">Harassment</option>
              <option value="Stalking">Stalking</option>
              <option value="Unsafe Location">Unsafe Location</option>
              <option value="Verbal Abuse">Verbal Abuse</option>
              <option value="Physical Threat">Physical Threat</option>
              <option value="Other">Other</option>
            </select>

            <label>Incident Description</label>
            <textarea
              placeholder="Describe the incident..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Incident Date</label>
            <input
              type="date"
              max={new Date().toLocaleDateString('en-CA')}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Incident Location</label>
            <input
              type="text"
              placeholder="Enter incident location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button type="submit" className="incident-submit-btn">
              Submit Report
            </button>

          </form>
        </div>
      </section>

      {/* Saved Reports */}
      <section className="saved-reports">

        <h2>My Incident Reports</h2>

        <p className="report-count">
          Total Reports: {reports.length}
        </p>

        {reports.length === 0 ? (

          <div className="empty-reports">
            <span>📝</span>
            <h3>No Reports Submitted Yet</h3>
            <p>Your submitted reports will appear here.</p>
          </div>

        ) : (

          <div className="reports-grid">

            {reports.map((report, index) => (

              <div className="report-card" key={index}>

                <h3>{report.title}</h3>

                <span className="report-category">
                  {report.category}
                </span>

                <p><strong>Description:</strong> {report.description}</p>

                <p><strong>Date:</strong> {report.date}</p>

                <p><strong>Location:</strong> {report.location}</p>

                <button
                  type="button"
                  className="report-delete-btn"
                  onClick={() => deleteReport(index)}
                >
                  Delete Report
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* Footer */}
      <footer>
        <h2>♡ SafeHer</h2>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <p>© 2026 SafeHer. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default IncidentReporting
