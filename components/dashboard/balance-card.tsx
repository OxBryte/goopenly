"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
    isBalanceVisible: boolean
    onToggleVisibility: () => void
}

export function BalanceCard({ isBalanceVisible, onToggleVisibility }: BalanceCardProps) {
    return (
        <GlassCard className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 w-full mb-6 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Balance</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-primary/10"
                        onClick={onToggleVisibility}
                    >
                        {isBalanceVisible ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                <h2 className="text-5xl font-bold text-foreground mb-2">
                    {isBalanceVisible ? "$12,450.00" : "••••••"}
                </h2>
                <p className="text-xs text-muted-foreground">Available to spend</p>
            </div>
        </GlassCard>
    )
}
