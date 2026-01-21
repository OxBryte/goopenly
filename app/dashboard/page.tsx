"use client"

import { useState } from "react"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ActionsGrid } from "@/components/dashboard/actions-grid"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { ChevronDown } from "lucide-react"

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                GO
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Goopenly</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">
                <span>English (US)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                  alt="User" 
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <BalanceCard 
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
          />
          <ActionsGrid />
          <TransactionList />
        </div>
      </main>
    </div>
  )
}
