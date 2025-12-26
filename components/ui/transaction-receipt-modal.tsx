"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Copy, 
  CheckCircle, 
  Clock, 
  XCircle, 
  CreditCard,
  User,
  Calendar,
  Hash,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  product: string;
  paymentMethod?: string;
  transactionFee?: number;
  netAmount?: number;
  description?: string;
}

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionReceiptModal({ 
  isOpen, 
  onClose, 
  transaction 
}: TransactionReceiptModalProps) {
  if (!transaction) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id);
    toast.success("Transaction ID copied to clipboard");
  };

  const handleDownloadReceipt = () => {
    // Create a simple receipt text
    const receiptText = `
TRANSACTION RECEIPT
==================
Transaction ID: ${transaction.id}
Customer: ${transaction.customer}
Amount: $${transaction.amount.toFixed(2)}
Status: ${transaction.status.toUpperCase()}
Product: ${transaction.product}
Date: ${transaction.date}
Payment Method: ${transaction.paymentMethod || "Credit Card"}
${transaction.transactionFee ? `Transaction Fee: $${transaction.transactionFee.toFixed(2)}` : ""}
${transaction.netAmount ? `Net Amount: $${transaction.netAmount.toFixed(2)}` : ""}
    `.trim();

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-background backdrop-blur-lg border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Transaction Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              {getStatusIcon(transaction.status)}
              <div>
                <p className="font-semibold text-foreground">Payment {transaction.status}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status.toUpperCase()}
            </Badge>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Transaction ID</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
                  {transaction.id}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyTransactionId}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">Customer</span>
              </div>
              <span className="text-foreground font-medium">{transaction.customer}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Amount</span>
              </div>
              <span className="text-foreground font-bold text-lg">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Product</span>
              </div>
              <span className="text-foreground font-medium">{transaction.product}</span>
            </div>

            {transaction.paymentMethod && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Payment Method</span>
                </div>
                <span className="text-foreground font-medium">{transaction.paymentMethod}</span>
              </div>
            )}

            {transaction.transactionFee && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Transaction Fee</span>
                </div>
                <span className="text-foreground font-medium">
                  ${transaction.transactionFee.toFixed(2)}
                </span>
              </div>
            )}

            {transaction.netAmount && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Net Amount</span>
                </div>
                <span className="text-foreground font-medium">
                  ${transaction.netAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
