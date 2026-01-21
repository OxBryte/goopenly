"use client"

import { useState } from "react"
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

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7]">
      {/* Mobile Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex justify-between items-center text-xs text-gray-900 md:hidden">
        <span>9:41</span>
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

      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* User Greeting */}
        <UserGreeting />

        {/* Currency Selector */}
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />

        {/* Balance Card */}
        <BalanceCard 
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
          currency={selectedCurrency}
        />

        {/* Action Buttons */}
        <ActionsGrid />

        {/* Do More Section */}
        <DoMoreSection />

        {/* Transaction List */}
        <TransactionList />
      </div>
    </div>
  )
}
