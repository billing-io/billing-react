import { useContext } from "react";
import type { BillingIO } from "@billing-io/sdk";
import { BillingContext } from "./provider.js";

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
export function useBillingClient(): BillingIO {
  const client = useContext(BillingContext);
  if (!client) {
    throw new Error(
      "useBillingClient must be used within a <BillingProvider>. " +
        "Wrap your component tree with <BillingProvider apiKey=\"...\">.",
    );
  }
  return client;
}
