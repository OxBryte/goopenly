/**
 * Payment Link Stats Hook
 * Fetches payment link statistics for authenticated user
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface PaymentLinkStats {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
}

interface PaymentLinkStatsResponse {
  ok: boolean;
  message: string;
  data: PaymentLinkStats;
}

interface UsePaymentLinkStatsReturn {
  stats: PaymentLinkStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const dummyPaymentLinkStats: PaymentLinkStats = {
  total: 15,
  active: 12,
  expired: 2,
  cancelled: 1,
};

export function usePaymentLinkStats(): UsePaymentLinkStatsReturn {
  const [stats, setStats] = useState<PaymentLinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setStats(dummyPaymentLinkStats);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
