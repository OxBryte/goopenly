/**
 * Payout Transactions Hook
 * Fetches wallet payout transactions for a specific chain
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

// API Response structure
interface PayoutTransactionAPI {
  transactionId: string;
  hash: string;
  asset: string;
  chain: string;
  reference: string;
  amount?: string;
  status?: string;
  createdAt?: string;
  timestamp?: string;
}

// Component structure
export interface PayoutTransaction {
  id: string;
  amount: string;
  token: string;
  status: string;
  txHash?: string;
  timestamp: string;
}

interface PayoutTransactionsDataAPI {
  transactions: PayoutTransactionAPI[];
  count: number;
  chain: string;
}

interface PayoutTransactionsResponse {
  ok: boolean;
  message: string;
  data: PayoutTransactionsDataAPI;
}

// Helper function to map API response to component structure
function mapTransactionAPIToComponent(tx: any): PayoutTransaction {
  // Log all available fields for debugging
  console.log("📊 Transaction fields available:", Object.keys(tx));
  
  return {
    id: tx.transactionId || tx.id || "unknown",
    amount: tx.amount || tx.value || "0", // Try multiple field names
    token: tx.asset || tx.token || tx.currency || "USDC",
    status: tx.status || "completed", // Default to completed if not provided
    txHash: tx.hash || tx.txHash || tx.transactionHash,
    timestamp: tx.timestamp || tx.createdAt || tx.created_at || new Date().toISOString(),
  };
}

interface UsePayoutTransactionsReturn {
  transactions: PayoutTransaction[];
  count: number;
  chain: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Generate dummy transactions
const generateDummyTransactions = (chain: string): PayoutTransaction[] => {
  const statuses = ["completed", "pending", "failed"];
  const tokens = ["USDC", "ETH"];
  
  return [
    {
      id: "1",
      amount: "150.00",
      token: "USDC",
      status: "completed",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      amount: "75.50",
      token: "USDC",
      status: "pending",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      amount: "0.05",
      token: "ETH",
      status: "completed",
      txHash: "0x9876543210fedcba9876543210fedcba98765432",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      amount: "200.00",
      token: "USDC",
      status: "completed",
      txHash: "0xfedcba0987654321fedcba0987654321fedcba09",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export function usePayoutTransactions(
  chain: string
): UsePayoutTransactionsReturn {
  const [transactions, setTransactions] = useState<PayoutTransaction[]>([]);
  const [count, setCount] = useState(0);
  const [chainState, setChainState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!chain) {
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const dummyTransactions = generateDummyTransactions(chain);
      setTransactions(dummyTransactions);
      setCount(dummyTransactions.length);
      setChainState(chain);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchTransactions();
  }, [chain]);

  return {
    transactions,
    count,
    chain: chainState,
    loading,
    error,
    refetch: fetchTransactions,
  };
}
