use anchor_lang::prelude::*;

use crate::{FlywheelConfig, FlywheelError, ConfigUpdated};

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.config_bump,
        constraint = config.admin == admin.key() @ FlywheelError::Unauthorized,
    )]
    pub config: Account<'info, FlywheelConfig>,
}

pub fn update_config(
    ctx: Context<UpdateConfig>,
    buyback_bps: Option<u16>,
    burn_bps: Option<u16>,
    min_interval_seconds: Option<u64>,
    treasury_wallet: Option<Pubkey>,
) -> Result<()> {
    let config = &mut ctx.accounts.config;

    if let Some(new_buyback) = buyback_bps {
        config.buyback_bps = new_buyback;
    }

    if let Some(new_burn) = burn_bps {
        config.burn_bps = new_burn;
    }

    // Validate BPS sum
    require!(
        config.buyback_bps + config.burn_bps <= 10000,
        FlywheelError::InvalidBpsSum
    );

    // Recalculate lp_add_bps
    config.lp_add_bps = 10000u16
        .checked_sub(config.buyback_bps)
        .ok_or(FlywheelError::MathOverflow)?
        .checked_sub(config.burn_bps)
        .ok_or(FlywheelError::MathOverflow)?;

    if let Some(new_interval) = min_interval_seconds {
        config.min_interval_seconds = new_interval;
    }

    if let Some(new_treasury) = treasury_wallet {
        config.treasury_wallet = Some(new_treasury);
    }

    emit!(ConfigUpdated {
        buyback_bps,
        burn_bps,
        min_interval_seconds,
        timestamp: Clock::get()?.unix_timestamp as u64,
    });

    Ok(())
}
