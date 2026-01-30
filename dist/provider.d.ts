import { type ReactNode } from "react";
import { BillingIO } from "@billing-io/sdk";
/**
 * Internal context that holds the BillingIO client instance.
 * Not exported directly -- consumers use the `useBillingClient` hook.
 */
export declare const BillingContext: import("react").Context<BillingIO | null>;
/** Props for the {@link BillingProvider} component. */
export interface BillingProviderProps {
    /** Your billing.io secret API key (`sk_live_...` or `sk_test_...`). */
    apiKey: string;
    /**
     * Override the API base URL.
     * Defaults to `https://api.billing.io/v1`.
     */
    baseUrl?: string;
    children: ReactNode;
}
/**
 * Provides a `BillingIO` client to all descendant hooks.
 *
 * ```tsx
 * <BillingProvider apiKey="sk_test_..." baseUrl="http://localhost:8080/v1">
 *   <App />
 * </BillingProvider>
 * ```
 */
export declare function BillingProvider({ apiKey, baseUrl, children, }: BillingProviderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=provider.d.ts.map