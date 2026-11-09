
import { useState } from 'react'
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
  CheckCircle
} from 'lucide-react'
import '../App.css'

function TrustedContacts() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [relationship, setRelationship] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  function resetForm() {
    setName('')
    setMobile('')
    setRelationship('')
    setEditIndex(null)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !mobile.trim() || !relationship) {
      alert('Please fill all the fields')
      return
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    const newContact = {
      name: name.trim(),
      mobile,
      relationship
    }

    if (editIndex !== null) {
      const updatedContacts = [...contacts]
      updatedContacts[editIndex] = newContact
      setContacts(updatedContacts)
    } else {
      setContacts([...contacts, newContact])
    }

    resetForm()
  }

  function editContact(index) {
    setName(contacts[index].name)
    setMobile(contacts[index].mobile)
    setRelationship(contacts[index].relationship)
    setEditIndex(index)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function deleteContact(index) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this contact?'
    )

    if (confirmDelete) {
      const updatedContacts = contacts.filter(
        (contact, i) => i !== index
      )

      setContacts(updatedContacts)

      if (editIndex === index) {
        resetForm()
      } else if (editIndex !== null && editIndex > index) {
        setEditIndex(editIndex - 1)
      }
    }
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
            onClick={() => {
              sessionStorage.removeItem('safeherAccessToken')
              sessionStorage.removeItem('safeherRefreshToken')
              sessionStorage.removeItem('safeherUserId')
              sessionStorage.removeItem('safeherUserName')
              sessionStorage.removeItem('safeherPhoneNumber')
              window.location.href = '/login'
            }}
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
              {editIndex !== null
                ? <Pencil size={22} />
                : <UserPlus size={22} />
              }
            </div>

            <div>
              <h2>
                {editIndex !== null ? 'Update Contact' : 'Add New Contact'}
              </h2>
              <p>
                {editIndex !== null
                  ? 'Update your trusted contact details.'
                  : 'Add someone you can count on.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="tc-form">

            <div className="tc-form-group">
              <label htmlFor="contactName">Contact Name</label>
              <input
                id="contactName"
                type="text"
                placeholder="Enter full name"
                value={name}
                maxLength="100"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="tc-form-group">
              <label htmlFor="contactMobile">Mobile Number</label>
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
                />
              </div>
            </div>

            <div className="tc-form-group">
              <label htmlFor="contactRelationship">Relationship</label>
              <select
                id="contactRelationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
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
              <button type="submit" className="tc-submit-btn">
                {editIndex !== null ? <CheckCircle size={18} /> : <UserPlus size={18} />}
                {editIndex !== null ? 'Update Contact' : 'Add Contact'}
              </button>

              {editIndex !== null && (
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

          {contacts.length === 0 ? (
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
              {contacts.map((contact, index) => (
                <div className="tc-contact-card" key={index}>

                  <div className="tc-contact-top">
                    <div className="tc-contact-avatar">
                      <UserRound size={27} />
                    </div>

                    <span className="tc-contact-badge">
                      {contact.relationship}
                    </span>
                  </div>

                  <h3>{contact.name}</h3>

                  <div className="tc-contact-mobile">
                    <Phone size={16} />
                    <span>{contact.mobile}</span>
                  </div>

                  <div className="tc-contact-divider"></div>

                  <div className="tc-contact-actions">
                    <button
                      type="button"
                      className="tc-edit-btn"
                      onClick={() => editContact(index)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="tc-delete-btn"
                      onClick={() => deleteContact(index)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>

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
