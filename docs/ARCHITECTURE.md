# 2k26ball Architecture

## Overview

2k26ball is a Solana Anchor program that manages an automated "flywheel" mechanism for a token. Creator fees are collected and automatically split into buybacks and burns according to BPS (basis points) configuration, all happening transparently on-chain.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Fee Sources                           │
│                  (Creator Earnings)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │    Fee Vault (Token Account)  │
        │  (Holds accumulated fees)     │
        └──────────────┬────────────────┘
                       │
                       ▼
    ┌────────────────────────────────────┐
    │   FlywheelConfig (PDA Account)      │
    │                                    │
    │  • admin (signer authority)        │
    │  • token_mint (2k26ball)           │
    │  • fee_vault (token account)       │
    │  • buyback_bps (e.g., 5000 = 50%)  │
    │  • burn_bps (e.g., 5000 = 50%)     │
    │  • epoch_start / epoch_end         │
    │  • min_interval_seconds            │
    │  • last_execution (timestamp)      │
    │  • Stats (total fees, burned, etc) │
    └────────────────┬───────────────────┘
                     │
    ┌────────────────┴────────────────┐
    │   execute_flywheel()            │
    │                                 │
    │ 1. Verify time window           │
    │ 2. Check interval gating        │
    │ 3. Calculate BPS splits         │
    │ 4. Swap & burn logic            │
    │ 5. Emit events                  │
    │ 6. Update stats                 │
    └────────────────┬────────────────┘
    │
    ├─ Buyback Portion
    │  └─ Mock Swap: fees → 2k26ball
    │
    ├─ Burn Portion
    │  └─ Burn tokens from vault
    │
    └─ LP Add Portion
       └─ Stub for future integration
```

## Account Structure

### FlywheelConfig (PDA)

**Seed:** `[b"config"]`

**Fields:**
- `admin: Pubkey` — authorized to update config, emergency withdraw
- `token_mint: Pubkey` — 2k26ball mint address
- `fee_vault: Pubkey` — SPL token account for fee collection
- `buyback_bps: u16` — basis points for buyback (0-10000)
- `burn_bps: u16` — basis points for burn (0-10000)
- `lp_add_bps: u16` — basis points for LP add (calculated: 10000 - buyback - burn)
- `epoch_start: u64` — Unix timestamp for 2026 window start
- `epoch_end: u64` — Unix timestamp for 2026 window end
- `min_interval_seconds: u64` — anti-spam execution delay
- `last_execution: u64` — timestamp of last execution
- `treasury_wallet: Option<Pubkey>` — optional admin withdrawal address
- `total_fees_collected: u64` — cumulative fees in
- `total_bought_back: u64` — cumulative bought back
- `total_burned: u64` — cumulative burned
- `total_lp_added: u64` — cumulative LP added
- `config_bump: u8` — PDA bump seed

### ExecutionLog (Optional Archive)

For future expansions, logs can track individual executions.

## Instructions

### 1. `initialize_config`

**Signers:** Payer (pays for account creation)

**Params:**
- `admin` — initial admin address
- `token_mint` — 2k26ball mint
- `buyback_bps` — initial buyback percentage
- `burn_bps` — initial burn percentage
- `epoch_start` — 2026 window start
- `epoch_end` — 2026 window end
- `min_interval_seconds` — execution delay
- `treasury_wallet` — optional

**Validation:**
- `buyback_bps + burn_bps <= 10000` (must fit in 100%)
- Fee vault mint must match token_mint

**Events:** `ConfigInitialized`

### 2. `update_config`

**Signers:** Admin

**Params:**
- `buyback_bps` — optional new value
- `burn_bps` — optional new value
- `min_interval_seconds` — optional new value
- `treasury_wallet` — optional new value

**Validation:**
- Caller must be admin
- BPS sum must be valid

**Events:** `ConfigUpdated`

### 3. `deposit_fees`

**Signers:** Depositor

**Params:**
- `amount` — tokens to transfer into vault

**Process:**
1. Transfer tokens from depositor → fee_vault (via SPL token transfer)
2. Emit `FeesDeposited` event

**Events:** `FeesDeposited`

### 4. `execute_flywheel`

**Signers:** Executor (permissionless unless outside epoch)

**Logic:**
1. **Window Check:** If outside epoch, only admin can execute
2. **Interval Check:** Verify time since `last_execution >= min_interval_seconds`
3. **Vault Check:** Require vault balance > 0
4. **BPS Splits:** Calculate buyback, burn, lp_add amounts
5. **Swap Mock:** Simulate buyback via mock adapter (transfer from mock pool)
6. **Burn:** Burn acquired tokens + direct burn portion
7. **Update State:**
   - Increment `last_execution`
   - Add to totals
8. **Events:** `FlywheelExecuted`, `TokensBurned`

**Edge Cases:**
- Outside epoch → only admin can execute
- Insufficient interval → fail
- Empty vault → fail
- Overflow checks → fail gracefully

### 5. `emergency_withdraw`

**Signers:** Admin

**Params:**
- None

**Process:**
1. Verify caller is admin
2. Transfer entire vault balance to specified recipient
3. Emit `EmergencyWithdrawn` event

## Event Types

All events are emitted as Anchor events for indexing:

```rust
#[event]
pub struct ConfigInitialized {
    pub admin: Pubkey,
    pub token_mint: Pubkey,
    pub fee_vault: Pubkey,
    pub buyback_bps: u16,
    pub burn_bps: u16,
    pub epoch_start: u64,
    pub epoch_end: u64,
    pub timestamp: u64,
}

