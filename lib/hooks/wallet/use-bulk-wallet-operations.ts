/**
 * Bulk Wallet Operations Hook
 * Handles bulk withdrawals, balance checks, and transaction management
 */

import { useState } from "react";
import { apiClient, ApiError } from "@/lib/api/client";
import { toast } from "sonner";

export interface BulkWithdrawalRequest {
  chain: string;
  amount: number;
  tokenAddress?: string;
  recipientAddress: string;
  priority?: "low" | "medium" | "high";
}

export interface BulkWithdrawalResult {
  success: boolean;
  chain: string;
  amount: number;
  transactionHash?: string;
  error?: string;
}

export interface BulkBalanceCheck {
  chain: string;
  tokenAddress?: string;
}

export interface BulkBalanceResult {
  chain: string;
  tokenAddress?: string;
  balance: number;
  symbol: string;
  error?: string;
}

export interface BulkTransactionQuery {
  chain: string;
  limit?: number;
  offset?: number;
  status?: "pending" | "completed" | "failed";
}

export interface BulkTransactionResult {
  chain: string;
  transactions: any[];
  total: number;
  error?: string;
}

interface UseBulkWalletOperationsReturn {
  loading: boolean;
  error: string | null;
  bulkWithdraw: (
    withdrawals: BulkWithdrawalRequest[],
    onProgress?: (completed: number, total: number) => void
  ) => Promise<{
    results: BulkWithdrawalResult[];
    stats: { successful: number; failed: number; totalWithdrawn: number };
  }>;
  bulkCheckBalances: (
    balanceChecks: BulkBalanceCheck[]
  ) => Promise<{
    results: BulkBalanceResult[];
    stats: { successful: number; failed: number; totalBalance: number };
  }>;
  bulkGetTransactions: (
    transactionQueries: BulkTransactionQuery[]
  ) => Promise<{
    results: BulkTransactionResult[];
    stats: { totalTransactions: number; chainsQueried: number };
  }>;
}

/**
 * Hook for bulk wallet operations
 * Supports bulk withdrawals, balance checks, and transaction queries
 */
