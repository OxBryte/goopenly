"use client"

import { useState } from "react"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ActionsGrid } from "@/components/dashboard/actions-grid"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { Eye, EyeOff } from "lucide-react"

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-primary/80 to-primary/60 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              GO
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Goopenly</h1>
              <p className="text-xs text-muted-foreground">Welcome back</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
              alt="User" 
              className="w-full h-full"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-32">
          <BalanceCard 
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
          />
          <ActionsGrid />
          <TransactionList />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 md:hidden">
          <div className="flex justify-around items-center max-w-md mx-auto py-3">
            <button className="flex flex-col items-center gap-1 p-2">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs text-primary font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">Stats</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">Wallet</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
