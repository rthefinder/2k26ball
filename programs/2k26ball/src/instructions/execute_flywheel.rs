use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Burn};

use crate::{FlywheelConfig, FlywheelError, FlywheelExecuted, TokensBurned};

#[derive(Accounts)]
pub struct ExecuteFlywheel<'info> {
    pub executor: Signer<'info>,

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.config_bump,
    )]
    pub config: Account<'info, FlywheelConfig>,

    #[account(
        mut,
        constraint = fee_vault.mint == config.token_mint,
    )]
    pub fee_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub token_mint: Account<'info, anchor_spl::token::Mint>,

    pub token_program: Program<'info, Token>,
}

pub fn execute_flywheel(ctx: Context<ExecuteFlywheel>) -> Result<()> {
    let config = &mut ctx.accounts.config;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp as u64;

    // Check if within epoch window
    let outside_epoch = now < config.epoch_start || now > config.epoch_end;
    if outside_epoch && &ctx.accounts.executor.key() != &config.admin {
        return Err(FlywheelError::OutsideEpoch.into());
    }

    // Check interval gating (unless admin outside epoch)
    if !outside_epoch || &ctx.accounts.executor.key() == &config.admin {
        let time_since_last = now.checked_sub(config.last_execution)
            .ok_or(FlywheelError::MathOverflow)?;
        require!(
            time_since_last >= config.min_interval_seconds,
            FlywheelError::InsufficientInterval
        );
    }

    // Get vault balance
    let vault_balance = ctx.accounts.fee_vault.amount;
    require!(vault_balance > 0, FlywheelError::EmptyVault);

    // Calculate splits (in BPS, so divide by 10000)
    let buyback_amount = vault_balance
        .checked_mul(config.buyback_bps as u64)
        .ok_or(FlywheelError::MathOverflow)?
        .checked_div(10000)
        .ok_or(FlywheelError::MathOverflow)?;

    let burn_amount = vault_balance
        .checked_mul(config.burn_bps as u64)
        .ok_or(FlywheelError::MathOverflow)?
        .checked_div(10000)
        .ok_or(FlywheelError::MathOverflow)?;

    let lp_add_amount = vault_balance
        .checked_mul(config.lp_add_bps as u64)
        .ok_or(FlywheelError::MathOverflow)?
        .checked_div(10000)
        .ok_or(FlywheelError::MathOverflow)?;

    // For now: mock execution
    // In production:
    // - buyback_amount: swap via Jupiter/Raydium to 2k26ball, then burn
    // - lp_add_amount: add liquidity stub
    //
    // Here we simulate: mock adapter would transfer from a mock pool vault.
    // For this prototype, we just track the amounts and burn what we "bought back".

    // Simulate: if buyback_amount > 0, we pretend to swap and get some 2k26ball back
    let mock_acquired = buyback_amount; // Mock: 1:1 swap for prototype

    // Burn the mock acquired + direct burn portion
    let total_to_burn = mock_acquired.checked_add(burn_amount)
        .ok_or(FlywheelError::MathOverflow)?;

    if total_to_burn > 0 && ctx.accounts.fee_vault.amount >= total_to_burn {
        // Burn from fee_vault (as if they hold 2k26ball)
        let burn_ix = Burn {
            mint: ctx.accounts.token_mint.to_account_info(),
            from: ctx.accounts.fee_vault.to_account_info(),
            authority: config.to_account_info(),
        };

        // Create CPI with PDA signer
        let seeds: &[&[u8]] = &[b"config".as_ref(), &[config.config_bump]];
        let signer = &[&seeds[..]];

        anchor_spl::token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                burn_ix,
                signer,
            ),
            total_to_burn,
        )?;

        emit!(TokensBurned {
            amount: total_to_burn,
            total_supply: ctx.accounts.token_mint.supply.saturating_sub(total_to_burn),
            timestamp: now,
        });
    }

    // Update config
    config.last_execution = now;
    config.total_fees_collected = config.total_fees_collected
        .checked_add(vault_balance)
        .ok_or(FlywheelError::MathOverflow)?;
    config.total_bought_back = config.total_bought_back
        .checked_add(buyback_amount)
        .ok_or(FlywheelError::MathOverflow)?;
    config.total_burned = config.total_burned
        .checked_add(total_to_burn)
        .ok_or(FlywheelError::MathOverflow)?;
    config.total_lp_added = config.total_lp_added
        .checked_add(lp_add_amount)
        .ok_or(FlywheelError::MathOverflow)?;

    emit!(FlywheelExecuted {
        fees_processed: vault_balance,
        buyback_amount,
        burn_amount,
        lp_add_amount,
        timestamp: now,
    });

    Ok(())
}
