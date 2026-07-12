# NodeMeta Technical Assessment — Payments Backend Engineer (60 min)

**Project folder:** `payments/`  
**Verify your work:** http://localhost:3000/verify → **Payments** tab

## Timebox (60 min)

| Block | Minutes | Focus |
|-------|---------|--------|
| Setup | 5 | `npm start` + frontend |
| Implement | 40 | `src/settlement.js` only |
| Verify | 15 | `/verify` simulations + core tests |

Do **not** modify `src/server.js` or `lib/fulfillmentApi.js`.

## Setup

```bash
# Terminal 1
cd payments && npm install && npm start

# Terminal 2
cd frontend && npm run dev
```

Confirm the **Payments** status card on `/verify` is green (default port **3003**).

No wallet work on this track — settlement is webhook/event driven. You do **not** need to connect MetaMask to implement or verify payments.

## Task

Implement `validatePayment` and `triggerFulfillment` in `src/settlement.js`.

## Requirements (must-have)

1. `validatePayment(event)` — accept if `tokenAmount * tokenPriceAtOrderTime` is within **2%** of `expectedAmount` (i.e. computed >= `expectedAmount * 0.98`). Return `{ valid: true }` or `{ valid: false, reason }`.
2. `triggerFulfillment(orderId)` — call `fulfillmentApi.fulfillOrder(orderId)`; on failure (`orderId` ending `_FAIL`), do **not** mark paid; keep retryable.
3. Idempotency — same `orderId` processed at most once; duplicates return already-processed without fulfilling again.
4. Frontend verify — on `/verify` → **Payments**, all four buttons work: Valid accept, Over-Slippage reject, Duplicate not twice, `_FAIL` not marked paid.
5. Implement **at least 4** tests in `test/settlement.test.js` covering valid, over-slippage, duplicate, and fulfillment failure.

## Nice-to-have (only if time remains)

- Extra malformed-event tests
- In-memory metrics / logging polish

## How to Verify

1. Restart: `npm start`
2. Open http://localhost:3000/verify → **Payments**
3. Click all four simulation buttons
4. `npm test`

## Submission

- `src/settlement.js`
- Updated `test/settlement.test.js`
- Screenshot of `/verify` → Payments responses
- 2–3 lines on high-volume design (queues / distributed idempotency)