#[event]
pub struct FeesDeposited {
    pub amount: u64,
    pub vault_balance: u64,
    pub depositor: Pubkey,
    pub timestamp: u64,
}

#[event]
pub struct FlywheelExecuted {
    pub fees_processed: u64,
    pub buyback_amount: u64,
    pub burn_amount: u64,
    pub lp_add_amount: u64,
    pub timestamp: u64,
}

#[event]
pub struct TokensBurned {
    pub amount: u64,
    pub total_supply: u64,
    pub timestamp: u64,
}

#[event]
pub struct EmergencyWithdrawn {
    pub amount: u64,
    pub recipient: Pubkey,
    pub timestamp: u64,
}
```

## Dashboard Integration

The Next.js app provides:

1. **Landing Page** (`/`)
   - Flywheel explanation
   - Key features
   - Configuration overview

2. **Dashboard** (`/dashboard`)
   - Live config display
   - Totals (fees, buyback, burned, LP)
   - Event activity feed
   - On-chain verification links

3. **Admin Panel** (`/admin`, client-side wallet check)
   - Initialize config
   - Update config (admin-only)
   - Deposit fees
   - Execute flywheel

4. **API Routes**
   - `/api/config` — fetch on-chain config
   - `/api/events` — indexer-lite cached events
   - `/api/initialize`, `/api/update-config`, etc. — transaction builders

## Indexer-Lite

Simple in-memory caching layer:

1. **Fetch recent signatures** from `getProgramAccounts()`
2. **Parse Anchor events** from transaction logs
3. **Cache for 5 seconds** in memory
4. **Serve via `/api/events`**

For production, replace with a proper indexer (e.g., Helius, Magic Eden API, or custom Solana indexer).

## Security Model

**Admin Controls:**
- `update_config` — restricted to admin
- `emergency_withdraw` — restricted to admin

**Public Functions:**
- `deposit_fees` — open to anyone
- `execute_flywheel` — permissionless within epoch window; admin-only outside

**Gating Mechanisms:**
- **Epoch Window:** Restricts normal execution to 2026
- **Interval Gating:** Prevents rapid-fire executions (spam protection)
- **BPS Validation:** Ensures valid fee splits

**Math Safety:**
- All arithmetic uses Rust `checked_*` methods
- Overflow returns error instead of panicking
- Division is safe (BPS is small, total checked)

## Future Extensions

1. **Jupiter Integration:** Replace mock swap with real Jupiter quote+swap
2. **Raydium LP:** Implement actual liquidity pool additions
3. **Governance:** Add DAO vote for config changes
4. **Multi-Vault:** Support multiple fee vaults
5. **Custom Callbacks:** Allow smart contract fee generators
6. **Burn Mechanism v2:** Optional token decay or stake-to-recover

---

**Version:** 0.1.0 (Experimental)
