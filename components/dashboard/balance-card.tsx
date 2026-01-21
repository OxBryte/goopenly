"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
    isBalanceVisible: boolean
    onToggleVisibility: () => void
}

export function BalanceCard({ isBalanceVisible, onToggleVisibility }: BalanceCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Account Balance</p>
                    <button
                        onClick={onToggleVisibility}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle balance visibility"
                    >
                        {isBalanceVisible ? (
                            <Eye className="h-4 w-4 text-gray-600" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mb-2">
                    {isBalanceVisible ? "$12,450.00" : "••••••"}
                </h2>
                <p className="text-sm text-gray-500">Available to spend</p>
            </div>
        </div>
    )
}
