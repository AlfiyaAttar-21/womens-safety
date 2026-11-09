
import { useState } from 'react'
import api from '../services/api'
import { ShieldCheck, Phone, KeyRound, ArrowRight } from 'lucide-react'

function VerifyOTP() {
  const [phoneNumber, setPhoneNumber] = useState(
    sessionStorage.getItem('safeherPhoneNumber') || ''
  )

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!/^[6-9][0-9]{9}$/.test(phoneNumber)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    try {
      setLoading(true)

      const response = await api.post(
        '/users/verify-otp',
        {
          phoneNumber: phoneNumber,
          otp: otp
        }
      )

      setMessage(response.data.message || 'Phone verified successfully!')

      sessionStorage.removeItem('safeherPhoneNumber')

      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'OTP verification failed. Please check your OTP.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setMessage('')
    setError('')

    try {
      setLoading(true)

      const response = await api.post(
        '/users/resend-otp',
        { phoneNumber }
      )

      setMessage(response.data.message || 'OTP sent successfully.')

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to resend OTP. Please try again.'
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

        <h1>Verify Your Phone</h1>

        <p className="register-subtitle">
          Enter the 6-digit OTP sent to your mobile number
        </p>

        <form onSubmit={handleVerify}>

          <label>Phone Number</label>

          <div className="register-input-box">
            <Phone size={19} />

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength="10"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <label>Enter OTP</label>

          <div className="register-input-box">
            <KeyRound size={19} />

            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>

          {error && (
            <p style={{ color: '#c93c37', fontSize: '14px' }}>
              {error}
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
            {loading ? 'Verifying...' : 'Verify OTP'}
            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        <p className="register-login-text">
          Didn't receive OTP?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleResendOTP()
            }}
          >
            Resend OTP
          </a>
        </p>

        <div className="register-security">
          <ShieldCheck size={17} />
          Your safety and privacy matter to us.
        </div>

      </div>
    </div>
  )
}

export default VerifyOTP
