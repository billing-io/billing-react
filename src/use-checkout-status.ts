import { useCallback, useEffect, useRef, useState } from "react";
import type { CheckoutStatusResponse, CheckoutStatus } from "@billing-io/sdk";
import { useBillingClient } from "./use-billing-client.js";

/** Terminal checkout statuses that stop polling automatically. */
const TERMINAL_STATUSES: ReadonlySet<CheckoutStatus> = new Set([
  "confirmed",
  "expired",
  "failed",
]);

/** Default polling interval (ms) when the server does not provide one. */
const DEFAULT_POLLING_INTERVAL_MS = 3000;

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
export function useCheckoutStatus(
  checkoutId: string | null | undefined,
  options: UseCheckoutStatusOptions = {},
): UseCheckoutStatusReturn {
  const { enabled = true, pollingInterval: intervalOverride } = options;
  const client = useBillingClient();

  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [detectedAt, setDetectedAt] = useState<string | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track the server-suggested interval across renders.
  const serverIntervalRef = useRef<number>(DEFAULT_POLLING_INTERVAL_MS);

  // Keep a ref to the timer so we can clear it on unmount.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track whether the component is mounted.
  const mountedRef = useRef(true);

  const poll = useCallback(async () => {
    if (!checkoutId) return;

    try {
      const res: CheckoutStatusResponse =
        await client.checkouts.getStatus(checkoutId);

      if (!mountedRef.current) return;

      setStatus(res.status);
      setConfirmations(res.confirmations ?? 0);
      setRequiredConfirmations(res.required_confirmations ?? 0);
      setTxHash(res.tx_hash ?? null);
      setDetectedAt(res.detected_at ?? null);
      setConfirmedAt(res.confirmed_at ?? null);
      setError(null);

      // Update the server-suggested interval for subsequent polls.
      if (res.polling_interval_ms != null) {
        serverIntervalRef.current = res.polling_interval_ms;
      }

      // Stop polling on terminal states.
      if (res.status && TERMINAL_STATUSES.has(res.status)) {
        setIsPolling(false);
        return;
      }

      // Schedule the next poll.
      const nextInterval =
        intervalOverride ?? serverIntervalRef.current;
      timerRef.current = setTimeout(poll, nextInterval);
    } catch (err) {
      if (!mountedRef.current) return;

      const wrapped =
        err instanceof Error ? err : new Error(String(err));
      setError(wrapped);

      // Continue polling on transient errors -- the next attempt may succeed.
      const nextInterval =
        intervalOverride ?? serverIntervalRef.current;
      timerRef.current = setTimeout(poll, nextInterval);
    }
  }, [checkoutId, client, intervalOverride]);

  useEffect(() => {
    mountedRef.current = true;

    // Clear any running timer from a previous effect.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!enabled || !checkoutId) {
      setIsPolling(false);
      return;
    }

    // If we already reached a terminal status for this checkout, don't restart.
    if (status && TERMINAL_STATUSES.has(status)) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    // Fire the first poll immediately.
    poll();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // `status` is intentionally excluded -- we only want to restart the
    // effect when the caller changes the checkout ID or enabled flag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId, enabled, poll]);

  return {
    status,
    confirmations,
    requiredConfirmations,
    txHash,
    detectedAt,
    confirmedAt,
    isPolling,
    error,
  };
}
