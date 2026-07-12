# NodeMeta Technical Assessment

A full-stack NFT marketplace on **BNB Smart Chain** used for technical hiring assessments.

## Project Structure

- `/contracts` — Smart Contract Developer assessment (Solidity, Hardhat, OpenZeppelin v5)
- `/backend` — Backend Engineer assessment (Node.js, Express, REST API)
- `/frontend` — Frontend Engineer assessment (React, Wagmi, RainbowKit, Tailwind CSS v3)
- `/payments` — Payments Backend Engineer assessment (Node.js, Express, settlement logic)

## Quick Start (all services)

```bash
# Terminal 1 — Local blockchain
cd contracts && npm install && npx hardhat node

# Terminal 2 — Deploy contracts to local
cd contracts && npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 — Backend
cd backend && npm install && npm run dev

# Terminal 4 — Payments (port 3003)
cd payments && npm install && npm start

# Terminal 5 — Frontend
cd frontend && npm install && npm run dev
```

Open **http://localhost:3000/verify** to see the verification dashboard.

## Network

- **BSC Testnet** — chainId `97`, RPC `https://data-seed-prebsc-1-s1.bnb.org:8545/`
- **Localhost** — chainId `31337` (Hardhat node)
- **Testnet faucet:** https://www.bnbchain.org/en/testnet-faucet

## For Candidates

Each role is a **60-minute** take-home. See your brief in `docs/assessments/`:

| Role | Brief | Timebox |
|------|-------|---------|
| Smart Contract Developer | [smart-contract-developer.md](docs/assessments/smart-contract-developer.md) | Setup 10 · Code 40 · Verify 10 |
| Backend Engineer | [backend-engineer.md](docs/assessments/backend-engineer.md) | Setup 5 · Code 40 · Verify 15 |
| Frontend Engineer (Web3) | [frontend-engineer-web3.md](docs/assessments/frontend-engineer-web3.md) | Setup 10 · Code 40 · Verify 10 |
| Payments Backend Engineer | [payments-backend-engineer.md](docs/assessments/payments-backend-engineer.md) | Setup 5 · Code 40 · Verify 15 |

Work **only** in your assigned folder. Ship must-haves first; nice-to-haves are optional if time remains.
After implementing, open **http://localhost:3000/verify** to confirm your work.

Wallet connect is a **Frontend** must-have (and tooling for Smart Contract `/verify` txs). Backend/Payments do not require building or connecting a wallet — see your brief.

## Assessment Note

This is a self-contained exercise using mock contracts and test data.
This is not production code — we will not deploy or use your implementation.
You own everything you write.

## API Endpoints

### Working (infrastructure)
- `GET /health` — API health check
- `GET /api/v1/nfts` — 10 pre-seeded NFTs
- `GET /api/v1/nfts/:id` — Single NFT
- `GET /api/v1/nfts/:id/metadata` — ERC721 metadata
- `GET /api/v1/nfts/marketplace/listings` — Listed NFTs

### Stubbed (candidate implements)
- `GET /api/v1/nfts/:id/history` — NFT transfer/listing history
- `POST /api/v1/nfts/:id/bid` — Place a bid
- `GET /api/v1/transactions/user/:address` — Paginated user transactions

## Smart Contracts

| Contract | Status |
|----------|--------|
| `RewardToken.sol` (NTE) | Fully implemented |
| `NFTToken.sol` | Fully implemented |
| `NFTMarketplace.sol` | Fully implemented |
| `Staking.sol` | **Stubbed — candidate implements** |

## Verification Dashboard

The `/verify` page has 4 tabs — one per role. Each shows live status:
- Green checkmarks for working features
- Red X for unimplemented or failing features
- Connection status for backend, payments, and wallet

## Useful Commands

```bash
make install      # Install all dependencies
make backend-dev  # Start backend on :8080
make frontend-dev # Start frontend on :3000
make test         # Run all tests
```
