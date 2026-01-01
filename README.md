# 2k26ball

AapjoUdnSwKFqUN3N4Xtm37VSCCXwFyZXtdnaPgJpump

![Gemini_Generated_Image_hkai8zhkai8zhkai (1)](https://github.com/user-attachments/assets/cb30a9a4-6aa1-4749-ad2f-584f1f6725a5)


**Creator fees fuel an always-on 2026 flywheel: buybacks + burns.**

2k26ball is a Snowball-style token for 2026 that transforms creator fees into perpetual value generation. An on-chain automated flywheel splits collected fees into buybacks and burns, with optional liquidity additions—all executed transparently and governed by BPS (basis points) configuration.

## What is 2k26ball?

2k26ball is a Solana token experiment that demonstrates a sustainable fee-based token model:
- **Creators** earn fees on transactions or special events.
- **Fees** automatically flow into a vault.
- **The Flywheel** executes on-demand to:
  - Swap fees for 2k26ball tokens (buyback)
  - Burn acquired tokens (supply reduction)
  - Optionally add liquidity (community support)

All actions are tracked transparently on-chain with event logs and a live dashboard.

## How the Flywheel Works

```
┌─────────────────────────────────────────────────────────┐
│                    Creator Fees In                      │
│                    ↓                                    │
│              Fee Vault (holds any token)                │
│                    ↓                                    │
│           execute_flywheel() (permissionless)           │
│                    ↓                                    │
│   ┌──────────────────────────────────────────────────┐ │
│   │ Split by Basis Points (BPS config)               │ │
│   │                                                  │ │
│   ├─ Buyback (e.g., 5000 bps = 50%)                 │ │
│   │  └─ Swap fees → 2k26ball (via mock adapter)     │ │
│   │     └─ Burn acquired tokens                     │ │
│   │                                                  │ │
│   └─ LP Add (optional, e.g., 0 bps)                 │ │
│      └─ Add liquidity to pool (stub for now)        │ │
│                                                      │ │
│   ✓ All with interval gating & 2026 window checks   │ │
└──────────────────────────────────────────────────────┘ │
                         ↓                                 │
            Verify Results on Dashboard                   │
            • Fees collected                              │
            • Total buyback + burned                      │
            • Event history                               │
└─────────────────────────────────────────────────────────┘
```

## Key Features

- **Transparent**: All fee inflows, buybacks, and burns are logged as on-chain events.
- **Configurable**: Admin can adjust buyback/burn split (BPS) and timing rules.
- **Gated**: Flywheel only executes within a 2026 window; outside that, only admin can trigger.
- **Tested**: Comprehensive unit tests validate BPS math, authorization, and edge cases.
- **Dashboard**: Real-time web UI showing totals, recent events, and on-chain verification links.

## Setup

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **pnpm** 8+ (monorepo package manager)
- **Rust** (for Anchor) — install via [rustup](https://rustup.rs/)
- **Anchor CLI** — `cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked`
- **Solana CLI** — follow [docs.solanalabs.com](https://docs.solanalabs.com/cli/install)

### Local Development

```bash
# Clone and install all dependencies
git clone <repo-url>
cd 2k26ball
pnpm install

# Start local validator + deploy program + run app
pnpm dev
```

This single command:
1. Starts a local Solana validator on port 8899
2. Deploys the Anchor program
3. Initializes on-chain config with defaults
4. Starts the Next.js app on port 3000

### What `pnpm dev` Does

- Launches `solana-test-validator` in background
- Runs `anchor build` and `anchor deploy` in `programs/2k26ball`
- Initializes config via `scripts/init.ts`
- Starts Next.js dev server at `http://localhost:3000`

## Deployment

### Devnet Deployment

```bash
# Set RPC to devnet
solana config set --url https://api.devnet.solana.com

# Build program
cd programs/2k26ball && anchor build

# Deploy
anchor deploy

# Write program ID to app env
node scripts/deploy.ts

# Initialize config
npx ts-node scripts/init.ts

# Verify
npx ts-node scripts/smoke.ts
```

### Mainnet

⚠️ **Not recommended yet.** This is an experimental project. See [SECURITY.md](SECURITY.md).

## Project Structure

```
2k26ball/
├── programs/
│   └── 2k26ball/
│       ├── src/
│       │   ├── lib.rs
│       │   ├── state.rs
│       │   └── instructions/
│       │       ├── initialize_config.rs
│       │       ├── update_config.rs
│       │       ├── deposit_fees.rs
│       │       ├── execute_flywheel.rs
│       │       └── emergency_withdraw.rs
│       ├── tests/
│       │   ├── integration.ts
│       │   └── unit.ts
│       └── Cargo.toml
├── app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx (landing)
│   │   │   ├── dashboard.tsx
│   │   │   ├── admin.tsx
│   │   │   └── api/
│   │   │       └── events.ts (indexer-lite)
│   │   ├── components/
│   │   ├── lib/
│   │   └── _app.tsx
│   ├── public/
│   ├── next.config.js
│   └── package.json
├── scripts/
│   ├── deploy.ts
│   ├── init.ts
│   ├── exec.ts
│   └── smoke.ts
├── docs/
│   ├── ARCHITECTURE.md
│   └── SECURITY.md
├── package.json (root, pnpm workspace)
├── pnpm-workspace.yaml
├── README.md (this file)
├── LICENSE (MIT)
├── .gitignore
├── .editorconfig
└── prettier.config.js
```

## Configuration

The on-chain config stores:
- **admin** — address authorized to update config or emergency withdraw
- **token_mint** — 2k26ball token mint
- **fee_vault** — vault holding collected fees
- **buyback_bps** — basis points for buyback (e.g., 5000 = 50%)
- **burn_bps** — basis points for burn (e.g., 5000 = 50%)
- **epoch_start** — Unix timestamp for 2026 window start
- **epoch_end** — Unix timestamp for 2026 window end
- **min_interval_seconds** — minimum seconds between flywheel executions
- **last_execution** — timestamp of last execution
- **treasury_wallet** — optional admin wallet for withdrawn fees

Example initialization:
```bash
npx ts-node scripts/init.ts \
  --mint 2k26ball-mint-address \
  --buyback-bps 5000 \
  --burn-bps 5000 \
  --epoch-start 1735689600 \
  --epoch-end 1767225600 \
  --interval 3600
```

## Usage

### Deposit Fees

Any creator or caller can deposit fees into the vault:

```bash
npx ts-node scripts/deposit.ts --amount 1000000000 # 1 USDC (with 6 decimals)
```

### Execute Flywheel

Permissionless execution (respects config window & intervals):

```bash
npx ts-node scripts/exec.ts
```

Outputs:
- Amount swapped
- Amount burned
- Event logs

### View Dashboard

Open http://localhost:3000 to see:
- **Landing**: Overview and flywheel explanation
- **Dashboard**: Live totals and event feed
- **Admin**: (if wallet owner is admin) initialize, update, execute, and deposit

## Security

⚠️ **Experimental software. Not audited. Do not use with real funds.**

See [SECURITY.md](SECURITY.md) for:
- Known risks and limitations
- Security checklist
- Recommended audit scope
- Upgrade path

## Testing

```bash
# Run all tests
pnpm test

# Anchor unit tests
cd programs/2k26ball && anchor test

# Next.js type checking
cd app && pnpm typecheck

# Lint
pnpm lint
```

## Contributing

This is an experimental project for educational purposes. Contributions welcome, but please:
1. Review [SECURITY.md](SECURITY.md)
2. Add tests for any new instructions
3. Update event structs if modifying flywheel logic
4. Follow eslint + prettier configs

## License

MIT License — see [LICENSE](LICENSE) file.

## FAQ

**Q: Can I deploy to mainnet?**
A: Not yet. This is experimental. See SECURITY.md.

**Q: What if the flywheel executes outside 2026?**
A: If outside the configured window, only the admin can trigger. Normal users see a "window closed" message.

**Q: Can I customize the buyback/burn split?**
A: Yes, via `update_config` (admin-only). BPS values must sum to 10,000 or less.

**Q: Where is the swap happening?**
A: Currently, a mock adapter. Plans to integrate Jupiter or Raydium in v2.

**Q: Is there a frontend for non-technical users?**
A: Yes! The Next.js dashboard provides a web UI for wallet holders and admins.

---

**Built with Anchor, Next.js, and Solana.**
