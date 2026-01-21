"use client"

import { useState, useEffect } from "react"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ActionsGrid } from "@/components/dashboard/actions-grid"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { CurrencySelector } from "@/components/dashboard/currency-selector"
import { UserGreeting } from "@/components/dashboard/user-greeting"
import { DoMoreSection } from "@/components/dashboard/do-more-section"
import { Headphones, Cloud } from "lucide-react"

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Smooth currency change animation
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency)
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-pink-50/30 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Mobile Status Bar */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-2 flex justify-between items-center text-xs text-gray-900 md:hidden">
        <span className="animate-fade-in">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2.5 border border-gray-900 rounded-sm">
            <div className="w-2 h-1.5 bg-gray-900 rounded-sm m-0.5"></div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-1 h-2 bg-gray-900 rounded-sm"></div>
            <div className="w-1 h-2.5 bg-gray-900 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-900 rounded-sm"></div>
            <div className="w-1 h-2.5 bg-gray-900 rounded-sm"></div>
          </div>
          <div className="w-6 h-3 border border-gray-900 rounded-sm">
            <div className="w-4 h-2 bg-gray-900 rounded-sm m-0.5"></div>
          </div>
          </div>
        </div>

      <div className="relative max-w-2xl mx-auto px-6 py-6">
        {/* User Greeting */}
        <div className={`${mounted ? 'animate-slide-down' : 'opacity-0'}`}>
          <UserGreeting />
        </div>

        {/* Currency Selector */}
        <div className={`${mounted ? 'animate-slide-down delay-100' : 'opacity-0'}`}>
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        {/* Balance Card */}
        <div className={`${mounted ? 'animate-slide-down delay-200' : 'opacity-0'}`}>
          <BalanceCard 
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            currency={selectedCurrency}
          />
        </div>

        {/* Action Buttons */}
        <div className={`${mounted ? 'animate-slide-down delay-300' : 'opacity-0'}`}>
          <ActionsGrid />
        </div>

        {/* Do More Section */}
        <div className={`${mounted ? 'animate-slide-down delay-400' : 'opacity-0'}`}>
          <DoMoreSection />
        </div>

        {/* Transaction List */}
        <div className={`${mounted ? 'animate-slide-down delay-500' : 'opacity-0'}`}>
          <TransactionList />
        </div>
      </div>
    </div>
  )
}
