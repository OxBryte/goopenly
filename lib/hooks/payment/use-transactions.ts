/**
 * Payment Transactions Hook
 * Fetches payment intent transactions with pagination
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface Transaction {
  id: string;
  paymentIntentId: string | null;
  productId: string | null;
  slug: string | null;
  amount: string | null;
  currency: string | null;
  status: "INITIATED" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  customerName: string | null;
  customerEmail: string | null;
  paymentMethodTypes: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TransactionsResponse {
  ok: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: Pagination;
  };
}

interface UseTransactionsOptions {
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fetchPage: (page: number) => void;
}

// Generate dummy transactions
const generateDummyTransactions = (limit: number): Transaction[] => {
  const statuses: Transaction["status"][] = ["SUCCEEDED", "PROCESSING", "FAILED"];
  const names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"];
  const emails = ["john@example.com", "jane@example.com", "bob@example.com", "alice@example.com", "charlie@example.com"];
  
  return Array.from({ length: limit }, (_, i) => ({
    id: `tx_${Date.now()}_${i}`,
    paymentIntentId: `pi_${Date.now()}_${i}`,
    productId: `prod_${i + 1}`,
    slug: `product-${i + 1}`,
    amount: (Math.random() * 1000 + 10).toFixed(2),
    currency: "USD",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    customerName: names[i % names.length],
    customerEmail: emails[i % emails.length],
    paymentMethodTypes: ["card"],
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export function useTransactions(
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const { page = 1, limit = 10, autoFetch = true } = options;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (pageNum: number = currentPage) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const dummyTransactions = generateDummyTransactions(limit);
      setTransactions(dummyTransactions);
      setPagination({
        page: pageNum,
        limit,
        total: 50,
        totalPages: Math.ceil(50 / limit),
      });
      setCurrentPage(pageNum);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, []);

  return {
    transactions,
    pagination,
    loading,
    error,
    refetch: () => fetchTransactions(currentPage),
    fetchPage: fetchTransactions,
  };
}
