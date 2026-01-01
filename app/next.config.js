import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8899',
    NEXT_PUBLIC_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID || '2k26BoL1eUfFhqFXRdVH5p1FCd9mFhfhyMZBZyH3A7TJ',
    NEXT_PUBLIC_MINT: process.env.NEXT_PUBLIC_MINT || '',
  },
};

export default nextConfig;
