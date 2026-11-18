import { useState } from 'react'
import {
  ShieldCheck, UserRound, Mail, Phone, Pencil, Save, X,
  LockKeyhole, CheckCircle2,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import Field from '../components/Field'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import { PageTitle } from '../components/FormBits'

function MyProfile() {
  const savedName = sessionStorage.getItem('safeherUserName') || ''
  const savedMobile = sessionStorage.getItem('safeherPhoneNumber') || ''

  const [name, setName] = useState(savedName)
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState(savedMobile)
  const [editMode, setEditMode] = useState(false)
  const [success, setSuccess] = useState(false)

  const [originalData, setOriginalData] = useState({
    name: savedName,
    email: '',
    mobile: savedMobile
  })

  function handleEdit() {
    setOriginalData({ name, email, mobile })
    setEditMode(true)
    setSuccess(false)
  }

  function handleCancel() {
    setName(originalData.name)
    setEmail(originalData.email)
    setMobile(originalData.mobile)
    setEditMode(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      alert('Please fill all the fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    setOriginalData({ name, email, mobile })
    sessionStorage.setItem('safeherUserName', name)
    sessionStorage.setItem('safeherPhoneNumber', mobile)

    setEditMode(false)
    setSuccess(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('safeherAccessToken')
    sessionStorage.removeItem('safeherRefreshToken')
    sessionStorage.removeItem('safeherUserId')
    sessionStorage.removeItem('safeherUserName')
    sessionStorage.removeItem('safeherPhoneNumber')

    window.location.href = '/login'
  }

  const initial = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : 'U'

return (
    <AppShell active="profile" onLogout={handleLogout}>
      <PageTitle title="My profile" subtitle="Keep your account details up to date." />

      <Alert type="success">{success ? 'Profile details updated for this session.' : ''}</Alert>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink font-display text-4xl font-extrabold text-cream">
            {initial}
          </span>
          <h2 className="mt-4 font-display text-xl font-bold">{name || 'SafeHer User'}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-soft"><ShieldCheck size={15} /> SafeHer member</p>

          <ul className="mt-6 space-y-4 border-t border-ink/10 pt-5 text-left text-sm">
            <li className="flex gap-3">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" />
              <span><strong className="block">Protected account</strong><span className="text-ink-soft">You sign in with a password and one-time codes.</span></span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span><strong className="block">Keep details current</strong><span className="text-ink-soft">So your contacts can reach you.</span></span>
            </li>
          </ul>
        </Card>

        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Personal information</h2>
              <p className="text-sm text-ink-soft">{editMode ? 'Make your changes and save.' : 'Select edit to change your details.'}</p>
            </div>
            {!editMode && (
              <Button type="button" variant="secondary" onClick={handleEdit}>
                <Pencil size={16} /> Edit profile
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Full name" icon={UserRound} placeholder="Your full name" value={name}
              onChange={(e) => setName(e.target.value)} disabled={!editMode} maxLength={100} required />
            <Field label="Email address" icon={Mail} type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} disabled={!editMode} maxLength={100} required />
            <Field label="Mobile number" icon={Phone} type="tel" inputMode="numeric" placeholder="10-digit number" value={mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                if (value.length <= 10) {
                  setMobile(value)
                }
              }}
              disabled={!editMode} maxLength={10} required />

            {editMode && (
              <div className="flex flex-wrap gap-3">
                <Button type="submit"><Save size={17} /> Save changes</Button>
                <Button type="button" variant="secondary" onClick={handleCancel}><X size={17} /> Cancel</Button>
              </div>
            )}
          </form>
        </Card>
      </div>

      <p className="mt-6 flex items-start gap-3 rounded-2xl bg-lilac/60 p-4 text-sm text-ink-soft">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ink" />
        Never share your password, one-time codes or PINs with anyone, including people who say they are from SafeHer.
      </p>
    </AppShell>
  )
}

export default MyProfile
