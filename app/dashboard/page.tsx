"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  BarChart3,
  Package,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ProductLinkModal } from "@/components/payment/product-link-modal";
import { PaymentLinkCreatorModal } from "@/components/ui/payment-link-creator-modal";
import {
  useEarnings,
  useSalesHeatmap,
} from "@/lib/hooks/payment";
import { useProductStats, usePaymentLinkStats } from "@/lib/hooks/product";
import { useWalletBalance } from "@/lib/hooks/wallet/use-wallet-balance";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isProductLinkModalOpen, setIsProductLinkModalOpen] = useState(false);

  // Fetch real data from API
  const { earnings } = useEarnings();
  const { heatmapData } = useSalesHeatmap();
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
  const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003e91]/40 border-t-[#003e91] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access the dashboard.
          </p>
          <Button onClick={() => router.push("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6 mx-auto">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Welcome back, {user.firstName || user.username}!
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto whitespace-nowrap font-semibold"
              onClick={() => setIsPaymentLinkModalOpen(true)}
            >
              Create Payment Link
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted w-full sm:w-auto whitespace-nowrap"
              onClick={() => setIsProductLinkModalOpen(true)}
            >
              Create Product Link
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-green-500/10 border border-green-500/20 p-3 sm:p-4 rounded-md flex flex-col gap-2 sm:gap-4 h-28 sm:h-32 justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">
              {balanceLoading ? (
                <span className="text-base">Loading...</span>
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
            <div className="text-muted-foreground text-xs sm:text-sm">
              Wallet Balance
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

        {/* Sales Trend Chart */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 px-1">
            Sales Trend (Last 6 Months)
          </h2>
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6">
            {(() => {
              // Prepare chart data from heatmap data
              const prepareChartData = () => {
                if (!heatmapData || !heatmapData.weeks || heatmapData.weeks.length === 0) {
                  // Generate demo data for last 6 months (monthly aggregation)
                  const months = [];
                  const today = new Date();
                  for (let i = 5; i >= 0; i--) {
                    const date = new Date(today);
                    date.setMonth(date.getMonth() - i);
                    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    
                    // Generate random sales for demo
                    const sales = Math.floor(Math.random() * 50) + 10;
                    months.push({
                      month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                      sales: sales,
                      date: monthStart,
                    });
                  }
                  return months;
                }

                // Aggregate heatmap data by month
                const monthlyData: { [key: string]: { sales: number; date: Date } } = {};
                
                heatmapData.weeks.forEach((week) => {
                  week.days.forEach((day) => {
                    const date = new Date(day.date);
                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                    
                    if (!monthlyData[monthKey]) {
                      monthlyData[monthKey] = {
                        sales: 0,
                        date: new Date(date.getFullYear(), date.getMonth(), 1),
                      };
                    }
                    monthlyData[monthKey].sales += day.count;
                  });
                });

                // Convert to array and sort by date
                return Object.values(monthlyData)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((item) => ({
                    month: item.date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    sales: item.sales,
                    date: item.date,
                  }));
              };

              const chartData = prepareChartData();
              
              const chartOptions = {
                chart: {
                  type: "area" as const,
                  height: 300,
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                  fontFamily: "var(--font-mono)",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth" as const,
                  width: 3,
                  colors: ["#003e91"],
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                    stops: [0, 100],
                    colorStops: [
                      {
                        offset: 0,
                        color: "#003e91",
                        opacity: 0.7,
                      },
                      {
                        offset: 100,
                        color: "#003e91",
                        opacity: 0.2,
                      },
                    ],
                  },
                },
                colors: ["#003e91"],
                xaxis: {
                  categories: chartData.map((d) => d.month),
                  labels: {
                    style: {
                      colors: "var(--muted-foreground)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                    },
                  },
                  axisBorder: {
                    show: false,
                  },
                  axisTicks: {
                    show: false,
                  },
                },
                yaxis: {
                  labels: {
                    style: {
                      colors: "var(--muted-foreground)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                    },
                    formatter: (val: number) => Math.floor(val).toString(),
                  },
                },
                grid: {
                  borderColor: "var(--border)",
                  strokeDashArray: 4,
                  xaxis: {
                    lines: {
                      show: false,
                    },
                  },
                  yaxis: {
                    lines: {
                      show: true,
                    },
                  },
                  padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  },
                },
                tooltip: {
                  theme: "light",
                  style: {
                    fontFamily: "var(--font-mono)",
                  },
                  y: {
                    formatter: (val: number) => `${val} sales`,
                  },
                },
                markers: {
                  size: 4,
                  colors: ["#003e91"],
                  strokeColors: "#ffffff",
                  strokeWidth: 2,
                  hover: {
                    size: 6,
                  },
                },
              };

              const chartSeries = [
                {
                  name: "Sales",
                  data: chartData.map((d) => d.sales),
                },
              ];

              return (
                <div className="w-full">
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height={300}
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Total Sales: {chartData.reduce((sum, d) => sum + d.sales, 0)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {Math.round(chartData.reduce((sum, d) => sum + d.sales, 0) / chartData.length)} sales/month
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Latest Transactions and Product Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Latest Transactions */}
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                      Latest Transactions
                    </h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Recent payment activity
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-xs sm:text-sm flex-shrink-0"
                  onClick={() => router.push("/transactions")}
                >
                  View All
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {displayTransactions.length > 0 ? (
                <div className="space-y-3">
                  {displayTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      onClick={() => handleTransactionClick(transaction)}
                      className="group flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted hover:border-primary/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        {/* Status Indicator Dot */}
                        <div className="flex items-center justify-center flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transaction.status === "completed"
                                ? "bg-green-400"
                                : transaction.status === "pending"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-foreground font-semibold text-xs sm:text-sm truncate">
                              {transaction.customer}
                            </p>
                            <span
                              className={`text-[10px] sm:text-xs font-medium capitalize ${
                                transaction.status === "completed"
                                  ? "text-green-600"
                                  : transaction.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              • {transaction.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-[10px] sm:text-xs mb-0.5 truncate">
                            {transaction.product}
                          </p>
                          <p className="text-muted-foreground/70 text-[10px] sm:text-xs truncate">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-foreground font-bold text-sm sm:text-base whitespace-nowrap">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground/70 text-[10px] sm:text-xs">
                          {transaction.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 text-muted-foreground">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm">
                    Start selling to see your transaction history here. Create
                    your first product or payment link to get started.
                  </p>
                  <Button
                    onClick={() => setIsPaymentLinkModalOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create Payment Link
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Product Performance Analytics */}
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    Product Performance
                  </h3>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    Sales performance by product
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-6"></div>
          </div>
        </div>
      </div>

      {/* Product Link Modal */}
      <ProductLinkModal
        isOpen={isProductLinkModalOpen}
        onClose={() => setIsProductLinkModalOpen(false)}
        onSuccess={(product: any) => {
          setIsProductLinkModalOpen(false);
        }}
      />

      {/* Transaction Receipt Modal */}
      <TransactionReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={selectedTransaction}
      />

      {/* Payment Link Creator Modal */}
      <PaymentLinkCreatorModal
        isOpen={isPaymentLinkModalOpen}
        onClose={() => setIsPaymentLinkModalOpen(false)}
        onSuccess={(paymentLink) => {
          setIsPaymentLinkModalOpen(false);
        }}
      />
    </>
  );
}
