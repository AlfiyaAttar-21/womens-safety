import { useState } from 'react'
import '../App.css'

function TrustedContacts() {

const [contacts, setContacts] = useState([])
const [name, setName] = useState('')
const [mobile, setMobile] = useState('')
const [relationship, setRelationship] = useState('')
const [editIndex, setEditIndex] = useState(null)

function handleSubmit(e) {
e.preventDefault()

if (!name.trim() || !mobile.trim() || !relationship) {
  alert('Please fill all the fields')
  return
}

if (!/^[0-9]{10}$/.test(mobile)) {
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
  setEditIndex(null)
} else {
  setContacts([...contacts, newContact])
}

setName('')
setMobile('')
setRelationship('')

}

function editContact(index) {
setName(contacts[index].name)
setMobile(contacts[index].mobile)
setRelationship(contacts[index].relationship)
setEditIndex(index)
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
  setEditIndex(null)
  setName('')
  setMobile('')
  setRelationship('')
}

}

return (
<div className="trusted-page">

  <nav className="navbar">
    <div className="logo">
      <span>♡</span> SafeHer
    </div>

    <div className="nav-links">
      <a href="/dashboard">Dashboard</a>
    </div>

    <button
      className="login-btn"
      onClick={() => window.location.href = '/'}
    >
      Logout
    </button>
  </nav>

  <section className="trusted-header">
    <h1>Trusted Contacts 💜</h1>
    <p>
      Add people you trust. They can be your emergency support.
    </p>
  </section>

  <section className="contact-form-section">

    <div className="contact-form-box">

      <h2>
        {editIndex !== null ? 'Update Contact' : 'Add New Contact'}
      </h2>

      <form onSubmit={handleSubmit}>

        <label>Contact Name</label>
        <input
          type="text"
          placeholder="Enter contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Mobile Number</label>
        <input
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={mobile}
          maxLength="10"
          onChange={(e) => setMobile(e.target.value)}
        />

        <label>Relationship</label>
        <select
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

        <button type="submit" className="contact-submit-btn">
          {editIndex !== null ? 'Update Contact' : 'Add Contact'}
        </button>

      </form>

    </div>

  </section>

  <section className="saved-contacts">

    <h2>My Saved Contacts</h2>

    <p className="contact-count">
      Total Contacts: {contacts.length}
    </p>

    {contacts.length === 0 ? (

      <div className="empty-contacts">
        <span>👥</span>
        <h3>No Contacts Added Yet</h3>
        <p>Add your trusted people for emergency support.</p>
      </div>

    ) : (

      <div className="contacts-grid">

        {contacts.map((contact, index) => (

          <div className="contact-card" key={index}>

            <div className="contact-avatar">👤</div>

            <h3>{contact.name}</h3>

            <p>📞 {contact.mobile}</p>

            <span className="relationship-tag">
              {contact.relationship}
            </span>

            <div className="contact-actions">

              <button
                className="edit-btn"
                onClick={() => editContact(index)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteContact(index)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </section>

  <footer>
    <h2>♡ SafeHer</h2>
    <p>Stay Safe. Stay Strong. Stay Confident.</p>
    <p>© 2026 SafeHer. All rights reserved.</p>
  </footer>

</div>

)
}

export default TrustedContacts