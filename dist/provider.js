import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useMemo } from "react";
import { BillingIO } from "@billing-io/sdk";
/**
 * Internal context that holds the BillingIO client instance.
 * Not exported directly -- consumers use the `useBillingClient` hook.
 */
export const BillingContext = createContext(null);
/**
 * Provides a `BillingIO` client to all descendant hooks.
 *
 * ```tsx
 * <BillingProvider apiKey="sk_test_..." baseUrl="http://localhost:8080/v1">
 *   <App />
 * </BillingProvider>
 * ```
 */
export function BillingProvider({ apiKey, baseUrl, children, }) {
    const client = useMemo(() => new BillingIO({ apiKey, baseUrl }), [apiKey, baseUrl]);
    return (_jsx(BillingContext.Provider, { value: client, children: children }));
}
//# sourceMappingURL=provider.js.map