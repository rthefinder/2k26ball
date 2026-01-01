use anchor_lang::prelude::*;

#[error_code]
pub enum FlywheelError {
    #[msg("Unauthorized: caller is not admin")]
    Unauthorized,

    #[msg("Invalid BPS sum: buyback + burn + lp_add must sum to <= 10000")]
    InvalidBpsSum,

    #[msg("Insufficient interval: must wait min_interval_seconds between executions")]
    InsufficientInterval,

    #[msg("Outside epoch window: flywheel only executes within 2026")]
    OutsideEpoch,

    #[msg("Empty vault: no fees to process")]
    EmptyVault,

    #[msg("Invalid account ownership")]
    InvalidAccountOwner,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Invalid token account")]
    InvalidTokenAccount,

    #[msg("Arithmetic error")]
    ArithmeticError,
}
