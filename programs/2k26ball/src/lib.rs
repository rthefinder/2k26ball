use anchor_lang::prelude::*;

mod instructions;
mod state;
mod errors;
mod events;

pub use instructions::*;
pub use state::*;
pub use errors::*;
pub use events::*;

declare_id!("2k26BoL1eUfFhqFXRdVH5p1FCd9mFhfhyMZBZyH3A7TJ");

#[program]
pub mod two_k_26_ball {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        admin: Pubkey,
        token_mint: Pubkey,
        buyback_bps: u16,
        burn_bps: u16,
        epoch_start: u64,
        epoch_end: u64,
        min_interval_seconds: u64,
        treasury_wallet: Option<Pubkey>,
    ) -> Result<()> {
        instructions::initialize_config(
            ctx,
            admin,
            token_mint,
            buyback_bps,
            burn_bps,
            epoch_start,
            epoch_end,
            min_interval_seconds,
            treasury_wallet,
        )
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        buyback_bps: Option<u16>,
        burn_bps: Option<u16>,
        min_interval_seconds: Option<u64>,
        treasury_wallet: Option<Pubkey>,
    ) -> Result<()> {
        instructions::update_config(ctx, buyback_bps, burn_bps, min_interval_seconds, treasury_wallet)
    }

    pub fn deposit_fees(ctx: Context<DepositFees>, amount: u64) -> Result<()> {
        instructions::deposit_fees(ctx, amount)
    }

    pub fn execute_flywheel(ctx: Context<ExecuteFlywheel>) -> Result<()> {
        instructions::execute_flywheel(ctx)
    }

    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        instructions::emergency_withdraw(ctx)
    }
}
