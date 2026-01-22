"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Mail, Phone, Calendar, Settings, Camera, ShieldCheck } from "lucide-react"
import { defaultProfile } from "@/lib/data/profile"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const profile = defaultProfile

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-pink-50/30 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative max-w-2xl mx-auto px-6 py-6">
        <header
          className={`flex items-center gap-4 mb-6 ${mounted ? "animate-slide-down" : "opacity-0"}`}
        >
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500">Your account information</p>
          </div>
        </header>

        {/* Profile card */}
        <div
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 ${mounted ? "animate-slide-down delay-100" : "opacity-0"}`}
        >
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile.initials
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                onClick={() => alert("Change photo coming soon!")}
                aria-label="Change photo"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Member since {profile.memberSince}</p>
          </div>

          <div className="divide-y divide-gray-100">
            <Link
              href="#"
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
              onClick={(e) => { e.preventDefault(); alert("Edit profile coming soon!"); }}
            >
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
            {profile.phone && (
              <Link
                href="#"
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                onClick={(e) => { e.preventDefault(); alert("Edit phone coming soon!"); }}
              >
                <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-500">{profile.phone}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </Link>
            )}
            <div className="flex items-center gap-4 p-4">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">Member since</p>
                <p className="text-sm text-gray-500">{profile.memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings link */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200 group ${mounted ? "animate-slide-down delay-200" : "opacity-0"}`}
        >
          <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900">Settings</p>
            <p className="text-sm text-gray-500">Notifications, currency, security & more</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  )
}
