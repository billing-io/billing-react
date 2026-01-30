import { useCallback, useEffect, useState } from "react";
import type {
  Checkout,
  CheckoutStatus,
  CheckoutList,
} from "@billing-io/sdk";
import { useBillingClient } from "./use-billing-client.js";

/** Parameters for the {@link useCheckouts} hook. */
export interface UseCheckoutsParams {
  /** Opaque cursor for pagination. Omit for the first page. */
  cursor?: string;

  /** Number of items per page (1-100, default 25). */
  limit?: number;

  /** Filter by checkout status. */
  status?: CheckoutStatus;
}

/** Return type of the {@link useCheckouts} hook. */
export interface UseCheckoutsReturn {
  /** The list response, or `null` before the first successful fetch. */
  data: CheckoutList | null;

  /** The error from the last fetch, or `null` on success. */
  error: Error | null;

  /** `true` while the API call is in flight. */
  isLoading: boolean;

  /** Re-fetches the checkout list with the current params. */
  refetch: () => Promise<void>;
}

/**
 * Fetches a paginated list of checkouts.
 *
 * ```ts
 * const { data, error, isLoading, refetch } = useCheckouts({
 *   limit: 10,
 *   status: "confirmed",
 * });
 * ```
 */
export function useCheckouts(
  params: UseCheckoutsParams = {},
): UseCheckoutsReturn {
  const client = useBillingClient();
  const [data, setData] = useState<CheckoutList | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { cursor, limit, status } = params;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await client.checkouts.list({ cursor, limit, status });
      setData(result);
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error(String(err));
      setError(wrapped);
    } finally {
      setIsLoading(false);
    }
  }, [client, cursor, limit, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
