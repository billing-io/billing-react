import { useCallback, useEffect, useState } from "react";
import { useBillingClient } from "./use-billing-client.js";
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
export function useCheckouts(params = {}) {
    const client = useBillingClient();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { cursor, limit, status } = params;
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await client.checkouts.list({ cursor, limit, status });
            setData(result);
        }
        catch (err) {
            const wrapped = err instanceof Error ? err : new Error(String(err));
            setError(wrapped);
        }
        finally {
            setIsLoading(false);
        }
    }, [client, cursor, limit, status]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, error, isLoading, refetch: fetchData };
}
//# sourceMappingURL=use-checkouts.js.map