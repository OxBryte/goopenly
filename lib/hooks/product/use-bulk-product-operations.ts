/**
 * Bulk Product Operations Hook
 * Handles bulk product creation, updates, and analytics gathering
 */

import { useState } from "react";
import { apiClient, ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export interface BulkProductCreate {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  image?: string;
  metadata?: Record<string, any>;
}

export interface BulkProductUpdate {
  productId: string;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  image?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface BulkProductResult {
  success: boolean;
  productId?: string;
  title?: string;
  error?: string;
}

export interface BulkAnalyticsQuery {
  productId?: string;
  startDate?: string;
  endDate?: string;
  metrics?: ("payments" | "amounts" | "trends")[];
}

export interface BulkAnalyticsResult {
  productId?: string;
  paymentsCount?: number;
  paymentsAmount?: number;
  trendsData?: any[];
  error?: string;
}

interface UseBulkProductOperationsReturn {
  loading: boolean;
  error: string | null;
  bulkCreateProducts: (
    products: BulkProductCreate[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: BulkProductResult[];
    stats: { successful: number; failed: number };
  }>;
  bulkUpdateProducts: (
    updates: BulkProductUpdate[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: BulkProductResult[];
    stats: { successful: number; failed: number };
  }>;
  bulkGetAnalytics: (
    analyticsQueries: BulkAnalyticsQuery[]
  ) => Promise<{
    results: BulkAnalyticsResult[];
    stats: { totalPayments: number; totalAmount: number; productsAnalyzed: number };
  }>;
}

/**
 * Hook for bulk product operations
 * Supports bulk creation, updates, and analytics gathering
 */
export function useBulkProductOperations(): UseBulkProductOperationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create multiple products in batch
   * Limits: Maximum 15 products per batch
   */
  const bulkCreateProducts = async (
    products: BulkProductCreate[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: BulkProductResult[];
    stats: { successful: number; failed: number };
  }> => {
    if (products.length === 0) {
      throw new Error("No products provided");
    }

    if (products.length > 15) {
      throw new Error("Maximum 15 products per bulk creation");
    }

    setLoading(true);
    setError(null);

    const results: BulkProductResult[] = [];
    let successful = 0;
    let failed = 0;

    toast.loading(`Creating ${products.length} products...`, {
      id: "bulk-product-creation",
    });

    try {
      // Process product creation sequentially to maintain order and avoid conflicts
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        try {
          const response = await apiClient.post<{
            ok: boolean;
            message: string;
            data: { productId: string };
            requestId: string;
          }>("/protected/product", {
            title: product.title,
            description: product.description,
            amount: product.amount,
            currency: product.currency || "USD",
            image: product.image,
            metadata: product.metadata,
          });

          if (response.ok && response.data.productId) {
            successful++;

            results[i] = {
              success: true,
              productId: response.data.productId,
              title: product.title,
            };
          } else {
            throw new Error(response.message || "Product creation failed");
          }
        } catch (err) {
          failed++;

          const errorMessage = err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unknown error";

          results[i] = {
            success: false,
            title: product.title,
            error: errorMessage,
          };
        }

        // Update progress
        if (onProgress) {
          onProgress(i + 1, products.length);
        }
      }

      toast.success(`Bulk product creation complete: ${successful}/${products.length} successful`, {
        id: "bulk-product-creation",
      });

      return {
        results,
        stats: { successful, failed }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk product creation failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-product-creation" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update multiple products in batch
   * Limits: Maximum 20 product updates per batch
   */
  const bulkUpdateProducts = async (
    updates: BulkProductUpdate[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: BulkProductResult[];
    stats: { successful: number; failed: number };
  }> => {
    if (updates.length === 0) {
      throw new Error("No product updates provided");
    }

    if (updates.length > 20) {
      throw new Error("Maximum 20 product updates per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkProductResult[] = [];
    let successful = 0;
    let failed = 0;

    toast.loading(`Updating ${updates.length} products...`, {
      id: "bulk-product-update",
    });

    try {
      // Process updates with controlled concurrency (max 3 concurrent)
      const batchSize = 3;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const batchPromises = batch.map(async (update, index) => {
          const globalIndex = i + index;
          try {
            const response = await apiClient.put<{
              ok: boolean;
              message: string;
              data: { productId: string };
              requestId: string;
            }>(`/protected/product/${update.productId}`, {
              title: update.title,
              description: update.description,
              amount: update.amount,
              currency: update.currency,
              image: update.image,
              isActive: update.isActive,
              metadata: update.metadata,
            });

            if (response.ok && response.data.productId) {
              successful++;

              results[globalIndex] = {
                success: true,
                productId: update.productId,
                title: update.title,
              };

              return results[globalIndex];
            } else {
              throw new Error(response.message || "Product update failed");
            }
          } catch (err) {
            failed++;

            const errorMessage = err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Unknown error";

            results[globalIndex] = {
              success: false,
              productId: update.productId,
              error: errorMessage,
            };

            return results[globalIndex];
          }
        });

        await Promise.all(batchPromises);

        // Update progress
        if (onProgress) {
          onProgress(Math.min(i + batchSize, updates.length), updates.length);
        }
      }

      toast.success(`Bulk product update complete: ${successful}/${updates.length} successful`, {
        id: "bulk-product-update",
      });

      return {
        results,
        stats: { successful, failed }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk product update failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-product-update" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get analytics for multiple products in batch
   * Limits: Maximum 12 analytics queries per batch
   */
  const bulkGetAnalytics = async (
    analyticsQueries: BulkAnalyticsQuery[]
  ): Promise<{
    results: BulkAnalyticsResult[];
    stats: { totalPayments: number; totalAmount: number; productsAnalyzed: number };
  }> => {
    if (analyticsQueries.length === 0) {
      throw new Error("No analytics queries provided");
    }

    if (analyticsQueries.length > 12) {
      throw new Error("Maximum 12 analytics queries per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkAnalyticsResult[] = [];
    let totalPayments = 0;
    let totalAmount = 0;

    try {
      // Process analytics queries with controlled concurrency (max 4 concurrent)
      const batchSize = 4;
      for (let i = 0; i < analyticsQueries.length; i += batchSize) {
        const batch = analyticsQueries.slice(i, i + batchSize);
        const batchPromises = batch.map(async (query, index) => {
          const globalIndex = i + index;
          try {
            const promises = [];

            // Collect analytics based on requested metrics
            if (query.metrics?.includes("payments") || !query.metrics) {
              promises.push(
                apiClient.get(`/protected/product/stats`).then(r => ({ payments: r.data }))
              );
            }

            if (query.metrics?.includes("amounts") || !query.metrics) {
              if (query.productId) {
                promises.push(
                  apiClient.get(`/protected/product/${query.productId}/payment-amounts`).then(r => ({ amounts: r.data }))
                );
              }
            }

            if (query.metrics?.includes("trends") || !query.metrics) {
              // Use existing sales heatmap endpoint for trends
              promises.push(
                apiClient.get("/protected/payment/sales-heatmap").then(r => ({ trends: r.data }))
              );
            }

            const responses = await Promise.all(promises);

            // Aggregate results
            const analytics: BulkAnalyticsResult = {
              productId: query.productId,
            };

            responses.forEach(response => {
              if (response.payments) {
                analytics.paymentsCount = response.payments.totalPayments || 0;
                totalPayments += analytics.paymentsCount;
              }
              if (response.amounts) {
                analytics.paymentsAmount = response.amounts.totalAmount || 0;
                totalAmount += analytics.paymentsAmount;
              }
              if (response.trends) {
                analytics.trendsData = response.trends.data || [];
              }
            });

            results[globalIndex] = analytics;
            return analytics;
          } catch (err) {
            const errorMessage = err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Unknown error";

            results[globalIndex] = {
              productId: query.productId,
              error: errorMessage,
            };

            return results[globalIndex];
          }
        });

        await Promise.all(batchPromises);
      }

      return {
        results,
        stats: {
          totalPayments,
          totalAmount,
          productsAnalyzed: analyticsQueries.length
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk analytics query failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bulkCreateProducts,
    bulkUpdateProducts,
    bulkGetAnalytics,
  };
}
