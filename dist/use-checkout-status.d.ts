import type { CheckoutStatus } from "@billing-io/sdk";
/** Options for the {@link useCheckoutStatus} hook. */
export interface UseCheckoutStatusOptions {
    /**
     * Whether polling is enabled.
     * @default true
     */
    enabled?: boolean;
    /**
     * Override the polling interval in milliseconds.
     * When omitted the server-provided `polling_interval_ms` is used.
     */
    pollingInterval?: number;
}
/** Return type of the {@link useCheckoutStatus} hook. */
export interface UseCheckoutStatusReturn {
    /** Current checkout status, or `null` if not yet fetched. */
    status: CheckoutStatus | null;
    /** Current confirmation count. */
    confirmations: number;
    /** Number of confirmations required for this chain. */
    requiredConfirmations: number;
    /** On-chain transaction hash, or `null` until detected. */
    txHash: string | null;
    /** Timestamp when the transaction was detected on-chain. */
    detectedAt: string | null;
    /** Timestamp when the payment was fully confirmed. */
    confirmedAt: string | null;
    /** `true` while polling is actively running. */
    isPolling: boolean;
    /** The error from the last poll, or `null`. */
    error: Error | null;
}
/**
 * Polls the lightweight checkout status endpoint.
 *
 * Automatically uses the server-provided `polling_interval_ms` as the
 * interval between requests. Polling stops when a terminal status is
 * reached (`confirmed`, `expired`, `failed`).
 *
 * ```ts
 * const {
 *   status,
 *   confirmations,
 *   requiredConfirmations,
 *   txHash,
 *   isPolling,
 *   error,
 * } = useCheckoutStatus("co_abc123");
 * ```
 */
export declare function useCheckoutStatus(checkoutId: string | null | undefined, options?: UseCheckoutStatusOptions): UseCheckoutStatusReturn;
//# sourceMappingURL=use-checkout-status.d.ts.map