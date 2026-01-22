"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
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
import { SuccessModal } from "@/components/ui/success-modal"
import { accountDetails, conversionRates, currencySymbols } from "@/lib/data/simulated"

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
    const [accountDialogOpen, setAccountDialogOpen] = useState(false)
    const [convertDialogOpen, setConvertDialogOpen] = useState(false)
    const [successDialogOpen, setSuccessDialogOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    
    const [recipientAddress, setRecipientAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    
    // Convert currency states
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("EUR")
    const [convertAmount, setConvertAmount] = useState("")
    const [convertedAmount, setConvertedAmount] = useState("")

    const handleActionClick = (action: string) => {
        if (action === "send") {
            setSendDialogOpen(true)
        } else if (action === "account") {
            setAccountDialogOpen(true)
        } else if (action === "convert") {
            setConvertDialogOpen(true)
        }
    }

    const handleSend = async () => {
        const amt = parseFloat(amount)
        if (!recipientAddress.trim()) {
            toast.error("Please enter a recipient address")
            return
        }
        if (!amount || amt <= 0) {
            toast.error("Please enter a valid amount greater than 0")
            return
        }

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setSuccessMessage(`Successfully sent $${amt.toFixed(2)} to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`)
        setSendDialogOpen(false)
        setRecipientAddress("")
        setAmount("")
        setIsLoading(false)
        setSuccessDialogOpen(true)
        setTimeout(() => setSuccessDialogOpen(false), 3000)
    }

    const handleConvert = async () => {
        const amt = parseFloat(convertAmount)
        if (!convertAmount || amt <= 0) {
            toast.error("Please enter a valid amount greater than 0")
            return
        }

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const rate = conversionRates[fromCurrency as keyof typeof conversionRates]?.[toCurrency as keyof typeof conversionRates] ?? 1
        const result = (amt * rate).toFixed(2)
        setConvertedAmount(result)
        setIsLoading(false)
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {actions.map((action, index) => (
                    <div
                        key={action.label}
                        className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all duration-300 active:scale-[0.95] transform group relative overflow-hidden"
                        onClick={() => handleActionClick(action.action)}
                        style={{
                            animation: `slide-down 0.6s ease-out ${index * 0.1}s both`
                        }}
                    >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="relative flex flex-col items-center justify-center text-center">
                            <div className={`mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${action.color}`}>
                                {typeof action.icon === 'function' ? <action.icon /> : <action.icon size={24} />}
                            </div>
                            <span className="text-xs font-medium text-gray-900 leading-tight transition-all duration-300 group-hover:text-primary">{action.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Success Dialog */}
            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent>
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-lg mb-2">Success!</DialogTitle>
                        <p className="text-sm text-gray-600">{successMessage}</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Send Money Dialog */}
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <DialogContent className="sm:max-w-md">
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
                                className="font-mono"
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
                            onClick={() => {
                                setSendDialogOpen(false)
                                setRecipientAddress("")
                                setAmount("")
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !recipientAddress.trim() || !amount || parseFloat(amount) <= 0}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Account Details Dialog */}
            <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Account Details</DialogTitle>
                        <DialogDescription>
                            Your account information and settings
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Account Number</span>
                                <span className="text-sm font-mono font-medium text-gray-900">****1234</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Bank Name</span>
                                <span className="text-sm font-medium text-gray-900">Goopenly Bank</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Account Type</span>
                                <span className="text-sm font-medium text-gray-900">Savings</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Status</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAccountDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            navigator.clipboard.writeText("****1234")
                            setSuccessMessage("Account number copied to clipboard!")
                            setSuccessDialogOpen(true)
                            setTimeout(() => setSuccessDialogOpen(false), 2000)
                        }}>
                            Copy Account Number
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Convert Currency Dialog */}
            <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Convert Currency</DialogTitle>
                        <DialogDescription>
                            Convert between different currencies
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>From</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="NGN">NGN - Nigerian Naira</option>
                                <option value="GBP">GBP - British Pound</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                value={convertAmount}
                                onChange={(e) => {
                                    setConvertAmount(e.target.value)
                                    setConvertedAmount("")
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-center py-2">
                            <button
                                onClick={() => {
                                    const temp = fromCurrency
                                    setFromCurrency(toCurrency)
                                    setToCurrency(temp)
                                    setConvertedAmount("")
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                <ArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <Label>To</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="NGN">NGN - Nigerian Naira</option>
                                <option value="GBP">GBP - British Pound</option>
                            </select>
                        </div>
                        {convertedAmount && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="text-sm text-green-600 mb-1">Converted Amount</div>
                                <div className="text-2xl font-bold text-green-700">
                                    {toCurrency === "USD" ? "$" : toCurrency === "EUR" ? "€" : toCurrency === "NGN" ? "₦" : "£"}
                                    {convertedAmount}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setConvertDialogOpen(false)
                                setConvertAmount("")
                                setConvertedAmount("")
                            }}
                            disabled={isLoading}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleConvert}
                            disabled={isLoading || !convertAmount || parseFloat(convertAmount) <= 0}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                "Convert"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
