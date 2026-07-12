# NodeMeta Technical Assessment — Backend Engineer (60 min)

**Project folder:** `backend/`  
**Verify your work:** http://localhost:3000/verify → **Backend** tab

## Timebox (60 min)

| Block | Minutes | Focus |
|-------|---------|--------|
| Setup | 5 | `npm run dev` (backend + frontend) |
| Implement | 40 | 3 stubbed endpoints in `server.js` |
| Verify | 15 | `/verify` Backend tab + core tests |

Work only against existing seed data in `data/seedData.js`. Do **not** redesign the API or add a database.

## Setup

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Confirm the **Backend** status card on `/verify` is green.

Optional for `/verify`: connect any wallet in the frontend so Submit Bid / Fetch User Transactions can pass your address. You do **not** build wallet auth, SIWE, or signature verification — `bidder` / `:address` are plain strings from the request.

## Task

Implement the three stubbed endpoints. Keep existing middleware/seed shape.

## Requirements (must-have)

1. `GET /api/v1/nfts/:id/history` — return that NFT's `history`, newest-first; **404** if NFT missing.
2. `POST /api/v1/nfts/:id/bid` — body `{ bidder, amount }`. Reject with **400** if `amount` is not higher than the current highest bid (use listing `price` as the starting floor if no bids yet). Record the bid and return the updated NFT/listing.
3. `GET /api/v1/transactions/user/:address` — filter `baseTransactions` by address; support `?page=1&limit=10`; return empty list (not 404) when none.
4. No unhandled 500s on bad input (return 400/404 with a clear message).
5. Frontend verify — on `/verify` → **Backend**, successfully: Fetch History, Submit Bid (valid), Submit Bid (low → 400), Fetch User Transactions.

## Nice-to-have (only if time remains)

- Extra edge-case tests beyond the core set
- Persisting bids across process restarts (not required)

## Tests

Implement **at least 3** assertions in `test/marketplace.test.js` covering:

1. history 404 for unknown id  
2. bid rejected when too low  
3. user transactions returns an array (possibly empty)

## Submission

- Endpoint implementations in `server.js`
- Updated `test/marketplace.test.js`
- Screenshot of `/verify` → Backend with successful responses
- 2–3 lines on how you'd add indexing later
