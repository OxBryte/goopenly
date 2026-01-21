
import { Send, Plus, CreditCard } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const actions = [
    { label: "Send", icon: Send, color: "text-pink-600" },
    { label: "Add Money", icon: Plus, color: "text-violet-600" },
    { label: "Cards", icon: CreditCard, color: "text-blue-600" },
]

export function ActionsGrid() {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {actions.map((action) => (
                <GlassCard
                    key={action.label}
                    className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/40 transition-colors"
                >
                    <div className={`p-3 rounded-full bg-white/50 mb-2 ${action.color}`}>
                        <action.icon size={24} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </GlassCard>
            ))}
        </div>
    )
}
