import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import '@/styles/globals.css';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>2k26ball - Creator Fees Fuel an Always-On 2026 Flywheel</title>
        <meta name="description" content="2k26ball: Transparent token flywheel with buybacks and burns" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </>
  );
}
