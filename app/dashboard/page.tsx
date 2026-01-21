
import { BalanceCard } from "@/components/dashboard/balance-card"
import { ActionsGrid } from "@/components/dashboard/actions-grid"
import { TransactionList } from "@/components/dashboard/transaction-list"

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4 pb-24 md:p-8">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              GO
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Goopenly
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
            {/* Avatar Placeholder */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </header>

        <main>
          <BalanceCard />
          <ActionsGrid />
          <TransactionList />
        </main>
      </div>

      {/* Mobile Navigation Bar Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-t border-white/40 p-4 pb-8 md:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {/* Icons would go here */}
        </div>
      </nav>
    </div>
  )
}
