"use client"

import { CURRENCIES, currencyFlags } from "@/lib/data/simulated"

interface CurrencySelectorProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {CURRENCIES.map((code) => (
        <button
          key={code}
          onClick={() => onCurrencyChange(code)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
            selectedCurrency === currency.code
              ? "bg-primary text-white border-primary shadow-md scale-105"
              : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:shadow-sm"
          }`}
        >
          <span className="text-lg">{currency.flag}</span>
          <span className="text-sm font-medium">{currency.name}</span>
        </button>
      ))}
    </div>
  )
}
