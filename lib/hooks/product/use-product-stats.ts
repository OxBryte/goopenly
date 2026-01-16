/**
 * Product Stats Hook
 * Fetches product statistics for authenticated user
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface ProductStats {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
}

interface ProductStatsResponse {
  ok: boolean;
  message: string;
  data: ProductStats;
}

interface UseProductStatsReturn {
  stats: ProductStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const dummyProductStats: ProductStats = {
  total: 24,
  active: 18,
  expired: 4,
  cancelled: 2,
};

export function useProductStats(): UseProductStatsReturn {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setStats(dummyProductStats);
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
