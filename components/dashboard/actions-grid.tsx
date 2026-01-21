"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
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
    { 
        label: "Account Details", 
        icon: () => (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ), 
        color: "text-gray-700", 
        action: "account" 
    },
    { 
        label: "Send Money", 
        icon: Send, 
        color: "text-gray-700", 
        action: "send" 
    },
    { 
        label: "Convert", 
        icon: () => (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ), 
        color: "text-gray-700", 
        action: "convert" 
    },
]

export function ActionsGrid() {
    const [sendDialogOpen, setSendDialogOpen] = useState(false)
    const [recipientAddress, setRecipientAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleActionClick = (action: string) => {
        if (action === "send") {
            setSendDialogOpen(true)
        } else if (action === "account") {
            alert("Account Details feature coming soon!")
        } else if (action === "convert") {
            alert("Currency Convert feature coming soon!")
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
            <div className="grid grid-cols-3 gap-4 mb-8">
                {actions.map((action) => (
                    <div
                        key={action.label}
                        className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all active:scale-[0.98]"
                        onClick={() => handleActionClick(action.action)}
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className={`mb-3 ${action.color}`}>
                                {typeof action.icon === 'function' ? <action.icon /> : <action.icon size={24} />}
                            </div>
                            <span className="text-xs font-medium text-gray-900 leading-tight">{action.label}</span>
                        </div>
                    </div>
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
