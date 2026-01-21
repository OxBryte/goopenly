
import { GlassCard } from "@/components/ui/glass-card"

export function BalanceCard() {
    return (
        <GlassCard className="bg-gradient-to-br from-pink-500/20 to-violet-600/20 w-full mb-6">
            <div className="flex flex-col items-center justify-center py-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Balance</p>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600">
                    $12,450.00
                </h2>
                <p className="text-xs text-muted-foreground mt-2">Available to spend</p>
            </div>
        </GlassCard>
    )
}
