import type { CheckoutStatus, CheckoutList } from "@billing-io/sdk";
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
export declare function useCheckouts(params?: UseCheckoutsParams): UseCheckoutsReturn;
//# sourceMappingURL=use-checkouts.d.ts.map