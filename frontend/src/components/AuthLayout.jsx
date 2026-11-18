import { Shield, Lock, Users, MapPin } from 'lucide-react'

const points = [
  [Users, 'Only people you choose are alerted'],
  [MapPin, 'Live location, shared only when you need it'],
  [Lock, 'Your PINs and codes are stored hashed'],
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-cream font-sans text-ink antialiased lg:grid-cols-[.9fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-cream lg:flex">
        <a href="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-ink"><Shield size={20} /></span>
          SafeHer
        </a>
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Someone always<br />knows where you are.
          </h2>
          <ul className="mt-8 space-y-4 text-cream/80">
            {points.map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-3"><Icon size={20} className="text-blush" />{t}</li>
            ))}
          </ul>
        </div>
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sos/30 blur-3xl" />
        <p className="text-sm text-cream/50">© 2026 SafeHer</p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center bg-gradient-to-b from-blush/40 to-cream px-5 py-10 lg:bg-none">
        <div className="w-full max-w-md">
          <a href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-extrabold lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream"><Shield size={18} /></span>
            SafeHer
          </a>
          <h1 className="font-display text-3xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-[15px] text-ink-soft">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
