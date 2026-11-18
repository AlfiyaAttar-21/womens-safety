import { useEffect, useState } from 'react'
import {
  Users, UserPlus, Phone, Pencil, Trash2, X, UserRound,
  CheckCircle, Mail, RefreshCw, ShieldCheck,
} from 'lucide-react'
import api from '../services/api'
import AppShell from '../components/AppShell'
import Field from '../components/Field'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { SelectField, PageTitle } from '../components/FormBits'

function TrustedContacts() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [relationship, setRelationship] = useState('')
  const [editContactId, setEditContactId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load contacts from backend
  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      setLoading(true)

      const response = await api.get('/contacts')
      setContacts(response.data)
    } catch (error) {
      console.error('Contact loading error:', error)
      alert(
        error.response?.data?.message ||
        'Unable to load contacts. Please login again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setName('')
    setMobile('')
    setEmail('')
    setRelationship('')
    setEditContactId(null)
  }

  // Add or update contact
  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !mobile.trim() || !relationship) {
      alert('Please fill all required fields')
      return
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    if (email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    const contactData = {
      name: name.trim(),
      phone: mobile,
      email: email.trim() || null,
      relationship: relationship
    }

    try {
      setSaving(true)

      if (editContactId !== null) {
        await api.put(`/contacts/${editContactId}`, contactData)
        alert('Contact updated successfully')
      } else {
        await api.post('/contacts', contactData)
        alert('Contact added successfully')
      }

      resetForm()
      await fetchContacts()

    } catch (error) {
      console.error('Contact save error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to save contact. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Edit contact
  function editContact(contact) {
    setName(contact.name)
    setMobile(contact.phone)
    setEmail(contact.email || '')
    setRelationship(contact.relationship || '')
    setEditContactId(contact.id)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Delete contact
  async function deleteContact(contact) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this contact?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/contacts/${contact.id}`)

      if (editContactId === contact.id) {
        resetForm()
      }

      alert('Contact deleted successfully')
      await fetchContacts()

    } catch (error) {
      console.error('Contact delete error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to delete contact'
      )
    }
  }

  // Resend consent
  async function resendConsent(contact) {
    try {
      await api.post(`/contacts/${contact.id}/resend-consent`)

      alert('Consent request sent again')
      await fetchContacts()

    } catch (error) {
      console.error('Consent error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to resend consent'
      )
    }
  }

  function logout() {
    sessionStorage.removeItem('safeherAccessToken')
    sessionStorage.removeItem('safeherRefreshToken')
    sessionStorage.removeItem('safeherUserId')
    sessionStorage.removeItem('safeherUserName')
    sessionStorage.removeItem('safeherPhoneNumber')

    window.location.href = '/login'
  }

const consentTone = (status) =>
    status === 'PENDING' ? 'pending' : /ACCEPT|CONFIRM|GRANT/i.test(status || '') ? 'safe' : 'neutral'

  return (
    <AppShell active="contacts" onLogout={logout}>
      <PageTitle
        title="Trusted contacts"
        subtitle="The people who are alerted when you need help. Each one has to agree first."
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-4 py-2 text-sm font-semibold">
          <Users size={17} /> {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
        </span>
      </PageTitle>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Form */}
        <Card className="h-fit">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            {editContactId !== null ? <Pencil size={20} /> : <UserPlus size={20} />}
            {editContactId !== null ? 'Update contact' : 'Add a contact'}
          </h2>
          <p className="mb-6 mt-1 text-sm text-ink-soft">
            {editContactId !== null ? 'Change the details below.' : 'We’ll send them a request to confirm.'}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Name" icon={UserRound} placeholder="Full name" value={name} maxLength="100"
              onChange={(e) => setName(e.target.value)} required />
            <Field label="Mobile number" icon={Phone} type="tel" inputMode="numeric" placeholder="10-digit number"
              value={mobile} maxLength="10" onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} required />
            <Field label="Email (optional)" icon={Mail} type="email" placeholder="name@example.com"
              value={email} maxLength="150" onChange={(e) => setEmail(e.target.value)} />
            <SelectField label="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} required>
              <option value="">Select relationship</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Relative">Relative</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </SelectField>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                {editContactId !== null ? <CheckCircle size={17} /> : <UserPlus size={17} />}
                {saving ? 'Please wait…' : editContactId !== null ? 'Update contact' : 'Add contact'}
              </Button>
              {editContactId !== null && (
                <Button type="button" variant="secondary" onClick={resetForm}><X size={17} /> Cancel</Button>
              )}
            </div>
          </form>
        </Card>

        {/* List */}
        <section aria-label="Saved contacts">
          {loading ? (
            <div className="space-y-4" aria-busy="true">
              {[1, 2].map((n) => <div key={n} className="h-36 animate-pulse rounded-3xl bg-ink/5" />)}
            </div>
          ) : contacts.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-ink/15 p-10 text-center">
              <Users className="mx-auto text-ink-faint" size={40} />
              <h3 className="mt-4 font-display text-xl font-bold">No contacts yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-ink-soft">Add a family member or friend. They will get a request to confirm.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((contact) => (
                <Card key={contact.id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-lilac font-display text-lg font-bold">
                      {(contact.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <Badge>{contact.relationship || 'Other'}</Badge>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold">{contact.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft"><Phone size={15} /> {contact.phone}</p>
                  {contact.email && (
                    <p className="mt-1 flex items-center gap-2 break-all text-sm text-ink-soft"><Mail size={15} /> {contact.email}</p>
                  )}

                  <div className="mt-4">
                    <Badge tone={consentTone(contact.consentStatus)}>
                      <span className="capitalize">{String(contact.consentStatus || 'unknown').toLowerCase()}</span>
                    </Badge>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                    <button type="button" onClick={() => editContact(contact)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-ink/15 hover:bg-lilac">
                      <Pencil size={15} /> Edit
                    </button>
                    <button type="button" onClick={() => deleteContact(contact)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-sos ring-1 ring-sos/30 hover:bg-[#FBDDE2]">
                      <Trash2 size={15} /> Delete
                    </button>
                    {contact.consentStatus === 'PENDING' && (
                      <button type="button" onClick={() => resendConsent(contact)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-cream hover:bg-ink-soft">
                        <RefreshCw size={15} /> Resend request
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-lilac/60 p-4 text-sm text-ink-soft">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ink" />
            Tell your contacts you’ve added them, so they know what to do if they get an alert.
          </p>
        </section>
      </div>
    </AppShell>
  )
}

export default TrustedContacts
