import {
  Shield, LayoutDashboard, Users, Route, FileText, Map as MapIcon,
  Bot, UserRound, LogOut,
} from 'lucide-react'

const nav = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'contacts', label: 'Trusted contacts', href: '/trusted-contacts', icon: Users },
  { id: 'journey', label: 'Safe journey', href: '/safe-journey', icon: Route },
  { id: 'reports', label: 'Incident reports', href: '/incident-reporting', icon: FileText },
  { id: 'map', label: 'Risk map', href: '/risk-map', icon: MapIcon },
  { id: 'ai', label: 'SafeHer AI', href: '/ai-assistant', icon: Bot },
  { id: 'profile', label: 'My profile', href: '/my-profile', icon: UserRound },
]

const mobileIds = ['dashboard', 'contacts', 'journey', 'map', 'ai']

function defaultLogout() {
  ;['safeherAccessToken', 'safeherRefreshToken', 'safeherUserId', 'safeherUserName', 'safeherPhoneNumber']
    .forEach((k) => sessionStorage.removeItem(k))
  window.location.href = '/login'
}

export default function AppShell({ active, onLogout = defaultLogout, wide = false, children }) {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-[1200] hidden w-64 flex-col bg-ink p-5 text-cream lg:flex">
        <a href="/dashboard" className="mb-8 flex items-center gap-2 px-2 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-ink"><Shield size={20} /></span>
          SafeHer
        </a>
        <nav className="flex-1 space-y-1" aria-label="Main">
          {nav.map(({ id, label, href, icon: Icon }) => (
            <a
              key={id}
              href={href}
              aria-current={active === id ? 'page' : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors ${
                active === id ? 'bg-cream text-ink' : 'text-cream/75 hover:bg-white/10 hover:text-cream'
              }`}
            >
              <Icon size={19} /> {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-cream/75 hover:bg-white/10 hover:text-cream"
        >
          <LogOut size={19} /> Log out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-[1200] flex h-14 items-center justify-between border-b border-ink/10 bg-cream/90 px-4 backdrop-blur lg:hidden">
        <a href="/dashboard" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream"><Shield size={17} /></span>
          SafeHer
        </a>
        <div className="flex items-center">
          <a href="/my-profile" aria-label="My profile" className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"><UserRound size={20} /></a>
          <button type="button" onClick={onLogout} aria-label="Log out" className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="pb-24 lg:pb-0 lg:pl-64">
        <div className={`mx-auto px-5 py-8 ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}>{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-[1200] grid grid-cols-5 border-t border-ink/10 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Main">
        {nav.filter((n) => mobileIds.includes(n.id)).map(({ id, label, href, icon: Icon }) => (
          <a
            key={id}
            href={href}
            aria-current={active === id ? 'page' : undefined}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              active === id ? 'text-ink' : 'text-ink-faint'
            }`}
          >
            <Icon size={21} />
            {label.split(' ')[0]}
          </a>
        ))}
      </nav>
    </div>
  )
}
