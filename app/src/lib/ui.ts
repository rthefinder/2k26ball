import { PublicKey } from '@solana/web3.js';

export const EXPLORER_URL_BASE = 'https://explorer.solana.com';
export const DEVNET_EXPLORER_URL_BASE = 'https://explorer.solana.com?cluster=devnet';

export function explorerUrl(address: string | PublicKey, cluster: 'localnet' | 'devnet' | 'mainnet' = 'localnet'): string {
  const addr = typeof address === 'string' ? address : address.toBase58();
  
  if (cluster === 'localnet') {
    return `http://localhost:3001/address/${addr}`;
  } else if (cluster === 'devnet') {
    return `${DEVNET_EXPLORER_URL_BASE}&address=${addr}`;
  }
  return `${EXPLORER_URL_BASE}/address/${addr}`;
}

export function txUrl(txSig: string, cluster: 'localnet' | 'devnet' | 'mainnet' = 'localnet'): string {
  if (cluster === 'localnet') {
    return `http://localhost:3001/tx/${txSig}`;
  } else if (cluster === 'devnet') {
    return `${DEVNET_EXPLORER_URL_BASE}&txHash=${txSig}`;
  }
  return `${EXPLORER_URL_BASE}/tx/${txSig}`;
}

export function truncateAddress(address: string | PublicKey, chars: number = 4): string {
  const str = typeof address === 'string' ? address : address.toBase58();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

export const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
};
