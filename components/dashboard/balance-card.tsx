"use client"

import { Eye, EyeOff } from "lucide-react"

interface BalanceCardProps {
    isBalanceVisible: boolean
    onToggleVisibility: () => void
    currency: string
}

const balanceAmounts: Record<string, string> = {
  USD: "50,121.21",
  EUR: "46,250.50",
  NGN: "45,000,000.00",
  GBP: "39,450.75",
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  NGN: "₦",
  GBP: "£",
}

export function BalanceCard({ isBalanceVisible, onToggleVisibility, currency }: BalanceCardProps) {
    return (
        <div className="mb-6 group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            
            <div className="relative">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-700">{currency} Balance</p>
                    <button
                        onClick={onToggleVisibility}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 active:scale-95 hover:rotate-12 hover:scale-110"
                        aria-label="Toggle balance visibility"
                    >
                        {isBalanceVisible ? (
                            <Eye className="h-4 w-4 text-gray-500 transition-all duration-300 hover:text-blue-600" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-gray-500 transition-all duration-300 hover:text-blue-600" />
                        )}
                    </button>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                    {isBalanceVisible 
                        ? `${currencySymbols[currency]}${balanceAmounts[currency] || "0.00"}` 
                        : "••••••"}
                </h2>
            </div>
        </div>
    )
}
