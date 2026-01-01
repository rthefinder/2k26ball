use anchor_lang::prelude::*;

#[account]
pub struct FlywheelConfig {
    // Authorities
    pub admin: Pubkey,

    // Token & vault
    pub token_mint: Pubkey,
    pub fee_vault: Pubkey,

    // Flywheel config (BPS = basis points, 10000 = 100%)
    pub buyback_bps: u16,
    pub burn_bps: u16,
    pub lp_add_bps: u16,  // 10000 - buyback_bps - burn_bps = lp_add_bps
    
    // 2026 window (Unix timestamps)
    pub epoch_start: u64,
    pub epoch_end: u64,

    // Execution gating
    pub min_interval_seconds: u64,
    pub last_execution: u64,

    // Treasury (optional)
    pub treasury_wallet: Option<Pubkey>,

    // Stats
    pub total_fees_collected: u64,
    pub total_bought_back: u64,
    pub total_burned: u64,
    pub total_lp_added: u64,

    // Bump seed
    pub config_bump: u8,

    // Padding for future expansion
    pub _reserved: [u8; 128],
}

impl FlywheelConfig {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // token_mint
        32 + // fee_vault
        2 + // buyback_bps
        2 + // burn_bps
        2 + // lp_add_bps
        8 + // epoch_start
        8 + // epoch_end
        8 + // min_interval_seconds
        8 + // last_execution
        1 + 32 + // treasury_wallet (1 byte for Option, 32 for Pubkey)
        8 + // total_fees_collected
        8 + // total_bought_back
        8 + // total_burned
        8 + // total_lp_added
        1 + // config_bump
        128; // _reserved
}

#[account]
pub struct ExecutionLog {
    pub config: Pubkey,
    pub timestamp: u64,
    pub fees_in: u64,
    pub buyback_amount: u64,
    pub burn_amount: u64,
    pub lp_add_amount: u64,
    pub bump: u8,
}

impl ExecutionLog {
    pub const LEN: usize = 8 + // discriminator
        32 + // config
        8 + // timestamp
        8 + // fees_in
        8 + // buyback_amount
        8 + // burn_amount
        8 + // lp_add_amount
        1; // bump
}
