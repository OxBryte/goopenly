"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Zap, ChevronRight, ShoppingBag, Brain, FileText, Receipt } from "lucide-react"
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
import { Loader2 } from "lucide-react"
import { SuccessModal } from "@/components/ui/success-modal"
import { billProviders } from "@/lib/data/simulated"

const moreFeatures = [
    { icon: ShoppingBag, label: "Shopping", color: "bg-pink-100 text-pink-600", action: "shopping" },
    { icon: Brain, label: "AI Assistant", color: "bg-green-100 text-green-600", action: "ai" },
    { icon: FileText, label: "Send Invoice", color: "bg-blue-100 text-blue-600", action: "invoice" },
    { icon: Receipt, label: "Pay Bills", color: "bg-purple-100 text-purple-600", action: "bills" },
]

export function DoMoreSection() {
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
    const [billsDialogOpen, setBillsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [invoiceEmail, setInvoiceEmail] = useState("")
    const [invoiceAmount, setInvoiceAmount] = useState("")
    const [billProvider, setBillProvider] = useState("")
    const [billAmount, setBillAmount] = useState("")

    const handleFeatureClick = (action: string) => {
        if (action === "invoice") {
            setInvoiceDialogOpen(true)
        } else if (action === "bills") {
            setBillsDialogOpen(true)
        } else if (action === "shopping") {
            // Simulate navigation
            alert("Shopping feature coming soon! Browse products and make purchases.")
        } else if (action === "ai") {
            // Simulate AI assistant
            alert("AI Assistant feature coming soon! Get help with your finances using AI.")
        }
    }

    const handleSendInvoice = async () => {
        if (!invoiceEmail || !invoiceAmount || parseFloat(invoiceAmount) <= 0) return

        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        alert(`Invoice sent successfully to ${invoiceEmail} for $${parseFloat(invoiceAmount).toFixed(2)}`)
        setInvoiceDialogOpen(false)
        setInvoiceEmail("")
        setInvoiceAmount("")
        setIsLoading(false)
    }

    const handlePayBill = async () => {
        if (!billProvider || !billAmount || parseFloat(billAmount) <= 0) return

        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        alert(`Bill payment of $${parseFloat(billAmount).toFixed(2)} to ${billProvider} processed successfully!`)
        setBillsDialogOpen(false)
        setBillProvider("")
        setBillAmount("")
        setIsLoading(false)
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Do more with Goopenly</h3>
                    <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {moreFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 w-24 cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all duration-300 active:scale-[0.95] transform group relative overflow-hidden"
                            onClick={() => handleFeatureClick(feature.action)}
                            style={{
                                animation: `slide-down 0.6s ease-out ${(index + 1) * 0.1}s both`
                            }}
                        >
                            {/* Ripple effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-0 group-hover:scale-150"></div>
                            
                            <div className="relative flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg`}>
                                    <feature.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <span className="text-xs font-medium text-gray-700 transition-all duration-300 group-hover:text-primary group-hover:font-semibold">{feature.label}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex-shrink-0 flex items-center justify-center w-8">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Send Invoice Dialog */}
            <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send Invoice</DialogTitle>
                        <DialogDescription>
                            Create and send an invoice to a customer
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice-email">Recipient Email</Label>
                            <Input
                                id="invoice-email"
                                type="email"
                                placeholder="customer@example.com"
                                value={invoiceEmail}
                                onChange={(e) => setInvoiceEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invoice-amount">Amount ($)</Label>
                            <Input
                                id="invoice-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={invoiceAmount}
                                onChange={(e) => setInvoiceAmount(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setInvoiceDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendInvoice}
                            disabled={isLoading || !invoiceEmail || !invoiceAmount || parseFloat(invoiceAmount) <= 0}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Invoice"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pay Bills Dialog */}
            <Dialog open={billsDialogOpen} onOpenChange={setBillsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pay Bills</DialogTitle>
                        <DialogDescription>
                            Pay your bills directly from your account
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bill-provider">Bill Provider</Label>
                            <select
                                id="bill-provider"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={billProvider}
                                onChange={(e) => setBillProvider(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Select provider</option>
                                <option value="Electricity">Electricity Company</option>
                                <option value="Water">Water Department</option>
                                <option value="Internet">Internet Service</option>
                                <option value="Phone">Phone Service</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bill-amount">Amount ($)</Label>
                            <Input
                                id="bill-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={billAmount}
                                onChange={(e) => setBillAmount(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBillsDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayBill}
                            disabled={isLoading || !billProvider || !billAmount || parseFloat(billAmount) <= 0}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Pay Bill"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

