import { useState } from 'react'
import api from '../services/api'
import { Phone, Lock, KeyRound, ArrowLeft } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import Alert from '../components/Alert'
import Button from '../components/Button'

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

      const response = await api.post('/users/forgot-password', { phoneNumber })

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

      const response = await api.post('/users/reset-password', {
        phoneNumber,
        otp,
        newPassword,
        confirmPassword
      })

      setMessage(response.data.message || 'Password reset successful.')

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
    <AuthLayout
      title="Reset your password"
      subtitle={otpSent ? 'Enter the code we sent and choose a new password.' : 'We’ll send a code to your registered phone number.'}
      footer={<a href="/login" className="inline-flex items-center gap-1 font-semibold text-ink underline"><ArrowLeft size={15} /> Back to log in</a>}
    >
      {!otpSent && (
        <div>
          <Field label="Phone number" icon={Phone} type="tel" placeholder="10-digit mobile number" inputMode="numeric"
            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength="10" />
          <Alert>{error}</Alert>
          <Alert type="success">{message}</Alert>
          <Button type="button" className="w-full" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending code…' : 'Send code'}
          </Button>
        </div>
      )}

      {otpSent && (
        <form onSubmit={handleResetPassword} noValidate>
          <Field label="Phone number" icon={Phone} type="tel" value={phoneNumber} readOnly />
          <Field label="Verification code" icon={KeyRound} placeholder="6-digit code" inputMode="numeric"
            autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
          <Field label="New password" icon={Lock} type="password" toggle placeholder="At least 8 characters"
            autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Field label="Confirm password" icon={Lock} type="password" toggle placeholder="Repeat new password"
            autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Alert>{error}</Alert>
          <Alert type="success">{message}</Alert>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting password…' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
