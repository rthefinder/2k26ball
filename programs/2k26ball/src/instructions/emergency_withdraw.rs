use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};

use crate::{FlywheelConfig, FlywheelError, EmergencyWithdrawn};

#[derive(Accounts)]
pub struct EmergencyWithdraw<'info> {
    #[account(constraint = admin.key() == config.admin @ FlywheelError::Unauthorized)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [b"config"],
        bump = config.config_bump,
    )]
    pub config: Account<'info, FlywheelConfig>,

    #[account(mut)]
    pub fee_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
    let amount = ctx.accounts.fee_vault.amount;
    require!(amount > 0, FlywheelError::EmptyVault);

    let config = ctx.accounts.config;
    let seeds: &[&[u8]] = &[b"config".as_ref(), &[config.config_bump]];
    let signer = &[&seeds[..]];

    let transfer_ix = Transfer {
        from: ctx.accounts.fee_vault.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: config.to_account_info(),
    };

    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_ix,
            signer,
        ),
        amount,
    )?;

    emit!(EmergencyWithdrawn {
        amount,
        recipient: ctx.accounts.recipient_token_account.key(),
        timestamp: Clock::get()?.unix_timestamp as u64,
    });

    Ok(())
}
