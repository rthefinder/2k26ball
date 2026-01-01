# Security

## Status

⚠️ **EXPERIMENTAL AND NOT AUDITED**

This is a proof-of-concept project. Do NOT use with real funds, real user data, or in production without a professional security audit.

## Known Risks

### 1. Unaudited Smart Contract

- No professional security review
- Limited internal testing (unit tests only)
- No formal verification
- Potential logic errors in burn/swap math

**Mitigation:** Use on testnet only. Get audited before mainnet.

### 2. Mock Swap Adapter

- Current implementation does not perform real swaps
- Mock pool transfer is a placeholder
- No actual market impact or price discovery
- In production, integrate Jupiter/Raydium with proper slippage checks

**Mitigation:** Implement proper swap adapter with slippage protection.

### 3. Epoch Window Gating

- Outside 2026, only admin can execute
- No decentralized governance over epoch dates
- Admin could extend window indefinitely

**Mitigation:** Plan for DAO transition or multisig for admin key.

### 4. Interval Gating is Weak Anti-Spam

- `min_interval_seconds` prevents frequent execution but doesn't cap gas
- No tx size limits or bandwidth throttling
- Could be abused for spam with many small executions

**Mitigation:** Set reasonable interval (e.g., 1 hour). Monitor chain activity.

### 5. Token Vault is Single Account

- All fees go to one SPL token account owned by the program
- Loss of private key = loss of authority to manage
- No multi-sig or threshold governance

**Mitigation:** Use governance to update config. Never share admin key.

### 6. No Reentrancy Guards

- Token transfer is safe (SPL program handles it)
- But future LP add or swap logic needs careful CPI ordering

**Mitigation:** Add guards when integrating Jupiter/Raydium.

### 7. Integer Math Rounding

- BPS division may have rounding errors
- Example: 10001 tokens split 33% buyback = 3300.33 (rounds down to 3300)
- May leave dust in vault

**Mitigation:** Document rounding. Sweep dust in periodic admin calls.

### 8. No Input Validation on Treasury Wallet

- If treasury wallet is invalid, emergency_withdraw could fail
- No pre-check that recipient token account exists

**Mitigation:** Add validate_recipient_account instruction before withdrawal.

## Security Checklist

### Before Testnet Deploy

- [ ] Code review by 1-2 team members
- [ ] All unit tests passing
- [ ] Anchor build succeeds without warnings
- [ ] `.solana/test-ledger/` is clean (fresh local validator)
- [ ] Environment variables correctly set

### Before Devnet Deploy

- [ ] Testnet run successful
- [ ] Manual tests on devnet (send real devnet SOL)
- [ ] Frontend wallet integration tested
- [ ] Event parsing working in indexer-lite
- [ ] No hardcoded keys in production env

### Before Mainnet (NOT RECOMMENDED)

- [ ] Professional audit by top firm (cost: $10k-50k+)
- [ ] All audit findings resolved
- [ ] Formal verification of math
- [ ] DAO governance established
- [ ] Multisig for admin key (minimum 2-of-3)
- [ ] Emergency pause mechanism
- [ ] Upgrade authority transferred to governance
- [ ] Insurance or risk pool established
- [ ] Public disclosure of known risks
- [ ] Liability waiver reviewed by legal

## Vulnerability Classes

### Not Addressed (Yet)

1. **Front-Running**
   - No ordering guarantee on Solana, but no MEV incentive on public flywheel execution

2. **Flash Loans**
   - Not applicable (we don't mint new tokens or use leveraged positions)

3. **Oracle Manipulation**
   - We don't use price oracles yet
   - Mock swap is hardcoded

4. **Delegation/Authority**
   - Single admin; no recovery mechanism

5. **Upgrade Authority**
   - Not currently managed; program upgrade requires redeployment

## Recommended Audit Scope

If commissioning an audit, include:

1. **Arithmetic Correctness**
   - BPS splits don't lose funds
   - No overflow/underflow on edge cases
   - Rounding behavior documented

2. **Authorization Checks**
   - Only admin can update config
   - Only admin can emergency withdraw
   - Window gating enforced

3. **State Consistency**
   - Config PDA created correctly
   - Bump seed handling
   - Event logging matches state

4. **Token Operations**
   - Correct SPL token program invocations
   - Burn is implemented safely
   - Transfer math is correct

5. **Integration with Jupiter/Raydium** (future)
   - CPI context signatures
   - Slippage limits
   - Pool account validation

## Incident Response

If a critical bug is found:

1. **Pause Execution**
   - Set `min_interval_seconds` to very large value
   - Announce publicly

2. **Emergency Withdraw**
   - Admin calls `emergency_withdraw` to secure funds
   - Notify all stakeholders

3. **Redeploy**
   - Fix smart contract
   - Recompile and test thoroughly
   - Deploy new version
   - Migrate state if necessary

4. **Post-Mortem**
   - Document root cause
   - Implement preventive measures
   - Update documentation

## Testing Strategy

### Unit Tests (Anchor)
- BPS math validation
- Authorization checks
- Epoch window gating
- Interval gating
- Burn reduces supply
- Event emission

### Integration Tests (TypeScript)
- End-to-end flow: init → deposit → execute → verify
- Multiple epochs
- Admin transitions
- Emergency withdraw

### Manual Testing
- Devnet deployment
- Frontend interaction
- Event indexing
- Solana Explorer verification

### Fuzz Testing (Future)
- Random BPS combinations
- Random amounts
- Malformed accounts
- Out-of-order instructions

## Dependency Review

### Anchor 0.29
- Actively maintained
- Used by major Solana projects
- No known 0-days
- Recommended updates: check monthly

### Solana Web3.js
- Standard RPC library
- No access to secret keys in app code
- Wallet adapter handles signing

### SPL Token
- Standard token program
- Audited and battle-tested
- No custom token logic

## Compliance Notes

This project does NOT provide:
- Financial advice
- Investment recommendations
- Guarantees of returns
- Custody of user funds

Users are responsible for:
- Understanding smart contract risks
- Reviewing code before use
- Protecting private keys
- Accepting total loss possibility

## Contact

For security issues, please disclose responsibly:
1. Do NOT post in public issues
2. Email: security@example.com (if established)
3. Allow time for response before disclosure

---

**Last Updated:** 2025-01-01
**Audit Status:** Not audited
**Production Ready:** NO
