import './App.css' // keep: other pages still use these styles until they are migrated
import { useState } from 'react'
import {
  Shield, Siren, Users, MapPin, Route, Bot, Map as MapIcon,
  KeyRound, HeartHandshake, Lock, Menu, X, ArrowRight,
} from 'lucide-react'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import TrustedContacts from './Pages/TrustedContacts'
import SafeJourney from './Pages/SafeJourney'
import IncidentReporting from './Pages/IncidentRepository'
import RiskMap from './Pages/RiskMap'
import AIChatbot from './Pages/AIChatbot'
import MyProfile from './Pages/MyProfile'
import VerifyOTP from './Pages/VerifyOTP'
import Consent from './Pages/Consent'
import TrackLocation from './Pages/TrackLocation'
import ForgotPassword from './Pages/ForgotPassword'

import Button from './components/Button'
import SOSButton from './components/SOSButton'

const go = (url) => () => { window.location.href = url }

const features = [
  { icon: Siren, title: 'SOS emergency', text: 'One press sends an alert with your location to every trusted contact.', big: true },
  { icon: Users, title: 'Trusted contacts', text: 'Choose who is alerted. Each person has to agree first.' },
  { icon: MapPin, title: 'Live location', text: 'Share a link that follows you in real time. No app needed to open it.' },
  { icon: Route, title: 'Safe journey', text: 'Set a trip and an arrival time. If you don’t check in, your contacts are told.' },
  { icon: Bot, title: 'SafeHer AI', text: 'Ask for safety advice at any hour and get a calm, practical answer.' },
  { icon: MapIcon, title: 'Risk map', text: 'See which areas have had reported incidents before you head out.' },
]

const steps = [
  { title: 'Add people you trust', text: 'They get a message asking for consent. Nobody is alerted without saying yes.' },
  { title: 'Press SOS or start a journey', text: 'Your location is shared the moment you need it.' },
  { title: 'Your contacts see where you are', text: 'They open a live link in their browser and can act right away.' },
]

function Landing() {
  const [open, setOpen] = useState(false)
  const links = [['Features', '#features'], ['How it works', '#how'], ['Privacy', '#privacy']]

  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream"><Shield size={18} /></span>
            SafeHer
          </a>
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-soft md:flex" aria-label="Main">
            {links.map(([l, h]) => <a key={h} href={h} className="hover:text-ink">{l}</a>)}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={go('/login')}>Log in</Button>
            <Button onClick={go('/register')}>Sign up</Button>
          </div>
          <button
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-ink/10 px-5 pb-5 md:hidden">
            {links.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 font-medium">{l}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={go('/login')}>Log in</Button>
              <Button className="flex-1" onClick={go('/register')}>Sign up</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-b from-blush/60 via-lilac/40 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.1fr_.9fr] md:pt-24">
          <div>
            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Walk home like<br />someone has your back.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              SafeHer alerts the people you trust, shares your live location, and
              answers safety questions, all from your phone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={go('/register')}>Create free account <ArrowRight size={18} /></Button>
              <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                See what it does
              </Button>
            </div>
          </div>

          {/* Phone mockup: the one memorable element */}
          <div className="mx-auto w-full max-w-[300px]" aria-hidden="true">
            <div className="rounded-[2.5rem] bg-ink p-3 shadow-soft">
              <div className="rounded-[2rem] bg-cream px-6 pb-8 pt-6 text-center">
                <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-ink/15" />
                <p className="font-display text-lg font-bold">Hi, you’re safe</p>
                <p className="mt-1 text-sm text-ink-soft">3 contacts are ready</p>
                <div className="my-9 flex justify-center"><SOSButton size={140} onClick={() => {}} /></div>
                <div className="rounded-2xl bg-safe-soft px-4 py-3 text-left text-sm text-[#136B5D]">
                  <span className="font-semibold">Journey active</span><br />Arriving home by 9:40 pm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20">
        <h2 className="max-w-xl font-display text-3xl font-extrabold sm:text-4xl">Everything you need when something feels off</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text, big }) => (
            <article
              key={title}
              className={`rounded-3xl p-7 ${big ? 'bg-sos text-white md:row-span-2 md:p-9' : 'bg-white shadow-soft'}`}
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${big ? 'bg-white/20' : 'bg-lilac text-ink'}`}>
                <Icon size={24} />
              </span>
              <h3 className={`mt-5 font-display font-bold ${big ? 'text-3xl' : 'text-xl'}`}>{title}</h3>
              <p className={`mt-2 leading-relaxed ${big ? 'text-lg text-white/90' : 'text-ink-soft'}`}>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 bg-lilac/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">How it works</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-cream">{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20">
        <div className="rounded-[2rem] bg-ink p-8 text-cream md:p-14">
          <h2 className="max-w-lg font-display text-3xl font-extrabold sm:text-4xl">Built so you stay in control</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              [KeyRound, 'Duress PIN', 'Enter a secret second PIN if you’re forced to unlock the app. It looks normal but quietly raises the alarm.'],
              [HeartHandshake, 'Consent first', 'A contact is only added after they accept. No one is surprised by an alert.'],
              [Lock, 'Protected sign-in', 'Hashed one-time codes with expiry, attempt limits and secure tokens.'],
            ].map(([Icon, t, d]) => (
              <div key={t}>
                <Icon className="text-blush" size={28} />
                <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 leading-relaxed text-cream/75">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-ink/10 py-10 text-center text-sm text-ink-soft">
        <p className="font-display text-lg font-extrabold text-ink">SafeHer</p>
        <p className="mt-1">Stay safe. Stay strong. Stay confident.</p>
        <p className="mt-4">© 2026 SafeHer</p>
      </div>
    </div>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return <Login />
  if (path === '/register') return <Register />
  if (path === '/dashboard') return <Dashboard />
  if (path === '/trusted-contacts') return <TrustedContacts />
  if (path === '/safe-journey') return <SafeJourney />
  if (path === '/incident-reporting') return <IncidentReporting />
  if (path === '/risk-map') return <RiskMap />
  if (path === '/ai-assistant') return <AIChatbot />
  if (path === '/my-profile') return <MyProfile />
  if (path === '/verify-otp') return <VerifyOTP />
  if (path === '/forgot-password') return <ForgotPassword />
  if (path.startsWith('/consent/')) return <Consent />
  if (path.startsWith('/track/')) return <TrackLocation />

  return <Landing />
}

export default App
