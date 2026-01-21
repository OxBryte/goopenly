"use client"

import { useState } from "react"
import { Send, Plus, CreditCard } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const actions = [
    { label: "Send", icon: Send, color: "text-pink-600", action: "send" },
    { label: "Add Money", icon: Plus, color: "text-violet-600", action: "add" },
    { label: "Cards", icon: CreditCard, color: "text-blue-600", action: "cards" },
]

export function ActionsGrid() {
    const [sendDialogOpen, setSendDialogOpen] = useState(false)
    const [recipientAddress, setRecipientAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleActionClick = (action: string) => {
        if (action === "send") {
            setSendDialogOpen(true)
        } else if (action === "add") {
            alert("Add Money feature coming soon!")
        } else if (action === "cards") {
            alert("Cards feature coming soon!")
        }
    }

    const handleSend = async () => {
        if (!recipientAddress.trim() || !amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid recipient address and amount")
            return
        }

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            alert(`Successfully sent $${amount} to ${recipientAddress}`)
            setSendDialogOpen(false)
            setRecipientAddress("")
            setAmount("")
            setIsLoading(false)
        }, 1500)
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-4 mb-6">
                {actions.map((action) => (
                    <GlassCard
                        key={action.label}
                        className="flex flex-col items-center justify-center p-5 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-95"
                        onClick={() => handleActionClick(action.action)}
                    >
                        <div className={`p-3 rounded-xl mb-2.5 ${action.color} bg-primary/10`}>
                            <action.icon size={22} />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{action.label}</span>
                    </GlassCard>
                ))}
            </div>

            {/* Send Dialog */}
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Money</DialogTitle>
                        <DialogDescription>
                            Enter the recipient address and amount to send.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient Address</Label>
                            <Input
                                id="recipient"
                                placeholder="0x..."
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSendDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !recipientAddress.trim() || !amount || parseFloat(amount) <= 0}
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
