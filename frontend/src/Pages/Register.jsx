import { useState } from 'react'
import api from '../services/api'
import {
  ShieldCheck,
  UserRound,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showNormalPin, setShowNormalPin] = useState(false)
  const [showDuressPin, setShowDuressPin] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    normalPin: '',
    duressPin: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!/^[6-9][0-9]{9}$/.test(formData.phoneNumber)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Enter a valid email address.')
      return
    }

    if (formData.password.length < 8 || formData.password.length > 64) {
      setError('Password must be 8 to 64 characters.')
      return
    }

    if (!/^[0-9]{4,6}$/.test(formData.normalPin)) {
      setError('Normal PIN must contain 4 to 6 digits.')
      return
    }

    if (!/^[0-9]{4,6}$/.test(formData.duressPin)) {
      setError('Duress PIN must contain 4 to 6 digits.')
      return
    }

    if (formData.normalPin === formData.duressPin) {
      setError('Normal PIN and Duress PIN must be different.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/users/register',
        {
          ...formData,
          email: formData.email.trim().toLowerCase()
        }
      )

      setMessage(
        response.data.message || 'Registration successful. Please verify OTP.'
      )

      sessionStorage.setItem('safeherPhoneNumber', formData.phoneNumber)

      setTimeout(() => {
        window.location.href = '/verify-otp'
      }, 1500)

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-circle register-circle-one"></div>
      <div className="register-circle register-circle-two"></div>

      <div className="register-box">

        <div className="register-logo">
          <ShieldCheck size={42} />
        </div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join SafeHer and take a step towards safety
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <div className="register-input-box">
            <UserRound size={19} />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              maxLength="100"
              required
            />
          </div>

          <label>Phone Number</label>
          <div className="register-input-box">
            <Phone size={19} />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter 10-digit mobile number"
              value={formData.phoneNumber}
              onChange={handleChange}
              maxLength="10"
              required
            />
          </div>

          <label>Email</label>
          <div className="register-input-box">
            <Mail size={19} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email (OTP will be sent here)"
              value={formData.email}
              onChange={handleChange}
              maxLength="150"
              required
            />
          </div>

          <label>Password</label>
          <div className="register-input-box">
            <Lock size={19} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              maxLength="64"
              required
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label>Normal PIN</label>
          <div className="register-input-box">
            <Lock size={19} />
            <input
              type={showNormalPin ? 'text' : 'password'}
              name="normalPin"
              placeholder="Create 4 to 6 digit PIN"
              value={formData.normalPin}
              onChange={handleChange}
              maxLength="6"
              inputMode="numeric"
              required
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowNormalPin(!showNormalPin)}
            >
              {showNormalPin ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label>Duress PIN</label>
          <div className="register-input-box">
            <Lock size={19} />
            <input
              type={showDuressPin ? 'text' : 'password'}
              name="duressPin"
              placeholder="Create a secret emergency PIN"
              value={formData.duressPin}
              onChange={handleChange}
              maxLength="6"
              inputMode="numeric"
              required
            />
            <button
              type="button"
              className="register-password-toggle"
              onClick={() => setShowDuressPin(!showDuressPin)}
            >
              {showDuressPin ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <p className="register-pin-info">
            Keep your Duress PIN secret. It is used for emergency situations.
          </p>

          <div className="register-terms">
            <input type="checkbox" required />
            <span>I agree to the Terms and Privacy Policy.</span>
          </div>

          {error && (
            <p style={{ color: '#c93c37', fontSize: '14px' }}>
              {typeof error === 'string' ? error : 'Please check your entered details.'}
            </p>
          )}

          {message && (
            <p style={{ color: '#6b7a3a', fontSize: '14px' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="register-submit-btn"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Create Account'}
            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        <p className="register-login-text">
          Already have an account? <a href="/login">Login</a>
        </p>

        <div className="register-security">
          <ShieldCheck size={17} />
          Your safety and privacy matter to us.
        </div>

      </div>
    </div>
  )
}

export default Register