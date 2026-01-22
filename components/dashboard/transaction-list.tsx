"use client"

import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"

const transactions = [
    { id: 1, type: "incoming", title: "Received from Alice", amount: "+$500.00", date: "Today, 10:23 AM", category: "Transfer" },
    { id: 2, type: "outgoing", title: "Starbucks Coffee", amount: "-$5.40", date: "Yesterday, 3:12 PM", category: "Food & Drink" },
    { id: 3, type: "outgoing", title: "Uber Ride", amount: "-$12.50", date: "Yesterday, 8:45 AM", category: "Transport" },
    { id: 4, type: "incoming", title: "Salary Payment", amount: "+$2,500.00", date: "Jan 19, 2024", category: "Income" },
    { id: 5, type: "outgoing", title: "Netflix Subscription", amount: "-$15.99", date: "Jan 18, 2024", category: "Entertainment" },
]

export function TransactionList() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    See All
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                <div className="divide-y divide-gray-100">
                    {transactions.map((tx, index) => (
                        <div 
                            key={tx.id} 
                            className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-sm group/item"
                            style={{
                                animation: `slide-down 0.6s ease-out ${(index + 1) * 0.1}s both`
                            }}
                        >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`p-2.5 rounded-lg flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6 ${
                                tx.type === 'incoming' 
                                    ? 'bg-green-50 text-green-600 group-hover/item:bg-green-100' 
                                    : 'bg-gray-100 text-gray-700 group-hover/item:bg-gray-200'
                            }`}>
                                {tx.type === 'incoming' ? (
                                    <ArrowDownLeft size={18} className="transition-transform duration-300 group-hover/item:translate-x-1 group-hover/item:-translate-y-1" />
                                ) : (
                                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover/item:translate-x-1 group-hover/item:translate-y-1" />
                                )}
                            </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{tx.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-gray-500">{tx.date}</p>
                                        <span className="text-xs text-gray-400">•</span>
                                        <p className="text-xs text-gray-500">{tx.category}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover/item:scale-110 ${
                                    tx.type === 'incoming' 
                                        ? 'text-green-600 group-hover/item:text-green-700' 
                                        : 'text-gray-900 group-hover/item:text-primary'
                                }`}>
                                    {tx.amount}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover/item:text-primary group-hover/item:translate-x-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
