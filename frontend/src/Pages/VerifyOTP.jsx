import { useState, useRef } from 'react'
import api from '../services/api'
import { Phone } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import Alert from '../components/Alert'
import Button from '../components/Button'

function VerifyOTP() {
  const [phoneNumber, setPhoneNumber] = useState(
    sessionStorage.getItem('safeherPhoneNumber') || ''
  )

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const boxes = useRef([])

  // 6-box input UI; still writes the same `otp` string
  const setDigit = (i, value) => {
    const d = value.replace(/\D/g, '')
    if (!d) {
      setOtp(otp.slice(0, i) + otp.slice(i + 1))
      return
    }
    const next = (otp.slice(0, i) + d + otp.slice(i + 1)).slice(0, 6)
    setOtp(next)
    boxes.current[Math.min(i + d.length, 5)]?.focus()
  }

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) boxes.current[i - 1]?.focus()
  }

  const onPaste = (e) => {
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (d) {
      e.preventDefault()
      setOtp(d)
      boxes.current[Math.min(d.length, 5)]?.focus()
    }
  }

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

      const response = await api.post('/users/verify-otp', { phoneNumber: phoneNumber, otp: otp })

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

      const response = await api.post('/users/resend-otp', { phoneNumber })

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
    <AuthLayout
      title="Verify your phone"
      subtitle="Enter the 6-digit code we sent you."
      footer={
        <>
          Didn’t get a code?{' '}
          <button type="button" onClick={handleResendOTP} disabled={loading} className="font-semibold text-ink underline disabled:opacity-60">
            Resend code
          </button>
        </>
      }
    >
      <form onSubmit={handleVerify} noValidate>
        <Field label="Phone number" icon={Phone} type="tel" placeholder="10-digit mobile number" inputMode="numeric"
          value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength="10" required />

        <p className="mb-1.5 text-sm font-semibold" id="otp-label">Verification code</p>
        <div className="mb-6 flex justify-between gap-2" role="group" aria-labelledby="otp-label" onPaste={onPaste}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => (boxes.current[i] = el)}
              value={otp[i] || ''}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={6}
              aria-label={`Digit ${i + 1}`}
              className="h-14 w-full min-w-0 rounded-2xl bg-white text-center font-display text-2xl font-bold ring-1 ring-ink/15 focus:outline-none focus:ring-2 focus:ring-ink"
            />
          ))}
        </div>

        <Alert>{error}</Alert>
        <Alert type="success">{message}</Alert>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default VerifyOTP
