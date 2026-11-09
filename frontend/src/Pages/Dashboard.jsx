
import {
  LayoutDashboard,
  Users,
  MapPin,
  Navigation,
  FileText,
  Bot,
  UserRound,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight
} from 'lucide-react'

function Dashboard() {
  const services = [
    {
      title: 'Trusted Contacts',
      description: 'Manage your emergency contacts.',
      icon: Users,
      link: '/trusted-contacts'
    },
    {
      title: 'Safe Journey',
      description: 'Share your journey with trusted people.',
      icon: Navigation,
      link: '/safe-journey'
    },
    {
      title: 'Incident Reporting',
      description: 'Report safety-related incidents.',
      icon: FileText,
      link: '/incident-reporting'
    },
    {
      title: 'Safety Risk Map',
      description: 'Explore safety information about locations.',
      icon: MapPin,
      link: '/risk-map'
    },
    {
      title: 'AI Safety Assistant',
      description: 'Get helpful safety guidance.',
      icon: Bot,
      link: '/ai-assistant'
    },
    {
      title: 'My Profile',
      description: 'Manage your personal information.',
      icon: UserRound,
      link: '/my-profile'
    }
  ]

  const openPage = (link) => {
    window.location.href = link
  }

  return (
    <div className="min-h-screen bg-[#faf8f2] flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#f5f0e0] border-r border-[#d9cfb0] min-h-screen fixed left-0 top-0 flex flex-col">

        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#8d9d4f] text-white p-2 rounded-xl">
            <ShieldCheck size={25} />
          </div>

          <h1 className="text-2xl font-bold text-[#2c2a1e]">
            Safe<span className="text-[#8d9d4f]">Her</span>
          </h1>
        </div>

        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-[#6b6550] uppercase mb-4 px-3">
            Main Menu
          </p>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#e7dbbf] text-[#6b7a3a] font-semibold">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          {[
            { name: 'Trusted Contacts', icon: Users, link: '/trusted-contacts' },
            { name: 'Safe Journey', icon: Navigation, link: '/safe-journey' },
            { name: 'Incident Reports', icon: FileText, link: '/incident-reporting' },
            { name: 'Safety Risk Map', icon: MapPin, link: '/risk-map' },
            { name: 'AI Assistant', icon: Bot, link: '/ai-assistant' }
          ].map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => openPage(item.link)}
                className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-[#6b6550] hover:bg-[#e7dbbf] hover:text-[#6b7a3a] transition"
              >
                <Icon size={20} />
                {item.name}
              </button>
            )
          })}
        </div>

        <div className="mt-auto p-4 border-t border-[#d9cfb0]">
          <button
            onClick={() => openPage('/my-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#6b6550] hover:bg-[#e7dbbf] rounded-xl"
          >
            <Settings size={20} />
            My Profile
          </button>

          <button
            onClick={() => openPage('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">

        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-2xl font-bold text-[#2c2a1e]">
              Dashboard
            </h2>

            <p className="text-[#6b6550] text-sm mt-1">
              Welcome back! Stay safe and confident.
            </p>
          </div>

          <div className="flex items-center gap-5">

            <button className="relative p-3 bg-white rounded-xl shadow-sm text-[#6b6550]">
              <Bell size={21} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => openPage('/my-profile')}
              className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl shadow-sm"
            >
              <div className="w-10 h-10 bg-[#e7dbbf] text-[#6b7a3a] rounded-full flex items-center justify-center">
                <UserRound size={22} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-[#2c2a1e]">
                  My Account
                </p>
                <p className="text-xs text-[#6b6550]">
                  SafeHer User
                </p>
              </div>
            </button>

          </div>
        </header>

        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-[#6b7a3a] to-[#8d9d4f] rounded-2xl p-8 text-white mb-8 relative overflow-hidden">

          <div className="relative z-10">
            <p className="text-[#f0ead6] text-sm font-medium mb-2">
              YOUR SAFETY MATTERS
            </p>

            <h1 className="text-3xl font-bold mb-3">
              Welcome to SafeHer!
            </h1>

            <p className="text-[#f5f0e0] max-w-xl">
              Your personal safety companion is here to help you
              stay protected, connected and confident.
            </p>
          </div>

          <ShieldCheck
            size={150}
            className="absolute right-10 top-5 text-white opacity-10"
          />

        </section>

        {/* Emergency SOS */}
        <section className="bg-[#e7dbbf] rounded-2xl p-6 shadow-sm border border-[#d9cfb0] mb-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#2c2a1e]">
                Emergency Assistance
              </h2>

              <p className="text-sm text-[#6b6550]">
                Need help? Emergency support is important.
              </p>
            </div>

          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-3 rounded-xl transition">
            SOS Emergency
          </button>

          <p className="text-xs text-[#6b6550] mt-3">
            SOS is currently a UI button. Emergency alert functionality will be connected separately.
          </p>

        </section>

        {/* Services */}
        <section>

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-xl font-bold text-[#2c2a1e]">
                Your Safety Services
              </h2>

              <p className="text-sm text-[#6b6550] mt-1">
                Choose a service to continue.
              </p>
            </div>

            <span className="text-sm text-[#6b7a3a] font-semibold">
              6 Services
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {services.map((service) => {
              const Icon = service.icon

              return (
                <div
                  key={service.title}
                  onClick={() => openPage(service.link)}
                  className="bg-white p-6 rounded-2xl border border-[#d9cfb0] shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
                >

                  <div className="flex justify-between items-start mb-5">

                    <div className="p-3 rounded-xl bg-[#f0ead6] text-[#6b7a3a]">
                      <Icon size={24} />
                    </div>

                    <ArrowUpRight size={20} className="text-[#8a7e65]" />

                  </div>

                  <h3 className="font-bold text-[#2c2a1e] text-lg mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#6b6550] mb-5">
                    {service.description}
                  </p>

                  <span className="text-sm font-semibold text-[#6b7a3a]">
                    Open Service →
                  </span>

                </div>
              )
            })}

          </div>

        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[#d9cfb0] flex justify-between text-sm text-[#6b6550]">

          <p>© 2026 SafeHer. All rights reserved.</p>

          <p className="flex items-center gap-2">
            <Clock size={15} />
            Stay Safe. Stay Confident.
          </p>

        </footer>

      </main>

    </div>
  )
}

export default Dashboard
