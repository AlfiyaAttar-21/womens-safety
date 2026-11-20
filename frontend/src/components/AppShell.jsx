
import {
  Shield,
  LayoutDashboard,
  Users,
  Route,
  FileText,
  MapPin,
  Bot,
  UserRound,
  LogOut,
  Settings,
} from 'lucide-react'

const nav = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'contacts', label: 'Trusted Contacts', href: '/trusted-contacts', icon: Users },
  { id: 'journey', label: 'Safe Journey', href: '/safe-journey', icon: Route },
  { id: 'reports', label: 'Incident Reports', href: '/incident-reporting', icon: FileText },
  { id: 'map', label: 'Safety Risk Map', href: '/risk-map', icon: MapPin },
  { id: 'ai', label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
]

function defaultLogout() {
  ;[
    'safeherAccessToken',
    'safeherRefreshToken',
    'safeherUserId',
    'safeherUserName',
    'safeherPhoneNumber'
  ].forEach((key) => sessionStorage.removeItem(key))

  window.location.href = '/login'
}

export default function AppShell({
  active,
  onLogout = defaultLogout,
  wide = false,
  children
}) {
  const cream = '#faf8f2'
  const sidebarBg = '#f5f0e0'
  const olive = '#6b7a3a'
  const dark = '#2c2a1e'
  const border = '#d9cfb0'
  const activeBg = '#e7dbbf'

  const linkStyle = (id) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    minHeight: '47px',
    padding: '0 15px',
    marginBottom: '7px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontFamily: "'Source Serif 4', serif",
    fontSize: '15px',
    color: active === id ? olive : '#68634f',
    background: active === id ? activeBg : 'transparent',
    fontWeight: active === id ? 700 : 400
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: cream,
      color: dark,
      fontFamily: "'Source Serif 4', serif"
    }}>

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '252px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: sidebarBg,
        borderRight: `1px solid ${border}`,
        zIndex: 1200
      }}>

        {/* Logo */}
        <a href="/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          padding: '0 8px',
          marginBottom: '46px',
          color: dark,
          textDecoration: 'none',
          fontFamily: "'Merriweather', serif",
          fontSize: '22px',
          fontWeight: 900
        }}>
          <span style={{
            width: '41px',
            height: '41px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '13px',
            background: '#8d9d4f',
            color: '#ffffff'
          }}>
            <Shield size={22} />
          </span>
          Safe<span style={{ color: olive }}>Her</span>
        </a>

        <div style={{
          paddingLeft: '11px',
          marginBottom: '17px',
          color: '#81785e',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '1px'
        }}>
          MAIN MENU
        </div>

        {/* Main Navigation */}
        <nav style={{ flex: 1 }}>
          {nav.map(({ id, label, href, icon: Icon }) => (
            <a key={id} href={href} style={linkStyle(id)}>
              <Icon size={19} />
              {label}
            </a>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div style={{
          borderTop: `1px solid ${border}`,
          marginLeft: '-16px',
          marginRight: '-16px',
          padding: '20px 16px 0'
        }}>
          <a href="/my-profile" style={linkStyle('profile')}>
            <Settings size={19} />
            My Profile
          </a>

          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '13px',
              width: '100%',
              minHeight: '44px',
              padding: '0 15px',
              border: 'none',
              background: 'transparent',
              color: '#e52424',
              fontFamily: "'Source Serif 4', serif",
              fontSize: '15px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main style={{
        minHeight: '100vh',
        marginLeft: '252px',
        background: cream
      }}>
        <div style={{
          width: '100%',
          maxWidth: wide ? '1200px' : '1050px',
          boxSizing: 'border-box',
          margin: '0 auto',
          padding: '30px 31px'
        }}>
          {children}
        </div>
      </main>

    </div>
  )
}
