
import { useState } from 'react'

import { ShieldCheck, ShieldX } from 'lucide-react'
import api from '../services/api'
import '../App.css'

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
    <div className="consent-page">
      <div className="consent-card">
        <ShieldCheck size={48} color="#8d9d4f" />

        <h1>SafeHer India</h1>
        <h2>Trusted Contact Consent</h2>

        <p>
          Someone has added you as a trusted emergency contact.
          Do you agree to receive emergency alerts and safety notifications?
        </p>

        {message && <p>{message}</p>}

        <button
          onClick={() => handleConsent('accept')}
          disabled={loading}
        >
          <ShieldCheck size={18} />
          {loading ? 'Please wait...' : 'Accept Consent'}
        </button>

        <button
          onClick={() => handleConsent('decline')}
          disabled={loading}
        >
          <ShieldX size={18} />
          Decline
        </button>
      </div>
    </div>
  )
}

export default Consent
