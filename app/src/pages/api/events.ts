import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory cache of events
let eventCache: any[] = [];
let lastFetch = 0;
const CACHE_TTL = 5000; // 5 seconds

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = Date.now();

    // Return cached events if still fresh
    if (now - lastFetch < CACHE_TTL) {
      return res.status(200).json({ events: eventCache, cached: true });
    }

    // In production, this would:
    // 1. Fetch recent signatures from program
    // 2. Parse Anchor events from logs
    // 3. Deserialize event data
    // 4. Cache results

    // For now, return mock data
    eventCache = [
      {
        type: 'execute',
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          feesProcessed: 5000000000,
          buybackAmount: 2500000000,
          burnAmount: 2500000000,
          lpAddAmount: 0,
        },
      },
      {
        type: 'deposit',
        timestamp: Math.floor(Date.now() / 1000) - 3600,
        data: {
          amount: 5000000000,
          depositor: 'DGu7c9pz3cQRCQvtMY1YvfxNRVQV4xvHVt7AupFXWVGT',
        },
      },
      {
        type: 'burn',
        timestamp: Math.floor(Date.now() / 1000) - 7200,
        data: {
          amount: 5000000000,
          totalSupply: 1000000000000,
        },
      },
    ];

    lastFetch = now;
    res.status(200).json({ events: eventCache, cached: false });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}
