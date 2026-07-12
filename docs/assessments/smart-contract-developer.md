# NodeMeta Technical Assessment — Smart Contract Developer (60 min)

**Project folder:** `contracts/`  
**Verify your work:** http://localhost:3000/verify → **Smart Contract** tab

## Timebox (60 min)

| Block | Minutes | Focus |
|-------|---------|--------|
| Setup | 10 | `hardhat node` + deploy + paste addresses into `frontend/.env` |
| Implement | 40 | `Staking.sol` only |
| Verify | 10 | `/verify` green checks + run core tests |

Do **not** polish beyond the must-haves below. Partial credit is fine if core stake/rewards/unstake works.

## Setup

```bash
# Terminal 1
cd contracts && npx hardhat node

# Terminal 2
cd contracts && npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 (for verify dashboard)
cd frontend && npm run dev
```

Copy addresses from `contracts/deployed-addresses.json` into `frontend/.env` (`VITE_STAKING_ADDRESS`, `VITE_NFT_TOKEN_ADDRESS`, `VITE_REWARD_TOKEN_ADDRESS`, `VITE_MARKETPLACE_ADDRESS`, `VITE_CHAIN_ID=31337`, `VITE_RPC_URL=http://127.0.0.1:8545`), then refresh the frontend.

For `/verify` live checks only: connect MetaMask (or similar) to **Hardhat Localhost** (`chainId 31337`) and import a Hardhat account so you can sign Stake / Unstake. You do **not** implement wallet connect — it already exists in the frontend.

## Task

Implement `Staking.sol`. Do **not** modify `NFTToken.sol`, `RewardToken.sol`, or `NFTMarketplace.sol`.

## Requirements (must-have)

1. `stake(uint256 tokenId)` — transfer the caller's NFT into this contract and start reward tracking.
2. Rewards accrue at **10 NTE / day**, calculated **per-second** (use `REWARD_RATE_PER_SECOND`).
3. `pendingRewards(uint256 tokenId)` — return accrued rewards for a staked token.
4. `unstake(uint256 tokenId)` — only the original staker; return NFT + mint/pay accrued NTE; use `nonReentrant`.
5. Frontend verify — on `/verify` → **Smart Contract**, get these green: Staking deployed, `stake()` works, `pendingRewards()` increases, `unstake()` works.

## Nice-to-have (only if time remains)

- `getStakedTokens(address owner)`
- Extra edge-case tests beyond the core set

## Tests

Un-skip and implement **these 4** in `test/Staking.test.js` (ignore the rest if short on time):

1. should allow NFT owner to stake their token  
2. should reject staking by non-owner  
3. should return correct pending rewards after 1 day  
4. should allow unstaking and return NFT + rewards  

## Submission

- `Staking.sol`
- Updated `test/Staking.test.js` (at least the 4 core tests passing)
- Screenshot of `/verify` → Smart Contract with green checks
- 3-line note on one security tradeoff
