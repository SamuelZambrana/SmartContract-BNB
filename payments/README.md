# NodeMeta Payments Backend Assessment

Settlement and fulfillment service for the NodeMeta technical assessment.

## Setup

```bash
npm install
npm start
```

The server runs on **http://localhost:3003** (port 3002 may be in use on some machines).

## What works out of the box

- `POST /webhook/payment-received` — receives payment events
- Simulated payment events logged every 30 seconds
- `lib/fulfillmentApi.js` — mock fulfillment API (do not modify)

## What candidates implement

Edit `src/settlement.js`:

- `validatePayment(event)` — 2% slippage tolerance check
- `triggerFulfillment(orderId)` — safe, retryable fulfillment with idempotency

## Test

```bash
npm test
```

## Verify

Open the frontend verification dashboard at **http://localhost:3000/verify** and use the Payments tab.

Simulate a fulfillment failure by sending an `orderId` ending in `_FAIL`.
