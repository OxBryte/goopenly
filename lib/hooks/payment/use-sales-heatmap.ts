/**
 * Sales Heatmap Hook
 * Fetches sales activity heatmap for the last 365 days
 * Dummy implementation - returns mock data
 */

import { useState, useEffect } from "react";

export interface DayData {
  date: string;
  dayOfWeek: number;
  dayName: string;
  amount: string;
  count: number;
}

export interface WeekData {
  weekStartDate: string;
  days: DayData[];
}

export interface SalesHeatmapData {
  weeks: WeekData[];
  summary: {
    totalSales: string;
    avgDailySales: string;
    bestDay: DayData;
  };
  metadata: {
    startDate: string;
    endDate: string;
    totalDays: number;
    totalWeeks: number;
  };
}

export interface SalesHeatmapResponse {
  ok: boolean;
  message: string;
  data: SalesHeatmapData;
}

interface UseSalesHeatmapReturn {
  heatmapData: SalesHeatmapData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Generate dummy heatmap data
const generateDummyHeatmap = (): SalesHeatmapData => {
  const weeks: WeekData[] = [];
  const today = new Date();
  
  // Generate last 52 weeks
  for (let i = 0; i < 52; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (52 - i) * 7);
    
    const days: DayData[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: d,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: (Math.random() * 1000).toFixed(2),
        count: Math.floor(Math.random() * 10),
      });
    }
    
    weeks.push({
      weekStartDate: weekStart.toISOString().split('T')[0],
      days,
    });
  }

  const allDays = weeks.flatMap(w => w.days);
  const bestDay = allDays.reduce((max, day) => 
    parseInt(day.count) > parseInt(max.count) ? day : max
  );

  return {
    weeks,
    summary: {
      totalSales: "14500.00",
      avgDailySales: "39.73",
      bestDay,
    },
    metadata: {
      startDate: weeks[0].weekStartDate,
      endDate: weeks[weeks.length - 1].weekStartDate,
      totalDays: 365,
      totalWeeks: 52,
    },
  };
};

export function useSalesHeatmap(): UseSalesHeatmapReturn {
  const [heatmapData, setHeatmapData] = useState<SalesHeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeatmap = async () => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setHeatmapData(generateDummyHeatmap());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  return {
    heatmapData,
    loading,
    error,
    refetch: fetchHeatmap,
  };
}
