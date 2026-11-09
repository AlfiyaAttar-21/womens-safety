
import { useState } from 'react'
import api from '../services/api'
import {
  ShieldCheck,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react'

function Login() {

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!/^[6-9][0-9]{9}$/.test(formData.phoneNumber)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    if (!formData.password) {
      setError('Please enter your password.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/users/login',
        formData
      )

      // Save login tokens
      sessionStorage.setItem(
        'safeherAccessToken',
        response.data.accessToken
      )

      sessionStorage.setItem(
        'safeherRefreshToken',
        response.data.refreshToken
      )

      sessionStorage.setItem(
        'safeherUserId',
        response.data.userId
      )

      sessionStorage.setItem(
        'safeherUserName',
        response.data.name
      )

      window.location.href = '/dashboard'

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your phone number and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">

      <div className="login-circle circle-one"></div>
      <div className="login-circle circle-two"></div>

      <div className="login-box">

        <div className="login-logo">
          <ShieldCheck size={42} />
        </div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to your SafeHer account
        </p>

        <form onSubmit={handleLogin}>

          <label>Phone Number</label>

          <div className="login-input-box">
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

          <label>Password</label>

          <div className="login-input-box">
            <Lock size={19} />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          {error && (
            <p style={{ color: '#c93c37', fontSize: '14px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Account'}
            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
          <a href="/register"> Sign Up</a>
        </p>

        <div className="login-security">
          <ShieldCheck size={17} />
          Your safety and privacy matter to us.
        </div>

      </div>

    </div>
  )
}

export default Login
