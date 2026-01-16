/**
 * Payment Earnings Hook
 * Fetches payment intent earnings by status
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface EarningsStatus {
  amount: string;
  count: number;
}

export interface EarningsData {
  initiated: EarningsStatus;
  processing: EarningsStatus;
  succeeded: EarningsStatus;
  failed: EarningsStatus;
  cancelled: EarningsStatus;
  total: EarningsStatus;
}

interface UseEarningsReturn {
  earnings: EarningsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Dummy earnings data
const dummyEarnings: EarningsData = {
  initiated: { amount: "1500.00", count: 45 },
  processing: { amount: "250.00", count: 5 },
  succeeded: { amount: "12500.00", count: 120 },
  failed: { amount: "50.00", count: 2 },
  cancelled: { amount: "200.00", count: 8 },
  total: { amount: "14500.00", count: 180 },
};

export function useEarnings(): UseEarningsReturn {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setEarnings(dummyEarnings);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return {
    earnings,
    loading,
    error,
    refetch: fetchEarnings,
  };
}
