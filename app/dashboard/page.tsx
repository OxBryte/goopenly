"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  MoreVertical,
  Plus,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Category {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Spending", balance: 500.0, color: "#93c5fd" },
    { id: "2", name: "Feeding", balance: 300.0, color: "#86efac" },
    { id: "3", name: "Gadgets", balance: 750.0, color: "#fcd34d" },
  ]);

  // Dialog states
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const totalBalance = categories.reduce((sum, cat) => sum + cat.balance, 0);
  const displayBalance = totalBalance.toFixed(2);

  const categoryColors = [
    "#93c5fd", // Light Blue
    "#86efac", // Light Green
    "#fcd34d", // Light Amber
    "#fca5a5", // Light Red
    "#c4b5fd", // Light Purple
    "#f9a8d4", // Light Pink
    "#67e8f9", // Light Cyan
    "#bef264", // Light Lime
  ];

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      balance: 0,
      color: categoryColors[categories.length % categoryColors.length],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setCreateCategoryOpen(false);
  };

  const handleDeposit = () => {
    if (!selectedCategoryId || !depositAmount || parseFloat(depositAmount) <= 0)
      return;

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, balance: cat.balance + parseFloat(depositAmount) }
          : cat
      )
    );

    setDepositAmount("");
    setSelectedCategoryId("");
    setDepositOpen(false);
  };

  const handleWithdraw = () => {
    if (
      !selectedCategoryId ||
      !withdrawAmount ||
      parseFloat(withdrawAmount) <= 0
    )
      return;

    const category = categories.find((cat) => cat.id === selectedCategoryId);
    if (!category || category.balance < parseFloat(withdrawAmount)) {
      alert("Insufficient balance in this category");
      return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, balance: cat.balance - parseFloat(withdrawAmount) }
          : cat
      )
    );

    setWithdrawAmount("");
    setSelectedCategoryId("");
    setWithdrawOpen(false);
  };

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
          {/* Deposit Button */}
          <Button
            onClick={() => setDepositOpen(true)}
            className="w-fit bg-foreground text-background hover:bg-foreground/90 h-11 rounded-full"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>

          {/* Withdraw Button */}
          <Button
            onClick={() => setWithdrawOpen(true)}
            variant="outline"
            className="w-fit border-border h-11 rounded-full"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Withdraw
          </Button>

          {/* Create Category Button */}
          <Button
            onClick={() => setCreateCategoryOpen(true)}
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-border"
            aria-label="Create category"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <span className="text-sm text-muted-foreground">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No categories yet</p>
            <Button
              onClick={() => setCreateCategoryOpen(true)}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: category.color,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  ${category.balance.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((category.balance / totalBalance) * 100).toFixed(1)}% of
                  total
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Create Category Dialog */}
      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your funds (e.g., Spending,
              Feeding, Gadgets).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Spending, Feeding, Gadgets"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCategory();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateCategoryOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to Category</DialogTitle>
            <DialogDescription>
              Select a category and enter the amount you want to deposit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-category">Category</Label>
              <select
                id="deposit-category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (${cat.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount ($)</Label>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={
                !selectedCategoryId ||
                !depositAmount ||
                parseFloat(depositAmount) <= 0
              }
            >
              Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw from Category</DialogTitle>
            <DialogDescription>
              Select a category and enter the amount you want to withdraw.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-category">Category</Label>
              <select
                id="withdraw-category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories
                  .filter((cat) => cat.balance > 0)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (${cat.balance.toFixed(2)} available)
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount ($)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              {selectedCategoryId && (
                <p className="text-xs text-muted-foreground">
                  Available: $
                  {categories
                    .find((c) => c.id === selectedCategoryId)
                    ?.balance.toFixed(2) || "0.00"}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={
                !selectedCategoryId ||
                !withdrawAmount ||
                parseFloat(withdrawAmount) <= 0
              }
            >
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
