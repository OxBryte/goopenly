/**
 * Bulk Payment Operations Hook
 * Handles bulk payment processing, cancellations, and management
 */

import { useState } from "react";
import { apiClient, ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export interface BulkPaymentIntent {
  paymentLink: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface BulkPaymentResult {
  success: boolean;
  paymentIntentId: string;
  clientSecret: string;
  paymentLink: string;
  amount: number;
  error?: string;
}

export interface BulkCancellationRequest {
  clientSecret: string;
  cancellationReason?: string;
}

export interface BulkCancellationResult {
  success: boolean;
  clientSecret: string;
  error?: string;
}

export interface BulkPaymentStats {
  totalRequested: number;
  successful: number;
  failed: number;
  totalAmount: number;
  averageProcessingTime: number;
}

interface UseBulkPaymentOperationsReturn {
  loading: boolean;
  error: string | null;
  bulkCreateIntents: (
    payments: BulkPaymentIntent[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: BulkPaymentResult[];
    stats: BulkPaymentStats;
  }>;
  bulkCancelIntents: (
    cancellations: BulkCancellationRequest[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: BulkCancellationResult[];
    stats: { successful: number; failed: number };
  }>;
  bulkSyncIntents: (
    intentIds: string[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: any[];
    stats: { successful: number; failed: number };
  }>;
}

/**
 * Hook for bulk payment operations
 * Supports creating multiple payment intents, bulk cancellations, and bulk syncing
 */
export function useBulkPaymentOperations(): UseBulkPaymentOperationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create multiple payment intents in batch
   * Limits: Maximum 20 payment intents per batch
   */
  const bulkCreateIntents = async (
    payments: BulkPaymentIntent[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: BulkPaymentResult[];
    stats: BulkPaymentStats;
  }> => {
    if (payments.length === 0) {
      throw new Error("No payments provided");
    }

    if (payments.length > 20) {
      throw new Error("Maximum 20 payments per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkPaymentResult[] = [];
    let successful = 0;
    let failed = 0;
    let totalAmount = 0;
    const startTime = Date.now();

    toast.loading(`Creating ${payments.length} payment intents...`, {
      id: "bulk-payment-creation",
    });

    try {
      // Process payments with controlled concurrency (max 3 concurrent)
      const batchSize = 3;
      for (let i = 0; i < payments.length; i += batchSize) {
        const batch = payments.slice(i, i + batchSize);
        const batchPromises = batch.map(async (payment, index) => {
          const globalIndex = i + index;
          try {
            const response = await apiClient.post<{
              ok: boolean;
              message: string;
              data: any;
              requestId: string;
            }>("/public/payment/intent", {
              paymentLink: payment.paymentLink,
              amount: payment.amount,
              currency: payment.currency,
              metadata: payment.metadata,
            });

            if (response.ok && response.data) {
              successful++;
              totalAmount += payment.amount;

              const result: BulkPaymentResult = {
                success: true,
                paymentIntentId: response.data.paymentIntentId,
                clientSecret: response.data.clientSecret,
                paymentLink: payment.paymentLink,
                amount: payment.amount,
              };

              results[globalIndex] = result;
              return result;
            } else {
              throw new Error(response.message || "Failed to create payment intent");
            }
          } catch (err) {
            failed++;

            const errorMessage = err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Unknown error";

            const result: BulkPaymentResult = {
              success: false,
              paymentIntentId: "",
              clientSecret: "",
              paymentLink: payment.paymentLink,
              amount: payment.amount,
              error: errorMessage,
            };

            results[globalIndex] = result;
            return result;
          }
        });

        await Promise.all(batchPromises);

        // Update progress
        if (onProgress) {
          onProgress(Math.min(i + batchSize, payments.length), payments.length);
        }
      }

      const processingTime = Date.now() - startTime;
      const averageProcessingTime = processingTime / payments.length;

      const stats: BulkPaymentStats = {
        totalRequested: payments.length,
        successful,
        failed,
        totalAmount,
        averageProcessingTime,
      };

      toast.success(`Bulk payment creation complete: ${successful}/${payments.length} successful`, {
        id: "bulk-payment-creation",
      });

      return { results, stats };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk payment creation failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-payment-creation" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel multiple payment intents in batch
   * Limits: Maximum 15 cancellations per batch
   */
  const bulkCancelIntents = async (
    cancellations: BulkCancellationRequest[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: BulkCancellationResult[];
    stats: { successful: number; failed: number };
  }> => {
    if (cancellations.length === 0) {
      throw new Error("No cancellations provided");
    }

    if (cancellations.length > 15) {
      throw new Error("Maximum 15 cancellations per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkCancellationResult[] = [];
    let successful = 0;
    let failed = 0;

    toast.loading(`Cancelling ${cancellations.length} payment intents...`, {
      id: "bulk-payment-cancellation",
    });

    try {
      // Process cancellations sequentially to avoid rate limiting
      for (let i = 0; i < cancellations.length; i++) {
        const cancellation = cancellations[i];
        try {
          const response = await apiClient.post<{
            ok: boolean;
            message: string;
            data: { success: boolean };
            requestId: string;
          }>("/public/payment/intent/cancel", {
            clientSecret: cancellation.clientSecret,
            cancellationReason: cancellation.cancellationReason,
          });

          if (response.ok && response.data.success) {
            successful++;
            results[i] = {
              success: true,
              clientSecret: cancellation.clientSecret,
            };
          } else {
            throw new Error(response.message || "Cancellation failed");
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
            clientSecret: cancellation.clientSecret,
            error: errorMessage,
          };
        }

        // Update progress
        if (onProgress) {
          onProgress(i + 1, cancellations.length);
        }
      }

      toast.success(`Bulk cancellation complete: ${successful}/${cancellations.length} successful`, {
        id: "bulk-payment-cancellation",
      });

      return {
        results,
        stats: { successful, failed }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk cancellation failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-payment-cancellation" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync multiple payment intents in batch
   * Limits: Maximum 25 syncs per batch
   */
  const bulkSyncIntents = async (
    intentIds: string[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: any[];
    stats: { successful: number; failed: number };
  }> => {
    if (intentIds.length === 0) {
      throw new Error("No intent IDs provided");
    }

    if (intentIds.length > 25) {
      throw new Error("Maximum 25 syncs per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: any[] = [];
    let successful = 0;
    let failed = 0;

    toast.loading(`Syncing ${intentIds.length} payment intents...`, {
      id: "bulk-payment-sync",
    });

    try {
      // Process syncs with controlled concurrency (max 4 concurrent)
      const batchSize = 4;
      for (let i = 0; i < intentIds.length; i += batchSize) {
        const batch = intentIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (intentId, index) => {
          const globalIndex = i + index;
          try {
            const response = await apiClient.post<{
              ok: boolean;
              message: string;
              data: any;
              requestId: string;
            }>("/public/payment/intent/sync", {
              intentId,
            });

            if (response.ok && response.data) {
              successful++;
              results[globalIndex] = response.data;
              return response.data;
            } else {
              throw new Error(response.message || "Sync failed");
            }
          } catch (err) {
            failed++;
            const errorMessage = err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Unknown error";

            results[globalIndex] = { intentId, error: errorMessage };
            return { intentId, error: errorMessage };
          }
        });

        await Promise.all(batchPromises);

        // Update progress
        if (onProgress) {
          onProgress(Math.min(i + batchSize, intentIds.length), intentIds.length);
        }
      }

      toast.success(`Bulk sync complete: ${successful}/${intentIds.length} successful`, {
        id: "bulk-payment-sync",
      });

      return {
        results,
        stats: { successful, failed }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk sync failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-payment-sync" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bulkCreateIntents,
    bulkCancelIntents,
    bulkSyncIntents,
  };
}
