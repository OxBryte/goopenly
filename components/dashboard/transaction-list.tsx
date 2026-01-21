
import { GlassCard } from "@/components/ui/glass-card"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

const transactions = [
    { id: 1, type: "incoming", title: "Received from Alice", amount: "+$500.00", date: "Today, 10:23 AM" },
    { id: 2, type: "outgoing", title: "Starbucks Coffee", amount: "-$5.40", date: "Yesterday, 3:12 PM" },
    { id: 3, type: "outgoing", title: "Uber Ride", amount: "-$12.50", date: "Yesterday, 8:45 AM" },
]

export function TransactionList() {
    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 px-2">Recent Activity</h3>
            <div className="space-y-3">
                {transactions.map((tx) => (
                    <GlassCard key={tx.id} className="flex items-center justify-between p-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${tx.type === 'incoming' ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'}`}>
                                {tx.type === 'incoming' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{tx.title}</p>
                                <p className="text-xs text-gray-500">{tx.date}</p>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'incoming' ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount}
                        </span>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
