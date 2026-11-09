
import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Users,
  UserPlus,
  Phone,
  Pencil,
  Trash2,
  Heart,
  ArrowLeft,
  X,
  UserRound,
  CheckCircle,
  Mail,
  RefreshCw
} from 'lucide-react'
import '../App.css'
import api from '../services/api'

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

  return (
    <div className="tc-page">

      {/* Navbar */}
      <nav className="tc-navbar">

        <a href="/dashboard" className="tc-brand">
          <div className="tc-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="tc-nav-right">

          <a href="/dashboard" className="tc-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            className="tc-logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Page Header */}
      <section className="tc-hero">

        <div className="tc-hero-content">

          <div className="tc-small-label">
            <Heart size={15} />
            YOUR SAFETY CIRCLE
          </div>

          <h1>Trusted Contacts</h1>

          <p>
            Your safety starts with people you trust.
            Add your loved ones who can support you during an emergency.
          </p>

          <div className="tc-hero-note">
            <ShieldCheck size={18} />
            <span>Your trusted people, always close to you.</span>
          </div>

        </div>

        <div className="tc-hero-decoration">
          <div className="tc-hero-circle">
            <Users size={65} strokeWidth={1.4} />
            <Heart size={25} className="tc-heart-icon" />
          </div>
        </div>

      </section>

      {/* Main Content */}
      <main className="tc-main">

        {/* Form Section */}
        <section className="tc-form-card">

          <div className="tc-section-heading">

            <div className="tc-heading-icon">
              {editContactId !== null
                ? <Pencil size={22} />
                : <UserPlus size={22} />
              }
            </div>

            <div>
              <h2>
                {editContactId !== null
                  ? 'Update Contact'
                  : 'Add New Contact'}
              </h2>

              <p>
                {editContactId !== null
                  ? 'Update your trusted contact details.'
                  : 'Add someone you can count on.'}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="tc-form">

            <div className="tc-form-group">
              <label htmlFor="contactName">Contact Name *</label>

              <input
                id="contactName"
                type="text"
                placeholder="Enter full name"
                value={name}
                maxLength="100"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="tc-form-group">

              <label htmlFor="contactMobile">Mobile Number *</label>

              <div className="tc-input-with-icon">
                <Phone size={18} />

                <input
                  id="contactMobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  maxLength="10"
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  required
                />
              </div>

            </div>

            <div className="tc-form-group">

              <label htmlFor="contactEmail">Email (Optional)</label>

              <div className="tc-input-with-icon">
                <Mail size={18} />

                <input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength="150"
                />
              </div>

            </div>

            <div className="tc-form-group">

              <label htmlFor="contactRelationship">Relationship *</label>

              <select
                id="contactRelationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                required
              >
                <option value="">Select relationship</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Relative">Relative</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>

            </div>

            <div className="tc-form-buttons">

              <button
                type="submit"
                className="tc-submit-btn"
                disabled={saving}
              >
                {editContactId !== null
                  ? <CheckCircle size={18} />
                  : <UserPlus size={18} />
                }

                {saving
                  ? 'Please wait...'
                  : editContactId !== null
                    ? 'Update Contact'
                    : 'Add Contact'
                }
              </button>

              {editContactId !== null && (
                <button
                  type="button"
                  className="tc-cancel-btn"
                  onClick={resetForm}
                >
                  <X size={18} />
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* Saved Contacts */}
        <section className="tc-saved-section">

          <div className="tc-saved-heading">

            <div>
              <h2>My Safety Circle</h2>
              <p>People who are there for you when you need them.</p>
            </div>

            <div className="tc-total-count">
              <Users size={19} />
              <span>{contacts.length} Contacts</span>
            </div>

          </div>

          {loading ? (

            <div className="tc-empty-state">
              <p>Loading your trusted contacts...</p>
            </div>

          ) : contacts.length === 0 ? (

            <div className="tc-empty-state">

              <div className="tc-empty-icon">
                <Users size={42} />
              </div>

              <h3>Your safety circle is waiting!</h3>

              <p>
                You haven't added any trusted contacts yet.
                Add your family or friends to get started.
              </p>

            </div>

          ) : (

            <div className="tc-contacts-grid">

              {contacts.map((contact) => (

                <div className="tc-contact-card" key={contact.id}>

                  <div className="tc-contact-top">

                    <div className="tc-contact-avatar">
                      <UserRound size={27} />
                    </div>

                    <span className="tc-contact-badge">
                      {contact.relationship || 'Other'}
                    </span>

                  </div>

                  <h3>{contact.name}</h3>

                  <div className="tc-contact-mobile">
                    <Phone size={16} />
                    <span>{contact.phone}</span>
                  </div>

                  {contact.email && (
                    <div className="tc-contact-mobile">
                      <Mail size={16} />
                      <span>{contact.email}</span>
                    </div>
                  )}

                  <p style={{ fontSize: '13px', marginTop: '10px' }}>
                    Consent: {contact.consentStatus}
                  </p>

                  <div className="tc-contact-divider"></div>

                  <div className="tc-contact-actions">

                    <button
                      type="button"
                      className="tc-edit-btn"
                      onClick={() => editContact(contact)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="tc-delete-btn"
                      onClick={() => deleteContact(contact)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>

                  {contact.consentStatus === 'PENDING' && (

                    <button
                      type="button"
                      className="tc-edit-btn"
                      style={{ marginTop: '12px', width: '100%' }}
                      onClick={() => resendConsent(contact)}
                    >
                      <RefreshCw size={15} />
                      Resend Consent
                    </button>

                  )}

                </div>

              ))}

            </div>

          )}

        </section>

        {/* Safety Note */}
        <div className="tc-safety-note">

          <ShieldCheck size={23} />

          <div>
            <h3>A little reminder</h3>

            <p>
              Make sure your trusted contacts know that you have added them
              to your safety circle.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="tc-footer">

        <div className="tc-footer-brand">
          <ShieldCheck size={21} />
          <span>SafeHer</span>
        </div>

        <p>Stay Safe. Stay Strong. Stay Confident.</p>

        <span>© 2026 SafeHer. All rights reserved.</span>

      </footer>

    </div>
  )
}

export default TrustedContacts