export function useBulkWalletOperations(): UseBulkWalletOperationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform bulk withdrawals across multiple chains/tokens
   * Limits: Maximum 10 withdrawals per batch
   */
  const bulkWithdraw = async (
    withdrawals: BulkWithdrawalRequest[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    results: BulkWithdrawalResult[];
    stats: { successful: number; failed: number; totalWithdrawn: number };
  }> => {
    if (withdrawals.length === 0) {
      throw new Error("No withdrawals provided");
    }

    if (withdrawals.length > 10) {
      throw new Error("Maximum 10 withdrawals per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkWithdrawalResult[] = [];
    let successful = 0;
    let failed = 0;
    let totalWithdrawn = 0;

    toast.loading(`Processing ${withdrawals.length} withdrawals...`, {
      id: "bulk-withdrawal",
    });

    try {
      // Process withdrawals sequentially to ensure proper ordering and avoid conflicts
      for (let i = 0; i < withdrawals.length; i++) {
        const withdrawal = withdrawals[i];
        try {
          let response;

          if (withdrawal.tokenAddress) {
            // Single token withdrawal
            response = await apiClient.post<{
              ok: boolean;
              message: string;
              data: { transactionHash: string };
              requestId: string;
            }>("/protected/wallet/withdraw/single", {
              chain: withdrawal.chain,
              tokenAddress: withdrawal.tokenAddress,
              amount: withdrawal.amount,
              recipientAddress: withdrawal.recipientAddress,
              priority: withdrawal.priority || "medium",
            });
          } else {
            // Batch withdrawal (all tokens on chain)
            response = await apiClient.post<{
              ok: boolean;
              message: string;
              data: { transactionHash: string };
              requestId: string;
            }>("/protected/wallet/withdraw/batch", {
              chain: withdrawal.chain,
              amount: withdrawal.amount,
              recipientAddress: withdrawal.recipientAddress,
              priority: withdrawal.priority || "medium",
            });
          }

          if (response.ok && response.data.transactionHash) {
            successful++;
            totalWithdrawn += withdrawal.amount;

            results[i] = {
              success: true,
              chain: withdrawal.chain,
              amount: withdrawal.amount,
              transactionHash: response.data.transactionHash,
            };
          } else {
            throw new Error(response.message || "Withdrawal failed");
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
            chain: withdrawal.chain,
            amount: withdrawal.amount,
            error: errorMessage,
          };
        }

        // Update progress
        if (onProgress) {
          onProgress(i + 1, withdrawals.length);
        }
      }

      toast.success(`Bulk withdrawal complete: ${successful}/${withdrawals.length} successful`, {
        id: "bulk-withdrawal",
      });

      return {
        results,
        stats: { successful, failed, totalWithdrawn }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk withdrawal failed";
      setError(errorMessage);
      toast.error(errorMessage, { id: "bulk-withdrawal" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check balances across multiple chains/tokens
   * Limits: Maximum 15 balance checks per batch
   */
  const bulkCheckBalances = async (
    balanceChecks: BulkBalanceCheck[]
  ): Promise<{
    results: BulkBalanceResult[];
    stats: { successful: number; failed: number; totalBalance: number };
  }> => {
    if (balanceChecks.length === 0) {
      throw new Error("No balance checks provided");
    }

    if (balanceChecks.length > 15) {
      throw new Error("Maximum 15 balance checks per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkBalanceResult[] = [];
    let successful = 0;
    let failed = 0;
    let totalBalance = 0;

    try {
      // Process balance checks with controlled concurrency (max 3 concurrent)
      const batchSize = 3;
      for (let i = 0; i < balanceChecks.length; i += batchSize) {
        const batch = balanceChecks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (check, index) => {
          const globalIndex = i + index;
          try {
            const response = await apiClient.get<{
              ok: boolean;
              message: string;
              data: {
                balance: number;
                symbol: string;
                tokenAddress?: string;
              };
              requestId: string;
            }>(`/protected/wallet/balance`, {
              params: {
                chain: check.chain,
                tokenAddress: check.tokenAddress,
              },
            });

            if (response.ok && response.data) {
              successful++;
              totalBalance += response.data.balance;

              results[globalIndex] = {
                chain: check.chain,
                tokenAddress: check.tokenAddress,
                balance: response.data.balance,
                symbol: response.data.symbol,
              };

              return results[globalIndex];
            } else {
              throw new Error(response.message || "Balance check failed");
            }
          } catch (err) {
            failed++;

            const errorMessage = err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Unknown error";

            results[globalIndex] = {
              chain: check.chain,
              tokenAddress: check.tokenAddress,
              balance: 0,
              symbol: "UNKNOWN",
              error: errorMessage,
            };

            return results[globalIndex];
          }
        });

        await Promise.all(batchPromises);
      }

      return {
        results,
        stats: { successful, failed, totalBalance }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk balance check failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get transaction history across multiple chains
   * Limits: Maximum 8 transaction queries per batch
   */
  const bulkGetTransactions = async (
    transactionQueries: BulkTransactionQuery[]
  ): Promise<{
    results: BulkTransactionResult[];
    stats: { totalTransactions: number; chainsQueried: number };
  }> => {
    if (transactionQueries.length === 0) {
      throw new Error("No transaction queries provided");
    }

    if (transactionQueries.length > 8) {
      throw new Error("Maximum 8 transaction queries per bulk operation");
    }

    setLoading(true);
    setError(null);

    const results: BulkTransactionResult[] = [];
    let totalTransactions = 0;

    try {
      // Process transaction queries sequentially to avoid rate limiting
      for (let i = 0; i < transactionQueries.length; i++) {
        const query = transactionQueries[i];
        try {
          const response = await apiClient.get<{
            ok: boolean;
            message: string;
            data: {
              transactions: any[];
              total: number;
              pagination: any;
            };
            requestId: string;
          }>(`/protected/wallet/payouttransactions/${query.chain}`, {
            params: {
              limit: query.limit || 50,
              offset: query.offset || 0,
              status: query.status,
            },
          });

          if (response.ok && response.data) {
            totalTransactions += response.data.transactions.length;

            results[i] = {
              chain: query.chain,
              transactions: response.data.transactions,
              total: response.data.total,
            };
          } else {
            throw new Error(response.message || "Transaction query failed");
          }
        } catch (err) {
          const errorMessage = err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unknown error";

          results[i] = {
            chain: query.chain,
            transactions: [],
            total: 0,
            error: errorMessage,
          };
        }
      }

      return {
        results,
        stats: {
          totalTransactions,
          chainsQueried: transactionQueries.length
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bulk transaction query failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bulkWithdraw,
    bulkCheckBalances,
    bulkGetTransactions,
  };
}
