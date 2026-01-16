"use client";

import { useState } from "react";
import { useWalletBalance, usePayoutTransactions } from "@/lib/hooks/wallet";
import { WithdrawModal } from "@/components/wallet/withdraw-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  Send,
  Download,
  History as HistoryIcon,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet as WalletIcon,
} from "lucide-react";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString();
  } catch {
    return "Invalid date";
  }
};

export default function WalletPage() {
  const [selectedChain, setSelectedChain] = useState<"base" | "base-sepolia">("base-sepolia");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { balance, loading, error, refetch } = useWalletBalance({
    chain: selectedChain,
  });

  const {
    transactions,
    count: transactionCount,
    loading: loadingTransactions,
    refetch: refetchTransactions,
  } = usePayoutTransactions(selectedChain);

  const totalUSDC = balance?.balances.find((b) => b.asset === "USDC")?.convertedBalance || "0";
  const totalETH = balance?.balances.find((b) => b.asset === "ETH")?.convertedBalance || "0";
  const totalBalance = parseFloat(totalUSDC) + parseFloat(totalETH) * 2000; // Rough ETH to USD conversion

  const handleRefresh = () => {
    refetch();
    refetchTransactions();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your crypto balances</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || loadingTransactions}
          className="hover:bg-primary/10 hover:border-primary/50"
        >
          <RefreshCw
            className={cn("w-4 h-4 mr-2", (loading || loadingTransactions) && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Chain Selector */}
      <div className="flex gap-2">
        {(["base-sepolia", "base"] as const).map((chain) => (
          <Button
            key={chain}
            size="sm"
            variant={selectedChain === chain ? "default" : "outline"}
            onClick={() => setSelectedChain(chain)}
            className={cn(
              selectedChain === chain && "bg-primary hover:bg-primary/90 text-white"
            )}
          >
            {chain === "base" ? "Base Mainnet" : "Base Sepolia"}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/40 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading wallet balance...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">❌ {error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && balance && (
        <>
          {/* Total Balance Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <WalletIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${totalBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USDC Balance */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">USDC</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Stablecoin
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  ${parseFloat(totalUSDC).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalUSDC} USDC
                </p>
              </div>
            </div>

            {/* ETH Balance */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ETH</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    Crypto
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  {parseFloat(totalETH).toFixed(6)} ETH
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(parseFloat(totalETH) * 2000).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12"
              onClick={() => alert("Deposit feature coming soon!")}
            >
              <Download className="w-4 h-4 mr-2" />
              Deposit
            </Button>
          </div>

          {/* Transaction History */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <HistoryIcon className="w-5 h-5" />
                Recent Transactions
              </h3>
              {transactionCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {transactionCount}
                </Badge>
              )}
            </div>

            {loadingTransactions ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-muted-foreground text-sm">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No transactions yet</p>
                <p className="text-muted-foreground/70 text-xs mt-1">
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const statusIcon =
                    tx.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : tx.status === "pending" ? (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    );

                  const statusColor =
                    tx.status === "completed"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : tx.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20";

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Badge className={cn(statusColor, "text-xs")}>
                          {statusIcon}
                          <span className="ml-1 capitalize">{tx.status || "unknown"}</span>
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {tx.amount || "0"} {tx.token || "USDC"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.timestamp)}
                          </p>
                        </div>
                      </div>
                      {tx.txHash && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() =>
                            window.open(`https://basescan.org/tx/${tx.txHash}`, "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        chain={selectedChain}
        availableBalances={{
          usdc: totalUSDC,
          eth: totalETH,
        }}
        onSuccess={() => {
          handleRefresh();
          setTimeout(() => setIsWithdrawModalOpen(false), 2000);
        }}
      />
    </div>
  );
}
