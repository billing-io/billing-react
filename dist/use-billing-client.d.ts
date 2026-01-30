import type { BillingIO } from "@billing-io/sdk";
/**
 * Returns the `BillingIO` client from the nearest `BillingProvider`.
 *
 * @throws If called outside of a `<BillingProvider>`.
 *
 * ```ts
 * const client = useBillingClient();
 * const checkout = await client.checkouts.get("co_abc123");
 * ```
 */
export declare function useBillingClient(): BillingIO;
//# sourceMappingURL=use-billing-client.d.ts.map