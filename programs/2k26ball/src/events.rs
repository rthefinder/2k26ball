use anchor_lang::prelude::*;

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
pub struct ConfigUpdated {
    pub buyback_bps: Option<u16>,
    pub burn_bps: Option<u16>,
    pub min_interval_seconds: Option<u64>,
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
