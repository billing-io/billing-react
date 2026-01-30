# @billing-io/react

React hooks for the [billing.io](https://billing.io) crypto checkout API.

No UI opinions -- bring your own components. This package provides hooks only.

## Installation

```bash
npm install @billing-io/react @billing-io/sdk react
```

`react` (>=18) and `@billing-io/sdk` (>=1.0.0) are peer dependencies.

## Quick start

### 1. Wrap your app with `BillingProvider`

```tsx
import { BillingProvider } from "@billing-io/react";

function App() {
  return (
    <BillingProvider
      apiKey="sk_test_..."
      baseUrl="https://api.billing.io/v1"  {/* optional */}
    >
      <YourCheckoutPage />
    </BillingProvider>
  );
}
```

### 2. Create a checkout

```tsx
import { useCreateCheckout } from "@billing-io/react";

function CheckoutButton() {
  const { createCheckout, data, error, isLoading } = useCreateCheckout();

  async function handleClick() {
    const checkout = await createCheckout({
      amount_usd: 49.99,
      chain: "tron",
      token: "USDT",
      metadata: { order_id: "ord_12345" },
    });
    console.log("Deposit to:", checkout.deposit_address);
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Creating..." : "Pay $49.99"}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Send funds to: {data.deposit_address}</p>}
    </div>
  );
}
```

### 3. Poll checkout status

```tsx
import { useCheckoutStatus } from "@billing-io/react";

function PaymentStatus({ checkoutId }: { checkoutId: string }) {
  const {
    status,
    confirmations,
    requiredConfirmations,
    txHash,
    isPolling,
    error,
  } = useCheckoutStatus(checkoutId);

  if (error) return <p>Error: {error.message}</p>;
  if (!status) return <p>Loading...</p>;

  return (
    <div>
      <p>Status: {status}</p>
      {txHash && <p>TX: {txHash}</p>}
      <p>
        Confirmations: {confirmations} / {requiredConfirmations}
      </p>
      {isPolling && <p>Waiting for confirmations...</p>}
      {status === "confirmed" && <p>Payment confirmed!</p>}
    </div>
  );
}
```

The hook uses the server-provided `polling_interval_ms` by default. You can
override it or pause polling entirely:

```tsx
// Custom interval
useCheckoutStatus("co_abc123", { pollingInterval: 5000 });

// Pause polling
useCheckoutStatus("co_abc123", { enabled: false });
```

Polling stops automatically on terminal statuses: `confirmed`, `expired`, `failed`.

### 4. List checkouts

```tsx
import { useCheckouts } from "@billing-io/react";

function CheckoutHistory() {
  const { data, error, isLoading, refetch } = useCheckouts({
    limit: 10,
    status: "confirmed",
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.data.map((checkout) => (
        <li key={checkout.checkout_id}>
          {checkout.checkout_id} -- ${checkout.amount_usd} -- {checkout.status}
        </li>
      ))}
      {data?.has_more && <button onClick={refetch}>Load more</button>}
    </ul>
  );
}
```

### 5. List webhook endpoints

```tsx
import { useWebhookEndpoints } from "@billing-io/react";

function Webhooks() {
  const { data, error, isLoading } = useWebhookEndpoints({ limit: 25 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.data.map((endpoint) => (
        <li key={endpoint.webhook_id}>
          {endpoint.url} ({endpoint.status})
        </li>
      ))}
    </ul>
  );
}
```

### 6. List events

```tsx
import { useEvents } from "@billing-io/react";

function EventLog() {
  const { data, error, isLoading } = useEvents({
    type: "checkout.completed",
    limit: 50,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.data.map((event) => (
        <li key={event.event_id}>
          [{event.type}] {event.checkout_id} at {event.created_at}
        </li>
      ))}
    </ul>
  );
}
```

## Direct client access

For operations not covered by a hook (e.g., deleting a webhook), use the
client directly:

```tsx
import { useBillingClient } from "@billing-io/react";

function DeleteWebhookButton({ webhookId }: { webhookId: string }) {
  const client = useBillingClient();

  async function handleDelete() {
    await client.webhooks.delete(webhookId);
  }

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Error handling

All hooks surface errors through an `error` property. The error object is the
original error thrown by `@billing-io/sdk`, which includes structured error
information from the API:

```tsx
const { error } = useCheckouts();

if (error) {
  // error.message    -- human-readable message
  // For API errors thrown by @billing-io/sdk you can also inspect:
  // error.type       -- "invalid_request" | "authentication_error" | ...
  // error.code       -- machine-readable code like "api_key_invalid"
  // error.statusCode -- HTTP status code
}
```

Mutation hooks (`useCreateCheckout`) both set `error` on the return value
**and** re-throw so you can `try/catch` in your handler.

## Re-exported types

For convenience, key types from `@billing-io/sdk` are re-exported:

```ts
import type {
  Checkout,
  CheckoutStatus,
  CreateCheckoutRequest,
  Chain,
  Token,
  EventType,
} from "@billing-io/react";
```

## API reference

| Hook                  | Type     | Description                          |
| --------------------- | -------- | ------------------------------------ |
| `useBillingClient()`  | Client   | Raw `BillingIO` client from context  |
| `useCreateCheckout()` | Mutation | Create a new checkout                |
| `useCheckoutStatus()` | Polling  | Poll checkout status in real time    |
| `useCheckouts()`      | Query    | Paginated checkout list              |
| `useWebhookEndpoints()` | Query | Paginated webhook endpoint list      |
| `useEvents()`         | Query    | Paginated event list                 |

## License

MIT
