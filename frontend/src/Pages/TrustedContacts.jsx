import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Users,
  UserPlus,
  Phone,
  Pencil,
  Trash2,
  Heart,
  X,
  UserRound,
  CheckCircle,
  Mail,
  RefreshCw
} from 'lucide-react'

import api from '../services/api'
import AppShell from '../components/AppShell'

function TrustedContacts() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [relationship, setRelationship] = useState('')
  const [editContactId, setEditContactId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
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
        await api.put('/contacts/' + editContactId, contactData)
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

  async function deleteContact(contact) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this contact?'
    )

    if (!confirmDelete) return

    try {
      await api.delete('/contacts/' + contact.id)

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

  async function resendConsent(contact) {
    try {
      await api.post(
        '/contacts/' + contact.id + '/resend-consent'
      )

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

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#d9cfb0] bg-[#faf8f2] text-[#2c2a1e] placeholder:text-[#99917b] outline-none focus:ring-2 focus:ring-[#8d9d4f] focus:border-[#8d9d4f] transition"

  const iconInputClass =
    "w-full pl-11 pr-4 py-3 rounded-xl border border-[#d9cfb0] bg-[#faf8f2] text-[#2c2a1e] placeholder:text-[#99917b] outline-none focus:ring-2 focus:ring-[#8d9d4f] focus:border-[#8d9d4f] transition"

  return (
    <AppShell active="contacts" wide>

      {/* HERO */}
      <section className="max-w-7xl mx-auto pt-2">
        <div className="bg-gradient-to-r from-[#6b7a3a] to-[#8d9d4f] rounded-2xl p-7 md:p-10 text-white relative overflow-hidden">

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-[#f0ead6] text-sm font-semibold mb-4">
              <Heart size={17} />
              YOUR SAFETY CIRCLE
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted Contacts
            </h1>

            <p className="text-[#f5f0e0] text-base md:text-lg leading-relaxed">
              Your safety starts with people you trust.
              Add your loved ones who can support you during an emergency.
            </p>

            <div className="flex items-center gap-2 mt-6 text-sm text-[#f0ead6]">
              <ShieldCheck size={19} />
              <span>Your trusted people, always close to you.</span>
            </div>
          </div>

          <div className="hidden md:flex absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/10 items-center justify-center">
            <Users size={85} className="text-white/50" strokeWidth={1.3} />
            <Heart size={28} className="absolute bottom-9 right-9 text-white" />
          </div>

          <ShieldCheck
            size={190}
            className="absolute -right-5 -bottom-10 text-white opacity-[0.07]"
          />
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto py-9">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

          {/* CONTACT FORM */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#d9cfb0] shadow-sm p-6 md:p-7">

              <div className="flex items-center gap-4 mb-7">
                <div className="bg-[#f0ead6] text-[#6b7a3a] p-3 rounded-xl">
                  {editContactId !== null
                    ? <Pencil size={24} />
                    : <UserPlus size={24} />
                  }
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#2c2a1e]">
                    {editContactId !== null
                      ? 'Update Contact'
                      : 'Add New Contact'}
                  </h2>

                  <p className="text-sm text-[#6b6550] mt-1">
                    {editContactId !== null
                      ? 'Update your trusted contact details.'
                      : 'Add someone you can count on.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label htmlFor="contactName" className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                    Contact Name *
                  </label>

                  <input
                    id="contactName"
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    maxLength="100"
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactMobile" className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                    Mobile Number *
                  </label>

                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d9d4f]" />

                    <input
                      id="contactMobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      maxLength="10"
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      className={iconInputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                    Email (Optional)
                  </label>

                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d9d4f]" />

                    <input
                      id="contactEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength="150"
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactRelationship" className="block text-sm font-semibold text-[#2c2a1e] mb-2">
                    Relationship *
                  </label>

                  <select
                    id="contactRelationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className={inputClass}
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

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex justify-center items-center gap-2 bg-[#6b7a3a] hover:bg-[#52612b] disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl transition"
                  >
                    {editContactId !== null
                      ? <CheckCircle size={19} />
                      : <UserPlus size={19} />
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
                      onClick={resetForm}
                      className="flex justify-center items-center gap-2 bg-[#f0ead6] hover:bg-[#e7dbbf] text-[#6b6550] font-semibold px-5 py-3 rounded-xl transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* CONTACT LIST */}
          <section className="lg:col-span-3">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-[#2c2a1e]">
                  My Safety Circle
                </h2>

                <p className="text-sm text-[#6b6550] mt-1">
                  People who are there for you when you need them.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#e7dbbf] text-[#6b7a3a] px-4 py-2.5 rounded-xl font-semibold text-sm w-fit">
                <Users size={19} />
                {contacts.length} Contacts
              </div>
            </div>

            {loading ? (
              <div className="bg-white border border-[#d9cfb0] rounded-2xl p-12 text-center">
                <RefreshCw size={32} className="text-[#8d9d4f] animate-spin mx-auto mb-4" />
                <p className="text-[#6b6550] font-medium">
                  Loading your trusted contacts...
                </p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="bg-white border border-[#d9cfb0] rounded-2xl p-8 md:p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-[#f0ead6] text-[#8d9d4f] rounded-2xl flex items-center justify-center mb-5">
                  <Users size={40} />
                </div>

                <h3 className="text-xl font-bold text-[#2c2a1e] mb-2">
                  Your safety circle is waiting!
                </h3>

                <p className="text-sm text-[#6b6550] max-w-sm mx-auto leading-relaxed">
                  You haven't added any trusted contacts yet.
                  Add your family or friends to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contacts.map((contact) => (
                  <div
                    className="bg-white border border-[#d9cfb0] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    key={contact.id}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#f0ead6] text-[#6b7a3a] flex items-center justify-center">
                        <UserRound size={29} />
                      </div>

                      <span className="bg-[#e7dbbf] text-[#6b7a3a] px-3 py-1.5 rounded-full text-xs font-bold">
                        {contact.relationship || 'Other'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2c2a1e] mb-3">
                      {contact.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-[#6b6550]">
                        <Phone size={17} className="text-[#8d9d4f] shrink-0" />
                        <span>{contact.phone}</span>
                      </div>

                      {contact.email && (
                        <div className="flex items-center gap-3 text-sm text-[#6b6550]">
                          <Mail size={17} className="text-[#8d9d4f] shrink-0" />
                          <span className="break-all">{contact.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <span className="text-xs font-semibold text-[#6b6550]">
                        Consent Status:
                      </span>

                      <span className={`ml-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        contact.consentStatus === 'ACCEPTED'
                          ? 'bg-green-100 text-green-700'
                          : contact.consentStatus === 'PENDING'
                            ? 'bg-[#f0ead6] text-[#8a7135]'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {contact.consentStatus || 'UNKNOWN'}
                      </span>
                    </div>

                    <div className="border-t border-[#e7dbbf] my-5"></div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => editContact(contact)}
                        className="flex-1 flex justify-center items-center gap-2 bg-[#f0ead6] hover:bg-[#e7dbbf] text-[#6b7a3a] font-semibold py-2.5 rounded-xl transition text-sm"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteContact(contact)}
                        className="flex-1 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>

                    {contact.consentStatus === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => resendConsent(contact)}
                        className="w-full mt-3 flex justify-center items-center gap-2 bg-[#6b7a3a] hover:bg-[#52612b] text-white font-semibold py-2.5 rounded-xl transition text-sm"
                      >
                        <RefreshCw size={16} />
                        Resend Consent
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SAFETY REMINDER */}
        <section className="mt-8 bg-[#e7dbbf] border border-[#d9cfb0] rounded-2xl p-5 md:p-6 flex items-start gap-4">
          <div className="bg-[#f5f0e0] text-[#6b7a3a] p-3 rounded-xl shrink-0">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h3 className="font-bold text-[#2c2a1e] mb-1">
              A little reminder
            </h3>

            <p className="text-sm text-[#6b6550] leading-relaxed">
              Make sure your trusted contacts know that you have added them
              to your safety circle.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#6b7a3a] mt-8 px-5 py-7 text-center">
        <div className="flex justify-center items-center gap-2 text-white font-bold text-xl mb-2">
          <ShieldCheck size={22} />
          SafeHer
        </div>

        <p className="text-[#f0ead6] text-sm mb-2">
          Stay Safe. Stay Strong. Stay Confident.
        </p>

        <span className="text-[#d9cfb0] text-xs">
          © 2026 SafeHer. All rights reserved.
        </span>
      </footer>

    </AppShell>
  )
}

export default TrustedContacts