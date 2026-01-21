"use client"

interface CurrencySelectorProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
}

const currencies = [
  { code: "USD", flag: "🇺🇸", name: "USD" },
  { code: "EUR", flag: "🇪🇺", name: "EUR" },
  { code: "NGN", flag: "🇳🇬", name: "NGN" },
  { code: "GBP", flag: "🇬🇧", name: "GBP" },
]

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onCurrencyChange(currency.code)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all whitespace-nowrap ${
            selectedCurrency === currency.code
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className="text-lg">{currency.flag}</span>
          <span className="text-sm font-medium">{currency.name}</span>
        </button>
      ))}
    </div>
  )
}
