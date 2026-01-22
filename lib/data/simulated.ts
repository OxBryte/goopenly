/**
 * Central simulated data for dashboard, profile, KYC, etc.
 */

export const CURRENCIES = ["USD", "EUR", "NGN", "GBP"] as const
export type Currency = (typeof CURRENCIES)[number]

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  NGN: "₦",
  GBP: "£",
}

export const currencyLabels: Record<Currency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  NGN: "Nigerian Naira",
  GBP: "British Pound",
}

export const balanceByCurrency: Record<Currency, string> = {
  USD: "50,121.21",
  EUR: "46,250.50",
  NGN: "45,000,000.00",
  GBP: "39,450.75",
}

export const conversionRates: Record<Currency, Record<Currency, number>> = {
  USD: { USD: 1, EUR: 0.85, NGN: 750, GBP: 0.79 },
  EUR: { USD: 1.18, NGN: 882, GBP: 0.93, EUR: 1 },
  NGN: { USD: 0.0013, EUR: 0.0011, GBP: 0.0011, NGN: 1 },
  GBP: { USD: 1.27, EUR: 1.07, NGN: 949, GBP: 1 },
}

export const accountDetails = {
  accountNumber: "****1234",
  fullAccountNumber: "4080123456789012",
  bankName: "Goopenly Bank",
  accountType: "Savings",
  status: "Active" as const,
  routingNumber: "021000021",
  swiftCode: "GOOPUS33",
}

export const billProviders = [
  { value: "Electricity", label: "Electricity Company" },
  { value: "Water", label: "Water Department" },
  { value: "Internet", label: "Internet Service" },
  { value: "Phone", label: "Phone Service" },
  { value: "Gas", label: "Gas Utility" },
  { value: "Other", label: "Other" },
] as const
