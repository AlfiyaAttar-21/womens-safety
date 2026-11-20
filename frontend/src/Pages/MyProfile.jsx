import { useState } from 'react'
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Heart
} from 'lucide-react'

import AppShell from '../components/AppShell'

function MyProfile() {
  const [profile, setProfile] = useState({
    name: sessionStorage.getItem('safeherUserName') || '',
    email: sessionStorage.getItem('safeherEmail') || '',
    mobile: sessionStorage.getItem('safeherPhoneNumber') || ''
  })

  const [originalProfile, setOriginalProfile] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    const { name, value } = e.target

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }))

    setSuccess('')
  }

  function handleEdit() {
    setOriginalProfile(profile)
    setIsEditing(true)
    setSuccess('')
  }

  function handleCancel() {
    setProfile(originalProfile)
    setIsEditing(false)
    setSuccess('')
  }

  function handleSave(e) {
    e.preventDefault()

    if (
      !profile.name.trim() ||
      !profile.email.trim() ||
      !profile.mobile.trim()
    ) {
      alert('Please fill all profile details.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      alert('Please enter a valid email address.')
      return
    }

    if (!/^[0-9]{10}$/.test(profile.mobile.trim())) {
      alert('Please enter a valid 10 digit mobile number.')
      return
    }

    const updatedProfile = {
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      mobile: profile.mobile.trim()
    }

    sessionStorage.setItem('safeherUserName', updatedProfile.name)
    sessionStorage.setItem('safeherEmail', updatedProfile.email)
    sessionStorage.setItem('safeherPhoneNumber', updatedProfile.mobile)

    setProfile(updatedProfile)
    setOriginalProfile(updatedProfile)

    setIsEditing(false)
    setSuccess('Your profile has been updated successfully!')
  }

  function handleLogout() {
    const confirmLogout = window.confirm(
      'Are you sure you want to logout?'
    )

    if (confirmLogout) {
      sessionStorage.removeItem('safeherAccessToken')
      sessionStorage.removeItem('safeherRefreshToken')
      sessionStorage.removeItem('safeherUserId')
      sessionStorage.removeItem('safeherUserName')
      sessionStorage.removeItem('safeherEmail')
      sessionStorage.removeItem('safeherPhoneNumber')

      window.location.href = '/login'
    }
  }

  const initial = profile.name.trim()
    ? profile.name.trim().charAt(0).toUpperCase()
    : 'U'

  return (
    <AppShell active="profile">

      <div className="min-h-screen bg-[#FAF8F2] px-4 py-7 text-[#2C2A1E] md:px-8 md:py-10">

        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9CFB0] bg-[#F0EAD6] px-4 py-2 text-xs font-bold tracking-wider text-[#6B7A3A]">
                <ShieldCheck size={15} />
                YOUR ACCOUNT
              </div>

              <h1 className="text-3xl font-extrabold text-[#2C2A1E] md:text-4xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-[#85806E] md:text-base">
                Manage your personal information and account details.
              </p>

            </div>

            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#D9CFB0] bg-white px-5 py-3 text-sm font-semibold text-[#6B7A3A] transition hover:bg-[#F0EAD6]"
            >
              <ArrowLeft size={17} />
              Dashboard
            </button>

          </div>

          {/* PROFILE LAYOUT */}
          <div className="grid gap-7 lg:grid-cols-[1.6fr_1fr]">

            {/* PROFILE CARD */}
            <section className="overflow-hidden rounded-3xl border border-[#D9CFB0] bg-white shadow-sm">

              {/* PROFILE TOP */}
              <div className="relative overflow-hidden bg-[#EAE5D3] px-6 py-10 text-center">

                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#D5DDBB]/60" />

                <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#D9CFB0]/50" />

                <div className="relative z-10">

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#8D9D4F] text-4xl font-extrabold text-white shadow-lg">
                    {initial}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-[#2C2A1E]">
                    {profile.name || 'Your Name'}
                  </h2>

                  <p className="mt-2 text-sm text-[#716D5C]">
                    {profile.email || 'Your email address'}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C8D0A9] bg-white/80 px-4 py-2 text-xs font-bold text-[#6B7A3A]">
                    <CheckCircle2 size={15} />
                    SafeHer Account
                  </div>

                </div>

              </div>

              {/* PROFILE CONTENT */}
              <div className="p-6 md:p-8">

                <div className="mb-7 flex items-center justify-between gap-3">

                  <div>
                    <h3 className="text-xl font-bold text-[#2C2A1E]">
                      Personal Information
                    </h3>

                    <p className="mt-1 text-sm text-[#85806E]">
                      Keep your account details up to date.
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="flex items-center gap-2 rounded-xl bg-[#E8ECD9] px-4 py-2.5 text-sm font-bold text-[#6B7A3A] transition hover:bg-[#DCE3C7]"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}

                </div>

                {/* SUCCESS MESSAGE */}
                {success && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                    <CheckCircle2 size={19} />
                    {success}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">

                  {/* NAME */}
                  <div>

                    <label
                      htmlFor="profile-name"
                      className="mb-2 flex items-center gap-2 text-sm font-bold text-[#55513F]"
                    >
                      <UserRound size={16} className="text-[#8D9D4F]" />
                      Full Name
                    </label>

                    <input
                      id="profile-name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={100}
                      className="w-full rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3.5 text-sm text-[#2C2A1E] outline-none transition focus:border-[#8D9D4F] focus:ring-2 focus:ring-[#8D9D4F]/20 disabled:cursor-not-allowed disabled:opacity-75"
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label
                      htmlFor="profile-email"
                      className="mb-2 flex items-center gap-2 text-sm font-bold text-[#55513F]"
                    >
                      <Mail size={16} className="text-[#8D9D4F]" />
                      Email Address
                    </label>

                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={150}
                      className="w-full rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3.5 text-sm text-[#2C2A1E] outline-none transition focus:border-[#8D9D4F] focus:ring-2 focus:ring-[#8D9D4F]/20 disabled:cursor-not-allowed disabled:opacity-75"
                    />

                  </div>

                  {/* MOBILE */}
                  <div>

                    <label
                      htmlFor="profile-mobile"
                      className="mb-2 flex items-center gap-2 text-sm font-bold text-[#55513F]"
                    >
                      <Phone size={16} className="text-[#8D9D4F]" />
                      Mobile Number
                    </label>

                    <input
                      id="profile-mobile"
                      type="tel"
                      name="mobile"
                      placeholder="Enter 10 digit mobile number"
                      value={profile.mobile}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={10}
                      className="w-full rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3.5 text-sm text-[#2C2A1E] outline-none transition focus:border-[#8D9D4F] focus:ring-2 focus:ring-[#8D9D4F]/20 disabled:cursor-not-allowed disabled:opacity-75"
                    />

                  </div>

                  {/* FORM BUTTONS */}
                  {isEditing && (

                    <div className="flex flex-col gap-3 border-t border-[#E9E2D0] pt-6 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#D9CFB0] bg-white px-5 py-3 text-sm font-bold text-[#716D5C] transition hover:bg-[#F0EAD6]"
                      >
                        <X size={17} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#8D9D4F] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6B7A3A]"
                      >
                        <Save size={17} />
                        Save Changes
                      </button>

                    </div>

                  )}

                </form>

              </div>

            </section>

            {/* SIDE COLUMN */}
            <aside className="space-y-5">

              {/* SAFETY CARD */}
              <div className="rounded-3xl border border-[#D9CFB0] bg-white p-6 shadow-sm">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8ECD9] text-[#6B7A3A]">
                  <ShieldCheck size={25} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#2C2A1E]">
                  Your Safety Matters
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#85806E]">
                  Keep your contact information updated so your SafeHer
                  account details remain accurate.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8D9D4F]">
                  <Heart size={17} />
                  Stay Safe. Stay Confident.
                </div>

              </div>

              {/* SECURITY CARD */}
              <div className="flex items-start gap-4 rounded-3xl border border-[#D9CFB0] bg-[#F0EAD6] p-6">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6B7A3A]">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#2C2A1E]">
                    Account Security
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#716D5C]">
                    Your account is protected by your login session.
                  </p>
                </div>

              </div>

              {/* LOGOUT */}
              <div className="rounded-3xl border border-[#E7C9BD] bg-[#FBF0E9] p-6">

                <h3 className="font-bold text-[#63372E]">
                  Want to leave?
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#86685D]">
                  You can safely logout from your SafeHer account.
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B85B4B] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#984536]"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            </aside>

          </div>

          {/* FOOTER NOTE */}
          <div className="mt-7 flex items-center justify-center gap-2 rounded-2xl border border-[#D9CFB0] bg-[#F0EAD6] px-5 py-4 text-center text-xs font-medium text-[#716D5C]">
            <ShieldCheck size={16} className="shrink-0 text-[#8D9D4F]" />
            Your privacy and safety are important to us.
          </div>

        </div>

      </div>

    </AppShell>
  )
}

export default MyProfile