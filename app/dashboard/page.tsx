"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const displayBalance = "0.00";

  return (
    <div className="w-full mx-auto">
      {/* Account Balance Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <div className="flex items-top justify-start gap-4 mb-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
              ACCOUNT BALANCE:
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl font-bold text-foreground">
                {isBalanceVisible ? `$${displayBalance}` : "••••••"}
              </div>
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors"
                aria-label="Toggle balance visibility"
              >
                {isBalanceVisible ? (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Send Button */}
          <Button className="w-fit bg-foreground text-background hover:bg-foreground/90 h-11 rounded-full">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Send
          </Button>

          {/* Withdraw Button */}
          <Button
            variant="outline"
            className="w-fit border-border h-11 rounded-full"
          >
            Withdraw
          </Button>

          {/* More Options Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-border"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Chart 1: Transaction Volume Over Time */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Transaction Volume (Last 7 Days)
          </h3>
          <Chart
            options={{
              chart: {
                type: "area",
                height: 300,
                toolbar: { show: false },
                fontFamily: "Be Vietnam Pro, sans-serif",
              },
              dataLabels: { enabled: false },
              stroke: {
                curve: "smooth",
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
                },
              },
              colors: ["#003e91"],
              xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                labels: {
                  style: {
                    colors: "#6b7280",
                    fontSize: "12px",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    colors: "#6b7280",
                    fontSize: "12px",
                  },
                  formatter: (val: number) => `$${val.toFixed(0)}`,
                },
              },
              grid: {
                borderColor: "#e5e7eb",
                strokeDashArray: 4,
              },
              tooltip: {
                theme: "light",
                y: {
                  formatter: (val: number) => `$${val.toFixed(2)}`,
                },
              },
            }}
            series={[
              {
                name: "Volume",
                data: [1250, 1890, 2100, 1750, 2400, 1950, 2200],
              },
            ]}
            type="area"
            height={300}
          />
        </div>

        {/* Chart 2: Spending by Category */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Spending by Category
          </h3>
          <Chart
            options={{
              chart: {
                type: "donut",
                height: 300,
                fontFamily: "Be Vietnam Pro, sans-serif",
              },
              labels: ["Payments", "Fees", "Transfers", "Other"],
              colors: ["#003e91", "#0052cc", "#0066ff", "#3385ff"],
              legend: {
                position: "bottom",
                fontSize: "12px",
                fontFamily: "Be Vietnam Pro, sans-serif",
                labels: {
                  colors: "#0a0a0a",
                },
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val.toFixed(0)}%`,
                style: {
                  fontSize: "12px",
                  fontWeight: 600,
                },
              },
              tooltip: {
                y: {
                  formatter: (val: number, opts: any) => {
                    const total = opts.w.globals.seriesTotals.reduce(
                      (a: number, b: number) => a + b,
                      0
                    );
                    const percentage = ((val / total) * 100).toFixed(1);
                    return `$${val.toLocaleString()} (${percentage}%)`;
                  },
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: "65%",
                  },
                },
              },
            }}
            series={[4500, 1200, 800, 350]}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
