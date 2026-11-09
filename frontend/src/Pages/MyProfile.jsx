import { useState } from 'react'
import '../App.css'

function MyProfile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      alert('Please fill all the fields')
      return
    }

    alert('Profile updated successfully!')
  }

  return (
    <div className="profile-page">

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

      <section className="profile-header">
        <h1>My Profile 👤</h1>
        <p>View and manage your personal account details.</p>
      </section>

      <section className="profile-content">
        <div className="profile-form-box">

          <div className="profile-avatar">👤</div>

          <h2>Personal Information</h2>
          <p>Update your profile details below.</p>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Mobile Number</label>
            <input
              type="tel"
              maxLength="10"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button type="submit">
              Update Profile
            </button>

          </form>
        </div>
      </section>

      <footer>
        <h2>♡ SafeHer</h2>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <p>© 2026 SafeHer. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default MyProfile