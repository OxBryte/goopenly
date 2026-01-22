"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react"
import { transactions } from "@/lib/data/transactions"

export default function ActivityPage() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = transactions.filter((tx) => {
    if (filter === "all") return true
    return tx.type === filter
  })

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-pink-50/30 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative max-w-2xl mx-auto px-6 py-6">
        {/* Header */}
        <header
          className={`flex items-center gap-4 mb-6 ${mounted ? "animate-slide-down" : "opacity-0"}`}
        >
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">All Activity</h1>
            <p className="text-sm text-gray-500">{transactions.length} transactions</p>
          </div>
        </header>

        {/* Filters */}
        <div
          className={`flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide ${mounted ? "animate-slide-down delay-100" : "opacity-0"}`}
        >
          {(["all", "incoming", "outgoing"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {f === "all" ? "All" : f === "incoming" ? "Incoming" : "Outgoing"}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${mounted ? "animate-slide-down delay-200" : "opacity-0"}`}
        >
          <div className="divide-y divide-gray-100">
            {filtered.map((tx, index) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer group/item"
                style={{
                  animation: mounted ? `slide-down 0.5s ease-out ${index * 0.05}s both` : undefined,
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`p-2.5 rounded-lg flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6 ${
                      tx.type === "incoming"
                        ? "bg-green-50 text-green-600 group-hover/item:bg-green-100"
                        : "bg-gray-100 text-gray-700 group-hover/item:bg-gray-200"
                    }`}
                  >
                    {tx.type === "incoming" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500">{tx.date}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{tx.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      tx.type === "incoming" ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {tx.amount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No {filter !== "all" ? filter : ""} transactions found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
