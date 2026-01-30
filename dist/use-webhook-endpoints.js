import { useCallback, useEffect, useState } from "react";
import { useBillingClient } from "./use-billing-client.js";
/**
 * Fetches a paginated list of webhook endpoints.
 *
 * ```ts
 * const { data, error, isLoading, refetch } = useWebhookEndpoints({
 *   limit: 10,
 * });
 * ```
 */
export function useWebhookEndpoints(params = {}) {
    const client = useBillingClient();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { cursor, limit } = params;
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await client.webhooks.list({ cursor, limit });
            setData(result);
        }
        catch (err) {
            const wrapped = err instanceof Error ? err : new Error(String(err));
            setError(wrapped);
        }
        finally {
            setIsLoading(false);
        }
    }, [client, cursor, limit]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, error, isLoading, refetch: fetchData };
}
//# sourceMappingURL=use-webhook-endpoints.js.map