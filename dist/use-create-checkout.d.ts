import type { CreateCheckoutRequest, Checkout, RequestOptions } from "@billing-io/sdk";
/** Return type of the {@link useCreateCheckout} hook. */
export interface UseCreateCheckoutReturn {
    /** Triggers the checkout creation API call. */
    createCheckout: (request: CreateCheckoutRequest, options?: RequestOptions) => Promise<Checkout>;
    /** The most recently created checkout, or `null` if none yet. */
    data: Checkout | null;
    /** The error from the last call, or `null` on success. */
    error: Error | null;
    /** `true` while the API call is in flight. */
    isLoading: boolean;
}
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
export declare function useCreateCheckout(): UseCreateCheckoutReturn;
//# sourceMappingURL=use-create-checkout.d.ts.map