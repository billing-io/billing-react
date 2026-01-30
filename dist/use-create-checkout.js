import { useCallback, useState } from "react";
import { useBillingClient } from "./use-billing-client.js";
/**
 * Mutation-style hook for creating a checkout.
 *
 * Does **not** auto-fetch -- call `createCheckout(...)` to trigger the request.
 *
 * ```ts
 * const { createCheckout, data, error, isLoading } = useCreateCheckout();
 *
 * async function handlePay() {
 *   const checkout = await createCheckout({
 *     amount_usd: 49.99,
 *     chain: "tron",
 *     token: "USDT",
 *     metadata: { order_id: "ord_12345" },
 *   });
 *   // redirect to deposit address, etc.
 * }
 * ```
 */
export function useCreateCheckout() {
    const client = useBillingClient();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const createCheckout = useCallback(async (request, options) => {
        setIsLoading(true);
        setError(null);
        try {
            const checkout = await client.checkouts.create(request, options);
            setData(checkout);
            return checkout;
        }
        catch (err) {
            const wrapped = err instanceof Error ? err : new Error(String(err));
            setError(wrapped);
            throw wrapped;
        }
        finally {
            setIsLoading(false);
        }
    }, [client]);
    return { createCheckout, data, error, isLoading };
}
//# sourceMappingURL=use-create-checkout.js.map