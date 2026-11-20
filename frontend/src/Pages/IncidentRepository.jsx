import { useState } from 'react'
import {
  ShieldCheck,
  AlertCircle,
  FileText,
  MapPin,
  CalendarDays,
  Trash2,
  PlusCircle,
  Heart,
  LockKeyhole,
  ClipboardList,
  CheckCircle2,
  MessageSquareText
} from 'lucide-react'

import AppShell from '../components/AppShell'

function IncidentReporting() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [reports, setReports] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const today = new Date()

  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !date ||
      !location.trim()
    ) {
      setError('Please fill in all the fields.')
      return
    }

    if (date > maxDate) {
      setError('Incident date cannot be in the future.')
      return
    }

    const newReport = {
      id: Date.now(),
      title: title.trim(),
      category,
      description: description.trim(),
      date,
      location: location.trim()
    }

    setReports((previousReports) => [newReport, ...previousReports])

    setTitle('')
    setCategory('')
    setDescription('')
    setDate('')
    setLocation('')

    setMessage('Your incident report has been added successfully.')
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this report?'
    )

    if (!confirmDelete) return

    setReports((previousReports) =>
      previousReports.filter((report) => report.id !== id)
    )

    setMessage('Incident report deleted successfully.')
    setError('')
  }

  function formatDate(value) {
    return new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const inputClass =
    'w-full rounded-xl border border-[#D9CFB0] bg-white px-4 py-3 text-[#2C2A1E] outline-none transition focus:border-[#8D9D4F] focus:ring-2 focus:ring-[#8D9D4F]/20'

  const labelClass =
    'mb-2 block text-sm font-semibold text-[#494735]'

  return (
    <AppShell active="reports" wide>
      <div className="min-h-screen bg-[#FAF8F2] text-[#2C2A1E]">

        {/* HERO */}
        <section className="bg-[#E7E3D2]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-14 md:flex-row md:py-20">

            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-[#6B7A3A]">
                <ShieldCheck size={15} />
                YOUR VOICE MATTERS
              </div>

              <h1 className="text-4xl font-bold leading-tight text-[#2C2A1E] md:text-5xl">
                Incident
                <br />
                <span className="text-[#8D9D4F]">Reporting</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#68654F]">
                Report an incident and keep a record of important details.
                Your safety and well-being matter to us.
              </p>

              <div className="mt-6 flex items-center gap-3 text-sm font-medium text-[#6B7A3A]">
                <Heart size={20} />
                You are not alone. Your safety matters.
              </div>

            </div>

            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-[#8D9D4F] text-white shadow-xl md:h-64 md:w-64">
              <div className="relative">
                <FileText size={85} strokeWidth={1.3} />

                <div className="absolute -bottom-3 -right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#8D9D4F]">
                  <ShieldCheck size={25} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-6xl px-5 py-10">

          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#C9D6A8] bg-[#F0EAD6] p-4 text-[#55723B]">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {/* REPORT FORM */}
          <section className="rounded-3xl border border-[#D9CFB0] bg-white p-6 shadow-sm md:p-9">

            <div className="mb-8 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAD6] text-[#6B7A3A]">
                <PlusCircle size={27} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Report an Incident
                </h2>

                <p className="mt-1 text-sm text-[#85816B]">
                  Enter the details of the incident below.
                </p>
              </div>

            </div>

            <div className="mb-7 flex gap-3 rounded-xl bg-[#F0EAD6] p-4 text-sm text-[#6B7A3A]">
              <LockKeyhole size={20} className="shrink-0" />

              <p>
                Provide accurate information so you can maintain a useful
                record of the incident.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid gap-6 md:grid-cols-2">

                {/* TITLE */}
                <div>
                  <label htmlFor="ir-title" className={labelClass}>
                    Incident Title
                  </label>

                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]"
                    />

                    <input
                      id="ir-title"
                      type="text"
                      placeholder="Enter incident title"
                      value={title}
                      maxLength={100}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass + ' pl-11'}
                      required
                    />
                  </div>
                </div>

                {/* CATEGORY */}
                <div>
                  <label htmlFor="ir-category" className={labelClass}>
                    Incident Category
                  </label>

                  <select
                    id="ir-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select incident category</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Stalking">Stalking</option>
                    <option value="Unsafe Location">Unsafe Location</option>
                    <option value="Verbal Abuse">Verbal Abuse</option>
                    <option value="Physical Threat">Physical Threat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <label htmlFor="ir-date" className={labelClass}>
                    Incident Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]"
                    />

                    <input
                      id="ir-date"
                      type="date"
                      value={date}
                      max={maxDate}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputClass + ' pl-11'}
                      required
                    />
                  </div>
                </div>

                {/* LOCATION */}
                <div>
                  <label htmlFor="ir-location" className={labelClass}>
                    Incident Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D9D4F]"
                    />

                    <input
                      id="ir-location"
                      type="text"
                      placeholder="Enter incident location"
                      value={location}
                      maxLength={150}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass + ' pl-11'}
                      required
                    />
                  </div>
                </div>

              </div>

              {/* DESCRIPTION */}
              <div>
                <label htmlFor="ir-description" className={labelClass}>
                  Incident Description
                </label>

                <div className="relative">
                  <MessageSquareText
                    size={19}
                    className="absolute left-4 top-4 text-[#8D9D4F]"
                  />

                  <textarea
                    id="ir-description"
                    placeholder="Describe what happened..."
                    value={description}
                    maxLength={1000}
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass + ' resize-y pl-11'}
                    required
                  />
                </div>

                <div className="mt-2 text-right text-xs text-[#85816B]">
                  {description.length}/1000 characters
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8D9D4F] px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#6B7A3A] md:w-auto"
              >
                <FileText size={19} />
                Submit Report
              </button>

            </form>

          </section>

          {/* REPORTS */}
          <section className="mt-12">

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

              <div>
                <span className="text-xs font-bold tracking-widest text-[#8D9D4F]">
                  YOUR RECORDS
                </span>

                <h2 className="mt-2 text-2xl font-bold">
                  My Incident Reports
                </h2>

                <p className="mt-1 text-sm text-[#85816B]">
                  View the incident reports you have added.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#D9CFB0] bg-white px-4 py-3 text-sm font-semibold text-[#6B7A3A]">
                <ClipboardList size={20} />
                {reports.length} Reports
              </div>

            </div>

            {/* EMPTY STATE */}
            {reports.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-[#CFC5A6] bg-white px-6 py-14 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F0EAD6] text-[#8D9D4F]">
                  <FileText size={38} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No Reports Yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#85816B]">
                  Your submitted incident records will appear here.
                  Add your first report using the form above.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 md:grid-cols-2">

                {reports.map((report) => (

                  <article
                    className="rounded-2xl border border-[#D9CFB0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    key={report.id}
                  >

                    <div className="mb-4 flex items-center justify-between gap-3">

                      <span className="rounded-full bg-[#F0EAD6] px-3 py-1.5 text-xs font-bold text-[#6B7A3A]">
                        {report.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(report.id)}
                        aria-label="Delete report"
                        title="Delete report"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    <h3 className="text-lg font-bold text-[#2C2A1E]">
                      {report.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#77745F]">
                      {report.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-[#E8E1CD] pt-4 text-sm text-[#77745F]">

                      <div className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-[#8D9D4F]" />
                        {formatDate(report.date)}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={17} className="shrink-0 text-[#8D9D4F]" />
                        {report.location}
                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

          {/* SUPPORT NOTE */}
          <div className="mt-10 flex gap-4 rounded-2xl border border-[#D9CFB0] bg-[#F0EAD6] p-6">

            <Heart size={27} className="mt-1 shrink-0 text-[#8D9D4F]" />

            <div>
              <h3 className="font-bold text-[#52612D]">
                Your Safety Comes First
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#68654F]">
                If you are in immediate danger, move to a safer place and
                contact local emergency services or someone you trust.
              </p>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-[#D9CFB0] bg-[#F0EAD6]">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-2 font-bold text-[#6B7A3A]">
              <ShieldCheck size={21} />
              SafeHer
            </div>

            <p className="text-sm text-[#77745F]">
              Stay Safe. Stay Strong. Stay Confident.
            </p>

            <span className="text-xs text-[#85816B]">
              © 2026 SafeHer. All rights reserved.
            </span>

          </div>

        </footer>

      </div>
    </AppShell>
  )
}

export default IncidentReporting