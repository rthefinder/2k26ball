import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock config response
    // In production, this would fetch from on-chain PDA
    const config = {
      admin: process.env.NEXT_PUBLIC_PROGRAM_ID || '2k26BoL1eUfFhqFXRdVH5p1FCd9mFhfhyMZBZyH3A7TJ',
      tokenMint: process.env.NEXT_PUBLIC_MINT || '',
      feeVault: '6Jzx4PqznWX7xWq4xMPYiMzPZMwQmr7DVqLmvfXmHhgB',
      buybackBps: 5000,
      burnBps: 5000,
      lpAddBps: 0,
      epochStart: 1704067200, // Jan 1, 2024
      epochEnd: 1735689600, // Dec 31, 2024
      minIntervalSeconds: 3600,
      lastExecution: 0,
      totalFeesCollected: 0,
      totalBoughtBack: 0,
      totalBurned: 0,
      totalLpAdded: 0,
    };

    res.status(200).json({ config });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
}
