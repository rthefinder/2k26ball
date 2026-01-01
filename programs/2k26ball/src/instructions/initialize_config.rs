use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::{FlywheelConfig, FlywheelError, ConfigInitialized};

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        constraint = fee_vault.mint == token_mint.key(),
    )]
    pub fee_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = payer,
        space = FlywheelConfig::LEN,
        seeds = [b"config"],
        bump,
    )]
    pub config: Account<'info, FlywheelConfig>,

    pub system_program: Program<'info, System>,
}

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
    require!(
        buyback_bps + burn_bps <= 10000,
        FlywheelError::InvalidBpsSum
    );

    let config = &mut ctx.accounts.config;
    config.admin = admin;
    config.token_mint = token_mint;
    config.fee_vault = ctx.accounts.fee_vault.key();
    config.buyback_bps = buyback_bps;
    config.burn_bps = burn_bps;
    config.lp_add_bps = 10000u16
        .checked_sub(buyback_bps)
        .ok_or(FlywheelError::MathOverflow)?
        .checked_sub(burn_bps)
        .ok_or(FlywheelError::MathOverflow)?;
    config.epoch_start = epoch_start;
    config.epoch_end = epoch_end;
    config.min_interval_seconds = min_interval_seconds;
    config.last_execution = 0;
    config.treasury_wallet = treasury_wallet;
    config.total_fees_collected = 0;
    config.total_bought_back = 0;
    config.total_burned = 0;
    config.total_lp_added = 0;
    config.config_bump = ctx.bumps.config;

    emit!(ConfigInitialized {
        admin,
        token_mint,
        fee_vault: ctx.accounts.fee_vault.key(),
        buyback_bps,
        burn_bps,
        epoch_start,
        epoch_end,
        timestamp: Clock::get()?.unix_timestamp as u64,
    });

    Ok(())
}
