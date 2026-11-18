import { useState } from 'react'
import api from '../services/api'
import { Phone, Lock } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import Alert from '../components/Alert'
import Button from '../components/Button'

function Login() {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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

      const response = await api.post('/users/login', formData)

      // Save login tokens
      sessionStorage.setItem('safeherAccessToken', response.data.accessToken)
      sessionStorage.setItem('safeherRefreshToken', response.data.refreshToken)
      sessionStorage.setItem('safeherUserId', response.data.userId)
      sessionStorage.setItem('safeherUserName', response.data.name)

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
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your SafeHer account."
      footer={<>New to SafeHer? <a href="/register" className="font-semibold text-ink underline">Create an account</a></>}
    >
      <form onSubmit={handleLogin} noValidate>
        <Field
          label="Phone number" icon={Phone} type="tel" name="phoneNumber"
          placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel"
          value={formData.phoneNumber} onChange={handleChange} maxLength="10" required
        />
        <Field
          label="Password" icon={Lock} type="password" toggle name="password"
          placeholder="Your password" autoComplete="current-password"
          value={formData.password} onChange={handleChange} required
        />
        <div className="-mt-1 mb-5 text-right text-sm">
          <a href="/forgot-password" className="font-semibold text-ink-soft underline">Forgot password?</a>
        </div>

        <Alert>{error}</Alert>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Login
