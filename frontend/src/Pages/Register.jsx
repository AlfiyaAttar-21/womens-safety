import { useState } from 'react'
import api from '../services/api'
import { UserRound, Phone, Mail, Lock, KeyRound, ShieldAlert } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import Alert from '../components/Alert'
import Button from '../components/Button'

function Register() {
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
    setFormData({ ...formData, [name]: value })
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

      const response = await api.post('/users/register', {
        ...formData,
        email: formData.email.trim().toLowerCase()
      })

      setMessage(response.data.message || 'Registration successful. Please verify OTP.')

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

  // strength hint is display-only
  const pw = formData.password
  const strength = pw.length === 0 ? 0 : [pw.length >= 8, /[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['bg-ink/10', 'bg-sos', 'bg-[#E8A317]', 'bg-safe', 'bg-safe'][strength]

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. You can add trusted contacts next."
      footer={<>Already have an account? <a href="/login" className="font-semibold text-ink underline">Log in</a></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" icon={UserRound} name="name" placeholder="Your full name" autoComplete="name"
          value={formData.name} onChange={handleChange} maxLength="100" required />
        <Field label="Phone number" icon={Phone} type="tel" name="phoneNumber" placeholder="10-digit mobile number"
          inputMode="numeric" autoComplete="tel" value={formData.phoneNumber} onChange={handleChange} maxLength="10" required />
        <Field label="Email" icon={Mail} type="email" name="email" placeholder="you@example.com (backup for OTP)"
          autoComplete="email" value={formData.email} onChange={handleChange} maxLength="150" required />

        <Field label="Password" icon={Lock} type="password" toggle name="password" placeholder="8 to 64 characters"
          autoComplete="new-password" value={formData.password} onChange={handleChange} minLength="8" maxLength="64" required className="!mb-2" />
        <div className="mb-5 flex items-center gap-3" aria-live="polite">
          <div className="flex h-1.5 flex-1 gap-1">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`h-full flex-1 rounded-full ${n <= strength ? strengthColor : 'bg-ink/10'}`} />
            ))}
          </div>
          <span className="w-12 text-xs font-semibold text-ink-soft">{strengthLabel}</span>
        </div>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Normal PIN" icon={KeyRound} type="password" toggle name="normalPin" placeholder="4 to 6 digits"
            inputMode="numeric" value={formData.normalPin} onChange={handleChange} maxLength="6" required />
          <Field label="Duress PIN" icon={ShieldAlert} type="password" toggle name="duressPin" placeholder="Secret emergency PIN"
            inputMode="numeric" value={formData.duressPin} onChange={handleChange} maxLength="6" required />
        </div>
        <p className="-mt-1 mb-5 text-sm text-ink-soft">
          Keep your duress PIN secret. If you’re forced to unlock the app, entering it quietly raises the alarm.
        </p>

        <label className="mb-5 flex items-start gap-3 text-sm">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#2A1B3D]" />
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>

        <Alert>{typeof error === 'string' ? error : error ? 'Please check your entered details.' : ''}</Alert>
        <Alert type="success">{message}</Alert>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Please wait…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Register
