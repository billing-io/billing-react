import type { EventList, EventType } from "@billing-io/sdk";
/** Parameters for the {@link useEvents} hook. */
export interface UseEventsParams {
    /** Opaque cursor for pagination. Omit for the first page. */
    cursor?: string;
    /** Number of items per page (1-100, default 25). */
    limit?: number;
    /** Filter by event type. */
    type?: EventType;
    /** Filter by checkout ID. */
    checkout_id?: string;
}
/** Return type of the {@link useEvents} hook. */
export interface UseEventsReturn {
    /** The list response, or `null` before the first successful fetch. */
    data: EventList | null;
    /** The error from the last fetch, or `null` on success. */
    error: Error | null;
    /** `true` while the API call is in flight. */
    isLoading: boolean;
    /** Re-fetches the events with the current params. */
    refetch: () => Promise<void>;
}
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
export declare function useEvents(params?: UseEventsParams): UseEventsReturn;
//# sourceMappingURL=use-events.d.ts.map