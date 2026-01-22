export type TransactionType = "incoming" | "outgoing"

export interface Transaction {
  id: number
  type: TransactionType
  title: string
  amount: string
  date: string
  category: string
}

export const transactions: Transaction[] = [
  { id: 1, type: "incoming", title: "Received from Alice", amount: "+$500.00", date: "Today, 10:23 AM", category: "Transfer" },
  { id: 2, type: "outgoing", title: "Starbucks Coffee", amount: "-$5.40", date: "Yesterday, 3:12 PM", category: "Food & Drink" },
  { id: 3, type: "outgoing", title: "Uber Ride", amount: "-$12.50", date: "Yesterday, 8:45 AM", category: "Transport" },
  { id: 4, type: "incoming", title: "Salary Payment", amount: "+$2,500.00", date: "Jan 19, 2024", category: "Income" },
  { id: 5, type: "outgoing", title: "Netflix Subscription", amount: "-$15.99", date: "Jan 18, 2024", category: "Entertainment" },
  { id: 6, type: "incoming", title: "Refund - Amazon", amount: "+$45.20", date: "Jan 17, 2024", category: "Refund" },
  { id: 7, type: "outgoing", title: "Spotify Premium", amount: "-$9.99", date: "Jan 16, 2024", category: "Entertainment" },
  { id: 8, type: "outgoing", title: "Grocery Store", amount: "-$87.34", date: "Jan 15, 2024", category: "Food & Drink" },
  { id: 9, type: "incoming", title: "Freelance Payment", amount: "+$1,200.00", date: "Jan 14, 2024", category: "Income" },
  { id: 10, type: "outgoing", title: "Electric Bill", amount: "-$125.00", date: "Jan 13, 2024", category: "Utilities" },
  { id: 11, type: "outgoing", title: "Coffee Shop", amount: "-$6.75", date: "Jan 12, 2024", category: "Food & Drink" },
  { id: 12, type: "incoming", title: "Received from Bob", amount: "+$75.00", date: "Jan 11, 2024", category: "Transfer" },
]

export const RECENT_LIMIT = 5
