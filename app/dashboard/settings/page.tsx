"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, ChevronRight, Bell, DollarSign, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [biometric, setBiometric] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative overflow-hidden pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-pink-50/30 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative max-w-2xl mx-auto px-6 py-6">
        <header
          className={`flex items-center gap-4 mb-6 ${mounted ? "animate-slide-down" : "opacity-0"}`}
        >
          <Link
            href="/dashboard/profile"
            className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage your preferences</p>
          </div>
        </header>

        {/* Notifications */}
        <section
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 ${mounted ? "animate-slide-down delay-100" : "opacity-0"}`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Push notifications</p>
                <p className="text-xs text-gray-500">Transactions, alerts & updates</p>
              </div>
              <button
                role="switch"
                aria-checked={notifications}
                onClick={() => setNotifications(!notifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${notifications ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Email alerts</p>
                <p className="text-xs text-gray-500">Weekly summary & security alerts</p>
              </div>
              <button
                role="switch"
                aria-checked={emailAlerts}
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`relative w-11 h-6 rounded-full transition-colors ${emailAlerts ? "bg-primary" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${emailAlerts ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Currency */}
        <section
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 ${mounted ? "animate-slide-down delay-150" : "opacity-0"}`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Currency</h2>
          </div>
          <div className="p-4">
            <Label className="text-sm text-gray-600">Default currency</Label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </section>

        {/* Security */}
        <section
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 ${mounted ? "animate-slide-down delay-200" : "opacity-0"}`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-gray-900">Security</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Biometric login</p>
                <p className="text-xs text-gray-500">Use Face ID or fingerprint</p>
              </div>
              <button
                role="switch"
                aria-checked={biometric}
                onClick={() => setBiometric(!biometric)}
                className={`relative w-11 h-6 rounded-full transition-colors ${biometric ? "bg-primary" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${biometric ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <Link
              href="#"
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
              onClick={(e) => { e.preventDefault(); toast.info("Change PIN coming soon!"); }}
            >
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">Change PIN</p>
                <p className="text-xs text-gray-500">Update your 4-digit PIN</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </section>

        {/* Save button */}
        <div className={`mt-6 ${mounted ? "animate-slide-down delay-300" : "opacity-0"}`}>
          <Button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-6 text-base font-medium transition-all ${saved ? "bg-green-600 hover:bg-green-600" : ""}`}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
