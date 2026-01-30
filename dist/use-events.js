import { useCallback, useEffect, useState } from "react";
import { useBillingClient } from "./use-billing-client.js";
/**
 * Fetches a paginated list of webhook events.
 *
 * ```ts
 * const { data, error, isLoading, refetch } = useEvents({
 *   limit: 10,
 *   type: "checkout.completed",
 *   checkout_id: "co_abc123",
 * });
 * ```
 */
export function useEvents(params = {}) {
    const client = useBillingClient();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { cursor, limit, type, checkout_id } = params;
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await client.events.list({
                cursor,
                limit,
                type,
                checkout_id,
            });
            setData(result);
        }
        catch (err) {
            const wrapped = err instanceof Error ? err : new Error(String(err));
            setError(wrapped);
        }
        finally {
            setIsLoading(false);
        }
    }, [client, cursor, limit, type, checkout_id]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, error, isLoading, refetch: fetchData };
}
//# sourceMappingURL=use-events.js.map