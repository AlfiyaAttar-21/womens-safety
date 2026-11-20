import { useState } from 'react'
import {
  ShieldCheck,
  MapPin,
  Search,
  LocateFixed,
  AlertCircle,
  Heart,
  Info,
  Map,
  Phone,
  Compass,
  Route,
  Crosshair
} from 'lucide-react'

import AppShell from '../components/AppShell'

function RiskMap() {
  const [location, setLocation] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchedLocation, setSearchedLocation] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    setError('')
    setSearchedLocation('')

    if (!location.trim()) {
      setError('Please enter a location to search.')
      return
    }

    setSearchedLocation(location.trim())
  }

  function handleCurrentLocation() {
    setError('')

    if (!navigator.geolocation) {
      setError('Location is not supported by this browser.')
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
        setError('')
      },
      (gpsError) => {
        setError('Unable to get your location: ' + gpsError.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000
      }
    )
  }

  return (
    <AppShell active="map" wide>
      <div className="min-h-screen bg-[#FAF8F2] text-[#2C2A1E]">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#EAE5D3]">

          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#D5DDBB]/60 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#D9CFB0]/50 blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-5 py-14 md:flex-row md:py-20">

            <div className="max-w-2xl">

              <span className="inline-flex items-center gap-2 rounded-full border border-[#C8D0A9] bg-white/70 px-4 py-2 text-xs font-bold tracking-wider text-[#6B7A3A]">
                <MapPin size={15} />
                STAY AWARE. STAY SAFE.
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[#2C2A1E] sm:text-5xl md:text-6xl">
                Safety Risk
                <span className="block text-[#8D9D4F]">Map</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#716D5C] md:text-lg">
                Explore locations, stay aware of your surroundings and make
                informed decisions while travelling.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-[#D9CFB0] bg-white/70 px-5 py-3">
                <ShieldCheck className="text-[#8D9D4F]" size={21} />

                <span className="text-sm font-semibold text-[#55513F]">
                  Your awareness is your first line of safety.
                </span>
              </div>

            </div>

            <div className="relative flex h-64 w-64 shrink-0 items-center justify-center rounded-full border border-[#C8D0A9] bg-[#DCE2C8] shadow-inner md:h-80 md:w-80">

              <div className="absolute h-52 w-52 rounded-full border border-[#B8C398] md:h-64 md:w-64" />

              <div className="absolute h-40 w-40 rounded-full border border-[#B8C398] md:h-48 md:w-48" />

              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#8D9D4F] text-white shadow-xl md:h-32 md:w-32">
                <Map size={65} strokeWidth={1.5} />
              </div>

              <div className="absolute right-8 top-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8D9D4F] shadow-lg">
                <Heart size={23} />
              </div>

              <div className="absolute bottom-10 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8D9D4F] shadow-lg">
                <MapPin size={23} />
              </div>

            </div>

          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-7xl space-y-8 px-5 py-10 md:py-14">

          {/* SEARCH CARD */}
          <section className="rounded-3xl border border-[#D9CFB0] bg-white p-6 shadow-sm md:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EAD6] text-[#6B7A3A]">
                <Search size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#2C2A1E] md:text-2xl">
                  Explore a Location
                </h2>

                <p className="mt-1 text-sm text-[#85806E]">
                  Search for a place you want to explore.
                </p>
              </div>

            </div>

            <form
              className="flex flex-col gap-3 lg:flex-row"
              onSubmit={handleSearch}
            >

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3.5 transition focus-within:border-[#8D9D4F] focus-within:ring-2 focus-within:ring-[#8D9D4F]/20">

                <MapPin size={20} className="shrink-0 text-[#8D9D4F]" />

                <input
                  type="text"
                  placeholder="Enter city, area or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#2C2A1E] outline-none placeholder:text-[#A49F8D]"
                />

              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#8D9D4F] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6B7A3A]"
              >
                <Search size={18} />
                Search
              </button>

              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#C8D0A9] bg-[#F0EAD6] px-6 py-3.5 text-sm font-bold text-[#6B7A3A] transition hover:bg-[#E6EACF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed size={18} />
                {loading ? 'Locating...' : 'My Location'}
              </button>

            </form>

            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

          </section>

          {/* MAP CARD */}
          <section className="overflow-hidden rounded-3xl border border-[#D9CFB0] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-[#E9E2D0] px-6 py-6 md:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EAD6] text-[#6B7A3A]">
                  <Map size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#2C2A1E]">
                    Explore the Map
                  </h2>

                  <p className="mt-1 text-sm text-[#85806E]">
                    View your searched location details.
                  </p>
                </div>

              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#E8ECD9] text-[#6B7A3A] sm:flex">
                <Compass size={23} />
              </div>

            </div>

            <div className="space-y-4 p-6 md:p-8">

              {searchedLocation && (
                <div className="flex items-start gap-4 rounded-2xl border border-[#D9CFB0] bg-[#FAF8F2] p-5">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8ECD9] text-[#6B7A3A]">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <strong className="text-sm font-bold text-[#2C2A1E]">
                      Location searched
                    </strong>

                    <p className="mt-1 text-sm text-[#716D5C]">
                      {searchedLocation}
                    </p>
                  </div>

                </div>
              )}

              {currentLocation && (
                <div className="flex items-start gap-4 rounded-2xl border border-[#D9CFB0] bg-[#FAF8F2] p-5">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8ECD9] text-[#6B7A3A]">
                    <LocateFixed size={22} />
                  </div>

                  <div>
                    <strong className="text-sm font-bold text-[#2C2A1E]">
                      Your Current Coordinates
                    </strong>

                    <p className="mt-2 text-sm leading-6 text-[#716D5C]">
                      Latitude: {currentLocation.latitude.toFixed(6)}
                      <br />
                      Longitude: {currentLocation.longitude.toFixed(6)}
                    </p>

                  </div>

                </div>
              )}

              {/* MAP PLACEHOLDER */}
              <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#D9CFB0] bg-[#F0EAD6] px-6 py-12 text-center">

                <div className="absolute inset-0 opacity-30">

                  <div className="absolute left-0 top-1/4 h-px w-full bg-[#B5A97C]" />
                  <div className="absolute left-0 top-2/4 h-px w-full bg-[#B5A97C]" />
                  <div className="absolute left-0 top-3/4 h-px w-full bg-[#B5A97C]" />

                  <div className="absolute left-1/4 top-0 h-full w-px bg-[#B5A97C]" />
                  <div className="absolute left-2/4 top-0 h-full w-px bg-[#B5A97C]" />
                  <div className="absolute left-3/4 top-0 h-full w-px bg-[#B5A97C]" />

                </div>

                <div className="relative z-10">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8D9D4F] text-white shadow-lg">
                    <Map size={42} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#2C2A1E]">
                    Map View
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#716D5C]">
                    Location search and current GPS coordinates are available.
                    Connect a map provider to display the interactive map here.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#6B7A3A] shadow-sm">
                    <Crosshair size={15} />
                    Location tools available
                  </div>

                </div>

              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#E7DDBD] bg-[#FBF7E9] p-4">

                <Info size={19} className="mt-0.5 shrink-0 text-[#9B8748]" />

                <p className="text-xs leading-6 text-[#766D50]">
                  This page does not currently display verified live safety
                  ratings or danger-zone information.
                </p>

              </div>

            </div>

          </section>

          {/* SAFETY TIPS */}
          <section>

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8ECD9] text-[#6B7A3A]">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#2C2A1E] md:text-2xl">
                  Smart Safety Tips
                </h2>

                <p className="mt-1 text-sm text-[#85806E]">
                  Keep these precautions in mind when travelling.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-[#D9CFB0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAD6] text-[#8D9D4F]">
                  <MapPin size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#2C2A1E]">
                  Know Your Surroundings
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#85806E]">
                  Learn about the area and identify nearby public places
                  before travelling.
                </p>

              </div>

              <div className="rounded-2xl border border-[#D9CFB0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAD6] text-[#8D9D4F]">
                  <Route size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#2C2A1E]">
                  Plan Your Route
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#85806E]">
                  Prefer familiar routes and plan your journey in advance.
                </p>

              </div>

              <div className="rounded-2xl border border-[#D9CFB0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAD6] text-[#8D9D4F]">
                  <Heart size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#2C2A1E]">
                  Stay Connected
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#85806E]">
                  Inform trusted contacts about your travel plans.
                </p>

              </div>

            </div>

          </section>

          {/* EMERGENCY CARD */}
          <section className="flex flex-col gap-5 rounded-3xl border border-[#E7C9BD] bg-[#FBF0E9] p-6 md:flex-row md:items-center md:p-8">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E9D1C5] text-[#A84C3E]">
              <Phone size={27} />
            </div>

            <div className="flex-1">

              <h3 className="text-xl font-bold text-[#63372E]">
                Need Emergency Assistance?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#86685D]">
                If you are in immediate danger, move to a safer place
                and contact emergency services or someone you trust.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#A84C3E]">
                <Phone size={17} />
                India Emergency Helpline: 112
              </div>

            </div>

          </section>

        </div>

        {/* FOOTER */}
        <footer className="border-t border-[#D9CFB0] bg-[#F0EAD6]">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-center md:flex-row md:text-left">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8D9D4F] text-white">
                <ShieldCheck size={22} />
              </div>

              <span className="text-lg font-bold text-[#2C2A1E]">
                SafeHer
              </span>

            </div>

            <p className="text-sm font-medium text-[#716D5C]">
              Stay Safe. Stay Strong. Stay Confident.
            </p>

            <span className="text-xs text-[#85806E]">
              © 2026 SafeHer. All rights reserved.
            </span>

          </div>

        </footer>

      </div>
    </AppShell>
  )
}

export default RiskMap