use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

use crate::{FlywheelConfig, FeesDeposited, FlywheelError};

#[derive(Accounts)]
pub struct DepositFees<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(mut)]
    pub depositor_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = fee_vault.mint == depositor_token_account.mint,
    )]
    pub fee_vault: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"config"],
        bump = config.config_bump,
    )]
    pub config: Account<'info, FlywheelConfig>,

    pub token_program: Program<'info, Token>,
}

pub fn deposit_fees(ctx: Context<DepositFees>, amount: u64) -> Result<()> {
    require!(amount > 0, ProgramError::InvalidArgument);

    let transfer_ix = Transfer {
        from: ctx.accounts.depositor_token_account.to_account_info(),
        to: ctx.accounts.fee_vault.to_account_info(),
        authority: ctx.accounts.depositor.to_account_info(),
    };

    anchor_spl::token::transfer(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_ix),
        amount,
    )?;

    let vault_balance = ctx.accounts
        .fee_vault
        .amount
        .checked_add(amount)
        .ok_or(FlywheelError::MathOverflow)?;

    emit!(FeesDeposited {
        amount,
        vault_balance,
        depositor: ctx.accounts.depositor.key(),
        timestamp: Clock::get()?.unix_timestamp as u64,
    });

    Ok(())
}
