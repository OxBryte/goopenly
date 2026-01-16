/**
 * Wallet Balance Hook
 * Fetches wallet balance
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface BalanceItem {
  convertedBalance: string;
  chain: string;
  asset: string;
}

export interface WalletBalanceData {
  balances: BalanceItem[];
  chain: string;
  userId: string;
  timestamp: string;
}

interface WalletBalanceResponse {
  ok: boolean;
  message: string;
  data: WalletBalanceData;
}

interface UseWalletBalanceOptions {
  chain?: "base" | "base-sepolia";
  autoFetch?: boolean;
}

interface UseWalletBalanceReturn {
  balance: WalletBalanceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const dummyBalance: WalletBalanceData = {
  balances: [
    {
      convertedBalance: "12500.50",
      chain: "base-sepolia",
      asset: "USDC",
    },
    {
      convertedBalance: "0.25",
      chain: "base-sepolia",
      asset: "ETH",
    },
  ],
  chain: "base-sepolia",
  userId: "dummy-user-id",
  timestamp: new Date().toISOString(),
};

export function useWalletBalance(
  options: UseWalletBalanceOptions = {}
): UseWalletBalanceReturn {
  const { chain = "base-sepolia", autoFetch = true } = options;
  const [balance, setBalance] = useState<WalletBalanceData | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setBalance({ ...dummyBalance, chain });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchBalance();
    }
  }, [chain]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  };
}
