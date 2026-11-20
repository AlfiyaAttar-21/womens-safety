
import { useState } from 'react'
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react'

import AppShell from '../components/AppShell'
import '../App.css'

function MyProfile() {
  const [profile, setProfile] = useState({
    name: sessionStorage.getItem('safeherUserName') || '',
    email: sessionStorage.getItem('safeherEmail') || '',
    mobile: sessionStorage.getItem('safeherPhoneNumber') || ''
  })

  const [originalProfile, setOriginalProfile] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    const { name, value } = e.target

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }))

    setSuccess('')
  }

  function handleEdit() {
    setOriginalProfile(profile)
    setIsEditing(true)
    setSuccess('')
  }

  function handleCancel() {
    setProfile(originalProfile)
    setIsEditing(false)
    setSuccess('')
  }

  function handleSave(e) {
    e.preventDefault()

    if (
      !profile.name.trim() ||
      !profile.email.trim() ||
      !profile.mobile.trim()
    ) {
      alert('Please fill all profile details.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      alert('Please enter a valid email address.')
      return
    }

    if (!/^[0-9]{10}$/.test(profile.mobile.trim())) {
      alert('Please enter a valid 10 digit mobile number.')
      return
    }

    const updatedProfile = {
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      mobile: profile.mobile.trim()
    }

    // Save all profile details
    sessionStorage.setItem('safeherUserName', updatedProfile.name)
    sessionStorage.setItem('safeherEmail', updatedProfile.email)
    sessionStorage.setItem('safeherPhoneNumber', updatedProfile.mobile)

    setProfile(updatedProfile)
    setOriginalProfile(updatedProfile)

    setIsEditing(false)
    setSuccess('Your profile has been updated successfully!')
  }

  function handleLogout() {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout?'
    )

    if (confirmLogout) {
      sessionStorage.removeItem('safeherAccessToken')
      sessionStorage.removeItem('safeherRefreshToken')
      sessionStorage.removeItem('safeherUserId')
      sessionStorage.removeItem('safeherUserName')
      sessionStorage.removeItem('safeherEmail')
      sessionStorage.removeItem('safeherPhoneNumber')

      window.location.href = '/login'
    }
  }

  const initial = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase()
    : 'U'

  return (
    <AppShell active="profile">

      <div className="profile-page">

        <div className="profile-page-heading">

          <div>
            <div className="profile-eyebrow">
              <ShieldCheck size={15} />
              YOUR ACCOUNT
            </div>

            <h1>My Profile</h1>

            <p>Manage your personal information and account details.</p>
          </div>

          <button
            type="button"
            className="profile-back-button"
            onClick={() => window.location.href = '/dashboard'}
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

        </div>

        <div className="profile-layout">

          <section className="profile-card">

            <div className="profile-card-top">

              <div className="profile-avatar">
                {initial}
              </div>

              <h2>{profile.name || 'Your Name'}</h2>

              <p>{profile.email || 'Your email address'}</p>

              <div className="profile-verified">
                <CheckCircle2 size={14} />
                SafeHer Account
              </div>

            </div>

            <div className="profile-card-content">

              <div className="profile-section-heading">

                <div>
                  <h3>Personal Information</h3>
                  <p>Keep your account details up to date.</p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    className="profile-edit-button"
                    onClick={handleEdit}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                )}

              </div>

              {success && (
                <div className="profile-success">
                  <CheckCircle2 size={18} />
                  {success}
                </div>
              )}

              <form onSubmit={handleSave}>

                <div className="profile-field">

                  <label htmlFor="profile-name">
                    <UserRound size={16} />
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={100}
                  />

                </div>

                <div className="profile-field">

                  <label htmlFor="profile-email">
                    <Mail size={16} />
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={150}
                  />

                </div>

                <div className="profile-field">

                  <label htmlFor="profile-mobile">
                    <Phone size={16} />
                    Mobile Number
                  </label>

                  <input
                    id="profile-mobile"
                    type="tel"
                    name="mobile"
                    placeholder="Enter 10 digit mobile number"
                    value={profile.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={10}
                  />

                </div>

                {isEditing && (

                  <div className="profile-form-actions">

                    <button
                      type="button"
                      className="profile-cancel-button"
                      onClick={handleCancel}
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-save-button"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>

                  </div>

                )}

              </form>

            </div>

          </section>

          <aside className="profile-side-column">

            <div className="profile-info-card">

              <div className="profile-info-icon">
                <ShieldCheck size={23} />
              </div>

              <h3>Your Safety Matters</h3>

              <p>
                Keep your contact information updated so your SafeHer
                account details remain accurate.
              </p>

            </div>

            <div className="profile-security-card">

              <div className="profile-security-icon">
                <LockKeyhole size={21} />
              </div>

              <div>
                <h3>Account Security</h3>
                <p>Your account is protected by your login session.</p>
              </div>

            </div>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </aside>

        </div>

      </div>

    </AppShell>
  )
}

export default MyProfile
