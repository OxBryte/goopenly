"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ArrowDownLeft, ArrowUpRight, MoreVertical } from "lucide-react"

const transactions = [
    { id: 1, type: "incoming", title: "Received from Alice", amount: "+$500.00", date: "Today, 10:23 AM", category: "Transfer" },
    { id: 2, type: "outgoing", title: "Starbucks Coffee", amount: "-$5.40", date: "Yesterday, 3:12 PM", category: "Food & Drink" },
    { id: 3, type: "outgoing", title: "Uber Ride", amount: "-$12.50", date: "Yesterday, 8:45 AM", category: "Transport" },
    { id: 4, type: "incoming", title: "Salary Payment", amount: "+$2,500.00", date: "Jan 19, 2024", category: "Income" },
    { id: 5, type: "outgoing", title: "Netflix Subscription", amount: "-$15.99", date: "Jan 18, 2024", category: "Entertainment" },
]

export function TransactionList() {
    return (
        <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <button className="text-sm text-primary hover:underline">See All</button>
            </div>
            <div className="space-y-2">
                {transactions.map((tx) => (
                    <GlassCard 
                        key={tx.id} 
                        className="flex items-center justify-between p-4 hover:bg-card/50 transition-colors cursor-pointer border border-border/50"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                tx.type === 'incoming' 
                                    ? 'bg-green-500/10 text-green-600' 
                                    : 'bg-primary/10 text-primary'
                            }`}>
                                {tx.type === 'incoming' ? (
                                    <ArrowDownLeft size={18} />
                                ) : (
                                    <ArrowUpRight size={18} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{tx.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <p className="text-xs text-muted-foreground">{tx.category}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-sm font-bold whitespace-nowrap ${
                                tx.type === 'incoming' 
                                    ? 'text-green-600' 
                                    : 'text-foreground'
                            }`}>
                                {tx.amount}
                            </span>
                            <button className="p-1 hover:bg-muted rounded-lg">
                                <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
