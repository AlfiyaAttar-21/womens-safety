
import { useState } from 'react'
import {
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  ArrowLeft,
  Pencil,
  Save,
  X,
  LockKeyhole,
  CheckCircle2
} from 'lucide-react'
import '../App.css'

function MyProfile() {
  const savedName = sessionStorage.getItem('safeherUserName') || ''
  const savedMobile = sessionStorage.getItem('safeherPhoneNumber') || ''

  const [name, setName] = useState(savedName)
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState(savedMobile)
  const [editMode, setEditMode] = useState(false)
  const [success, setSuccess] = useState(false)

  const [originalData, setOriginalData] = useState({
    name: savedName,
    email: '',
    mobile: savedMobile
  })

  function handleEdit() {
    setOriginalData({ name, email, mobile })
    setEditMode(true)
    setSuccess(false)
  }

  function handleCancel() {
    setName(originalData.name)
    setEmail(originalData.email)
    setMobile(originalData.mobile)
    setEditMode(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      alert('Please fill all the fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    setOriginalData({ name, email, mobile })
    sessionStorage.setItem('safeherUserName', name)
    sessionStorage.setItem('safeherPhoneNumber', mobile)

    setEditMode(false)
    setSuccess(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('safeherAccessToken')
    sessionStorage.removeItem('safeherRefreshToken')
    sessionStorage.removeItem('safeherUserId')
    sessionStorage.removeItem('safeherUserName')
    sessionStorage.removeItem('safeherPhoneNumber')

    window.location.href = '/login'
  }

  const initial = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : 'U'

  return (
    <div className="mp-page">

      {/* Navbar */}
      <nav className="mp-navbar">

        <a href="/dashboard" className="mp-brand">
          <div className="mp-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="mp-nav-actions">

          <a href="/dashboard" className="mp-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            className="mp-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Hero */}
      <section className="mp-hero">

        <div className="mp-hero-content">
          <span className="mp-eyebrow">
            <UserRound size={15} />
            ACCOUNT SETTINGS
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and keep your
            SafeHer account details up to date.
          </p>
        </div>

        <div className="mp-hero-icon">
          <UserRound size={65} strokeWidth={1.4} />
        </div>

      </section>

      {/* Main Content */}
      <main className="mp-main">

        <div className="mp-breadcrumb">
          <a href="/dashboard">Dashboard</a>
          <span>/</span>
          <span>My Profile</span>
        </div>

        {success && (
          <div className="mp-success-message">
            <CheckCircle2 size={19} />
            Profile details updated in this session.
          </div>
        )}

        <div className="mp-layout">

          {/* Profile Card */}
          <aside className="mp-side-card">

            <div className="mp-avatar">
              {initial}
            </div>

            <h2>{name || 'SafeHer User'}</h2>

            <p className="mp-account-label">
              <ShieldCheck size={15} />
              SafeHer Member
            </p>

            <div className="mp-side-divider"></div>

            <div className="mp-side-info">
              <LockKeyhole size={17} />
              <div>
                <strong>Account Security</strong>
                <span>Your account is protected with login authentication.</span>
              </div>
            </div>

            <div className="mp-side-info">
              <CheckCircle2 size={17} />
              <div>
                <strong>Personal Details</strong>
                <span>Keep your contact information up to date.</span>
              </div>
            </div>

          </aside>

          {/* Personal Information */}
          <section className="mp-form-card">

            <div className="mp-form-heading">

              <div>
                <h2>Personal Information</h2>
                <p>View and manage your account details.</p>
              </div>

              {!editMode && (
                <button
                  type="button"
                  className="mp-edit-btn"
                  onClick={handleEdit}
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              )}

            </div>

            <form onSubmit={handleSubmit}>

              <div className="mp-field">

                <label htmlFor="mp-name">
                  <UserRound size={16} />
                  Full Name
                </label>

                <input
                  id="mp-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editMode}
                  maxLength={100}
                  required
                />

              </div>

              <div className="mp-field">

                <label htmlFor="mp-email">
                  <Mail size={16} />
                  Email Address
                </label>

                <input
                  id="mp-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  maxLength={100}
                  required
                />

              </div>

              <div className="mp-field">

                <label htmlFor="mp-mobile">
                  <Phone size={16} />
                  Mobile Number
                </label>

                <input
                  id="mp-mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      setMobile(value)
                    }
                  }}
                  disabled={!editMode}
                  maxLength={10}
                  required
                />

              </div>

              {editMode && (
                <div className="mp-form-actions">

                  <button
                    type="submit"
                    className="mp-save-btn"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="mp-cancel-btn"
                    onClick={handleCancel}
                  >
                    <X size={17} />
                    Cancel
                  </button>

                </div>
              )}

            </form>

            {!editMode && (
              <div className="mp-readonly-note">
                <LockKeyhole size={15} />
                Click Edit Profile to update your information.
              </div>
            )}

          </section>

        </div>

        {/* Privacy Notice */}
        <div className="mp-privacy-notice">
          <ShieldCheck size={21} />

          <div>
            <strong>Your Privacy Matters</strong>
            <p>
              Keep your account details accurate. Never share your
              password, OTP or security PIN with anyone.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mp-footer">

        <div className="mp-footer-brand">
          <ShieldCheck size={21} />
          SafeHer
        </div>

        <p>Stay Safe. Stay Strong. Stay Confident.</p>

        <span>© 2026 SafeHer. All rights reserved.</span>

      </footer>

    </div>
  )
}

export default MyProfile
