import { useCallback, useEffect, useState } from "react";
import type { WebhookEndpointList } from "@billing-io/sdk";
import { useBillingClient } from "./use-billing-client.js";

/** Parameters for the {@link useWebhookEndpoints} hook. */
export interface UseWebhookEndpointsParams {
  /** Opaque cursor for pagination. Omit for the first page. */
  cursor?: string;

  /** Number of items per page (1-100, default 25). */
  limit?: number;
}

/** Return type of the {@link useWebhookEndpoints} hook. */
export interface UseWebhookEndpointsReturn {
  /** The list response, or `null` before the first successful fetch. */
  data: WebhookEndpointList | null;

  /** The error from the last fetch, or `null` on success. */
  error: Error | null;

  /** `true` while the API call is in flight. */
  isLoading: boolean;

  /** Re-fetches the webhook endpoints with the current params. */
  refetch: () => Promise<void>;
}

/**
 * Fetches a paginated list of webhook endpoints.
 *
 * ```ts
 * const { data, error, isLoading, refetch } = useWebhookEndpoints({
 *   limit: 10,
 * });
 * ```
 */
export function useWebhookEndpoints(
  params: UseWebhookEndpointsParams = {},
): UseWebhookEndpointsReturn {
  const client = useBillingClient();
  const [data, setData] = useState<WebhookEndpointList | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { cursor, limit } = params;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await client.webhooks.list({ cursor, limit });
      setData(result);
    } catch (err) {
      const wrapped =
        err instanceof Error ? err : new Error(String(err));
      setError(wrapped);
    } finally {
      setIsLoading(false);
    }
  }, [client, cursor, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
