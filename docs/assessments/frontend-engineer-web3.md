# NodeMeta Technical Assessment — Frontend Engineer — Web3 (60 min)

**Project folder:** `frontend/`  
**Verify your work:** http://localhost:3000/verify → **Frontend** tab

## Timebox (60 min)

| Block | Minutes | Focus |
|-------|---------|--------|
| Setup | 10 | hardhat node + deploy + backend + `npm run dev` |
| Implement | 40 | Stake / Unstake / rewards / loading / errors on NFT detail |
| Verify | 10 | Tick **must-have** checklist items on `/verify` |

Focus on **`src/pages/NFTDetail.tsx`** (and a small hook if helpful). Do **not** rebuild the app or redesign UI.

## Setup

```bash
# Terminal 1
cd contracts && npx hardhat node
# Terminal 2
cd contracts && npx hardhat run scripts/deploy.js --network localhost
# Terminal 3
cd backend && npm run dev
# Terminal 4
cd frontend && npm run dev
```

Paste deployed addresses into `frontend/.env`, then refresh.

**Connect a wallet** to **Hardhat Localhost** (`chainId 31337`) via the app header (RainbowKit). Stake / Unstake on `/nft/:id` and `/verify` require a connected account — tick **Wallet connects and shows address** only after you confirm it yourself.

## Task

Wallet connect UI and NFT listing already work. Implement the stubbed Web3 handlers on top of a connected wallet.

## Requirements (must-have)

1. **Wallet connected** — candidate connects a wallet; address visible in the UI; `/verify` Wallet card green on localhost before staking checks.
2. **Stake** — call staking `stake(tokenId)` from the connected account; show loading while pending; refresh after confirm.
3. **Unstake** — call `unstake(tokenId)`; loading + refresh; show paid rewards if available.
4. **Pending rewards** — call `pendingRewards(tokenId)` and auto-refresh every **10 seconds**.
5. **Errors + double-submit guard** — user-friendly errors (reject / revert / funds); disable Stake/Unstake while a tx is in flight.
6. Frontend verify — on `/verify` → **Frontend**, tick the **must-have** items after real testing: wallet connected, stake loading, unstake loading, rewards auto-refresh, error on reject, buttons disabled in-flight.

## Nice-to-have (only if time remains)

- Buy NFT from marketplace
- Bid form POST to `/api/v1/nfts/:id/bid`

## How to Verify

1. Open http://localhost:3000/verify → **Frontend**
2. Also exercise `/nft/1` with a connected wallet on localhost
3. Tick only must-have items that actually work

## Submission

- Your handler / hook changes
- Screenshot of `/verify` → Frontend with must-have boxes ticked
- 2–3 lines on what you'd add for production
