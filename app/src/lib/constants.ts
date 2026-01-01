import { PublicKey, Connection } from '@solana/web3.js';
import { BorshCoder } from '@coral-xyz/anchor';
import * as fs from 'fs';
import * as path from 'path';

// IDL types (simplified)
export interface FlywheelConfig {
  admin: PublicKey;
  tokenMint: PublicKey;
  feeVault: PublicKey;
  buybackBps: number;
  burnBps: number;
  lpAddBps: number;
  epochStart: number;
  epochEnd: number;
  minIntervalSeconds: number;
  lastExecution: number;
  treasuryWallet: PublicKey | null;
  totalFeesCollected: number;
  totalBoughtBack: number;
  totalBurned: number;
  totalLpAdded: number;
}

export interface FlywheelEvent {
  type: 'deposit' | 'execute' | 'burn' | 'withdraw';
  timestamp: number;
  data: Record<string, any>;
}

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || '2k26BoL1eUfFhqFXRdVH5p1FCd9mFhfhyMZBZyH3A7TJ');
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8899';
export const MINT = process.env.NEXT_PUBLIC_MINT ? new PublicKey(process.env.NEXT_PUBLIC_MINT) : null;

export const connection = new Connection(RPC_URL, 'confirmed');

export async function getConfigPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
  return pda;
}

export async function getConfig(connection: Connection): Promise<FlywheelConfig | null> {
  try {
    const configPda = await getConfigPDA();
    const accountInfo = await connection.getAccountInfo(configPda);
    if (!accountInfo) return null;

    // Parse account data (simple BorshDe, format)
    // For now, return mock data for testing
    return {
      admin: PROGRAM_ID,
      tokenMint: MINT || PROGRAM_ID,
      feeVault: PROGRAM_ID,
      buybackBps: 5000,
      burnBps: 5000,
      lpAddBps: 0,
      epochStart: Math.floor(Date.now() / 1000),
      epochEnd: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
      minIntervalSeconds: 3600,
      lastExecution: 0,
      treasuryWallet: null,
      totalFeesCollected: 0,
      totalBoughtBack: 0,
      totalBurned: 0,
      totalLpAdded: 0,
    };
  } catch (err) {
    console.error('Failed to fetch config:', err);
    return null;
  }
}

export function formatToken(amount: number, decimals: number = 6): string {
  return (amount / Math.pow(10, decimals)).toFixed(2);
}

export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

export function isAdmin(pubkey: PublicKey, admin: PublicKey): boolean {
  return pubkey.equals(admin);
}

export function isWithinEpoch(now: number, epochStart: number, epochEnd: number): boolean {
  return now >= epochStart && now <= epochEnd;
}
