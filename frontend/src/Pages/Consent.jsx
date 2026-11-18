import { useState } from 'react'
import { ShieldCheck, ShieldX, Shield } from 'lucide-react'
import api from '../services/api'
import Button from '../components/Button'
import Alert from '../components/Alert'

function Consent() {
  const token = window.location.pathname.split('/')[2]
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleConsent(action) {
    if (!token) {
      setMessage('Invalid consent link.')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      if (action === 'accept') {
        await api.post(`/contacts/consent/${token}/accept`)
        setMessage('Thank you! You have accepted the consent request.')
      } else {
        await api.post(`/contacts/consent/${token}/opt-out`)
        setMessage('You have declined the consent request.')
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Unable to process your request. The link may be invalid or expired.'
      )
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-blush/50 to-cream px-5 py-10 font-sans text-ink antialiased">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink text-cream"><Shield size={28} /></span>
        <h1 className="mt-5 font-display text-2xl font-extrabold">Trusted contact request</h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Someone has added you as a trusted emergency contact on SafeHer.
          Do you agree to receive their emergency alerts and safety notifications?
        </p>

        <div className="mt-6 text-left">
          <Alert type="success">{message}</Alert>
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <Button onClick={() => handleConsent('accept')} disabled={loading}>
            <ShieldCheck size={18} /> {loading ? 'Please wait…' : 'Yes, I agree'}
          </Button>
          <Button variant="secondary" onClick={() => handleConsent('decline')} disabled={loading}>
            <ShieldX size={18} /> No, decline
          </Button>
        </div>

        <p className="mt-6 text-xs text-ink-faint">You can change your mind later by asking the person who added you.</p>
      </div>
    </div>
  )
}

export default Consent
