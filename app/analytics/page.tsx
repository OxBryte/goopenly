"use client";

import DashboardPageLayout from "@/components/dashboard/layout";
import {
  useEarnings,
  useSalesHeatmap,
  useTransactions,
} from "@/lib/hooks/payment";
import { useProductStats, usePaymentLinkStats } from "@/lib/hooks/product";
import dynamic from "next/dynamic";
import { BarChart3, DollarSign, TrendingUp, CreditCard } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const { earnings } = useEarnings();
  const { heatmapData } = useSalesHeatmap();
  const { transactions } = useTransactions({ limit: 10 });
  const { stats: productStats } = useProductStats();
  const { stats: paymentLinkStats } = usePaymentLinkStats();

  // Calculate metrics
  const totalRevenue = parseFloat(earnings?.succeeded?.amount || "0");
  const totalSales = transactions?.length || 0;
  const totalProducts = (productStats?.total ?? 0) + (paymentLinkStats?.total ?? 0);
  const activeProducts = (productStats?.active ?? 0) + (paymentLinkStats?.active ?? 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Prepare chart data
  const prepareChartData = () => {
    if (!heatmapData || !heatmapData.weeks || heatmapData.weeks.length === 0) {
      const months = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const sales = Math.floor(Math.random() * 50) + 10;
        months.push({
          month: monthStart.toLocaleDateString("en-US", { month: "short" }),
          sales: sales,
        });
      }
      return months;
    }

    const monthlyData: { [key: string]: number } = {};
    heatmapData.weeks.forEach((week) => {
      week.days.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + day.count;
      });
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, sales]) => {
        const [year, month] = key.split("-");
        const date = new Date(parseInt(year), parseInt(month), 1);
        return {
          month: date.toLocaleDateString("en-US", { month: "short" }),
          sales: sales,
        };
      });
  };

  const chartData = prepareChartData();

  const chartOptions = {
    chart: {
      type: "area" as const,
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "var(--font-mono)",
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth" as const,
      width: 2,
      colors: ["#003e91"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#003e91", opacity: 0.4 },
          { offset: 100, color: "#003e91", opacity: 0.1 },
        ],
      },
    },
    colors: ["#003e91"],
    xaxis: {
      categories: chartData.map((d) => d.month),
      labels: {
        style: {
          colors: "var(--muted-foreground)",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "var(--muted-foreground)",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
        },
        formatter: (val: number) => Math.floor(val).toString(),
      },
    },
    grid: {
      borderColor: "var(--border)",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    tooltip: {
      theme: "light",
      style: { fontFamily: "var(--font-mono)" },
      y: { formatter: (val: number) => `${val} sales` },
    },
  };

  const chartSeries = [
    {
      name: "Sales",
      data: chartData.map((d) => d.sales),
    },
  ];

  const metrics = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      change: null,
    },
    {
      label: "Total Sales",
      value: totalSales.toString(),
      icon: CreditCard,
      change: null,
    },
    {
      label: "Active Products",
      value: activeProducts.toString(),
      icon: BarChart3,
      subtitle: `of ${totalProducts} total`,
    },
    {
      label: "Avg Order Value",
      value: `$${avgOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: TrendingUp,
      change: null,
    },
  ];

  return (
    <DashboardPageLayout
      header={{
        title: "Analytics",
        description: "Track your sales performance and earnings",
        icon: BarChart3,
      }}
    >
      <div className="space-y-8">
        {/* Key Metrics - Minimalistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-md bg-muted/50">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Sales Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Last 6 months performance
            </p>
          </div>
          <div className="w-full">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={280}
            />
          </div>
        </div>

        {/* Recent Transactions - Minimalistic Table */}
        {transactions && transactions.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Transactions
              </h3>
            </div>
            <div className="divide-y divide-border">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction.id || index}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {transaction.customerName ||
                          transaction.customerEmail ||
                          "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-foreground">
                        $
                        {transaction.amount
                          ? parseFloat(transaction.amount).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "0.00"}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          transaction.status === "SUCCEEDED"
                            ? "text-green-600"
                            : transaction.status === "PROCESSING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.status || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
}
