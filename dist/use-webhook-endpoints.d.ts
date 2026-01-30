import type { WebhookEndpointList } from "@billing-io/sdk";
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
export declare function useWebhookEndpoints(params?: UseWebhookEndpointsParams): UseWebhookEndpointsReturn;
//# sourceMappingURL=use-webhook-endpoints.d.ts.map