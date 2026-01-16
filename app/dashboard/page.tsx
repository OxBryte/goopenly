"use client";

import MonkeyIcon from "@/components/icons/monkey";
import { useEarnings } from "@/lib/hooks/payment";
import { useProductStats, usePaymentLinkStats } from "@/lib/hooks/product";
import { useWalletBalance } from "@/lib/hooks/wallet/use-wallet-balance";

export default function DashboardPage() {
  // Fetch real data from API
  const { earnings } = useEarnings();
  const { stats: productStats } = useProductStats();
  const { stats: paymentLinkStats } = usePaymentLinkStats();
  const { balance, loading: balanceLoading } = useWalletBalance({
    chain: "base-sepolia",
    autoFetch: true,
  });

  // Calculate combined stats
  const totalLinks =
    (productStats?.total ?? 0) + (paymentLinkStats?.total ?? 0);
  const activeLinks =
    (productStats?.active ?? 0) + (paymentLinkStats?.active ?? 0);

  return (
    <>
      <div className="w-full space-y-6 mx-auto">
        {/* Header */}
        <div className="w-full">
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Welcome back!
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Wallet Balance Card - Credit Card Design */}
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 border border-primary/30 p-4 sm:p-5 rounded-xl shadow-lg overflow-hidden col-span-2 lg:col-span-1">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            {/* Card Content */}
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                    <MonkeyIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">Openly</span>
                </div>
                {/* Card Chip */}
                <div className="w-10 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-md border border-white/20 flex items-center justify-center">
                  <div className="w-6 h-4 bg-gradient-to-br from-white/40 to-white/20 rounded-sm"></div>
                </div>
              </div>

              {/* Middle Section - Balance */}
              <div className="mb-4">
                <div className="text-white/70 text-xs sm:text-sm mb-2 font-medium tracking-wider uppercase">
                  Wallet Balance
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {balanceLoading ? (
                    <span className="text-lg">Loading...</span>
                  ) : balance?.balances && balance.balances.length > 0 ? (
                    `$${parseFloat(
                      balance.balances[1].convertedBalance
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  ) : (
                    "$0.00"
                  )}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex flex-col">
                  <div className="text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Cardholder
                  </div>
                  <div className="text-white text-sm font-semibold">
                    User
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Valid
                  </div>
                  <div className="text-white text-sm font-semibold">
                    ∞
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Total Revenue Card */}
          <div className="bg-card border border-border p-3 sm:p-4 rounded-md flex flex-col gap-2 sm:gap-4 h-28 sm:h-32 justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              $
              {parseFloat(earnings?.succeeded?.amount || "0").toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              Total Revenue
            </div>
          </div>

          {/* Active Links Card */}
          <div className="bg-card border border-border p-3 sm:p-4 rounded-md flex flex-col gap-2 sm:gap-4 h-28 sm:h-32 justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {activeLinks}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              Active links
            </div>
          </div>
          {/* Total Links Card */}
          <div className="bg-card border border-border p-3 sm:p-4 rounded-md flex flex-col gap-2 sm:gap-4 h-28 sm:h-32 justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">
              {totalLinks}
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm">
              Total links
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
