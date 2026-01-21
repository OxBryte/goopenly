"use client"

import { Cloud, Headphones } from "lucide-react"

export function UserGreeting() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex items-center justify-between mb-6 group">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-6 group-hover:rotate-[-6deg]">
          JO
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-700 animate-fade-in">{getGreeting()}</span>
            <Cloud className="w-4 h-4 text-gray-500 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 transition-all duration-300 group-hover:text-blue-600">Juwon</h2>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95">
        <Headphones className="w-5 h-5 text-gray-600 transition-all duration-300 hover:text-blue-600" />
      </button>
    </div>
  )
}
