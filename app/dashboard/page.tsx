"use client";

import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import MonkeyIcon from "@/components/icons/monkey";
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
        <div className="w-full">
          <h1 className="text-lg sm:text-xl font-bold text-foreground">
            Welcome back, {user.firstName || user.username}!
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
                    {user?.firstName || user?.username || "User"}
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

      </div>
    </>
  );
}
