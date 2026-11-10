
import { useState } from 'react'
import api from '../services/api'
import {
  ShieldCheck,
  Phone,
  Lock,
  ArrowLeft
} from 'lucide-react'

function ForgotPassword() {

  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSendOtp = async () => {

    setError('')
    setMessage('')

    if (!/^[6-9][0-9]{9}$/.test(phoneNumber)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/users/forgot-password',
        { phoneNumber }
      )

      setOtpSent(true)

      setMessage(
        response.data.message ||
        'If your verified account exists, an OTP has been sent.'
      )

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to process request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {

    e.preventDefault()

    setError('')
    setMessage('')

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/users/reset-password',
        {
          phoneNumber,
          otp,
          newPassword,
          confirmPassword
        }
      )

      setMessage(
        response.data.message ||
        'Password reset successful.'
      )

      setOtpSent(false)
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Password reset failed. Please try again.'
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

        <h1>Forgot Password?</h1>

        <p className="login-subtitle">
          Reset your SafeHer account password
        </p>

        {!otpSent && (

          <div>

            <label>Phone Number</label>

            <div className="login-input-box">
              <Phone size={19} />

              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength="10"
              />
            </div>

            <button
              type="button"
              className="login-submit-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

          </div>
        )}

        {otpSent && (

          <form onSubmit={handleResetPassword}>

            <label>Phone Number</label>

            <div className="login-input-box">
              <Phone size={19} />

              <input
                type="tel"
                value={phoneNumber}
                readOnly
              />
            </div>

            <label>Enter OTP</label>

            <div className="login-input-box">
              <Lock size={19} />

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
            </div>

            <label>New Password</label>

            <div className="login-input-box">
              <Lock size={19} />

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <label>Confirm Password</label>

            <div className="login-input-box">
              <Lock size={19} />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

          </form>
        )}

        {error && (
          <p style={{ color: '#c93c37', fontSize: '14px' }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ color: '#23834a', fontSize: '14px' }}>
            {message}
          </p>
        )}

        <p className="register-text">
          <a href="/login">
            <ArrowLeft size={15} /> Back to Login
          </a>
        </p>

        <div className="login-security">
          <ShieldCheck size={17} />
          Your safety and privacy matter to us.
        </div>

      </div>

    </div>
  )
}

export default ForgotPassword
