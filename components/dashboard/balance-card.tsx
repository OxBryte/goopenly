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
        <div className="mb-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 transition-colors duration-200">{currency} Balance</p>
                <button
                    onClick={onToggleVisibility}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
                    aria-label="Toggle balance visibility"
                >
                    {isBalanceVisible ? (
                        <Eye className="h-4 w-4 text-gray-500" />
                    ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                </button>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 transition-all duration-300 ease-in-out">
                {isBalanceVisible 
                    ? `${currencySymbols[currency]}${balanceAmounts[currency] || "0.00"}` 
                    : "••••••"}
            </h2>
        </div>
    )
}
