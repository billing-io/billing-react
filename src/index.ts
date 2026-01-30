// ---------------------------------------------------------------------------
// @billing-io/react  --  React hooks for the billing.io API
// ---------------------------------------------------------------------------

// Provider & context
export { BillingProvider, type BillingProviderProps } from "./provider.js";

// Core client hook
export { useBillingClient } from "./use-billing-client.js";

// Checkout hooks
export {
  useCreateCheckout,
  type UseCreateCheckoutReturn,
} from "./use-create-checkout.js";

export {
  useCheckoutStatus,
  type UseCheckoutStatusOptions,
  type UseCheckoutStatusReturn,
} from "./use-checkout-status.js";

export {
  useCheckouts,
  type UseCheckoutsParams,
  type UseCheckoutsReturn,
} from "./use-checkouts.js";

// Webhook hooks
export {
  useWebhookEndpoints,
  type UseWebhookEndpointsParams,
  type UseWebhookEndpointsReturn,
} from "./use-webhook-endpoints.js";

// Event hooks
export {
  useEvents,
  type UseEventsParams,
  type UseEventsReturn,
} from "./use-events.js";

// ---------------------------------------------------------------------------
// Re-export key types from @billing-io/sdk for convenience so consumers
// don't need to add a separate import for common types.
// ---------------------------------------------------------------------------
export type {
  BillingIO,
  CreateCheckoutRequest,
  Checkout,
  CheckoutStatus,
  CheckoutStatusResponse,
  CheckoutList,
  CreateWebhookRequest,
  WebhookEndpoint,
  WebhookEndpointList,
  Event,
  EventList,
  EventType,
  Chain,
  Token,
  ApiErrorBody,
  RequestOptions,
} from "@billing-io/sdk";
