import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { admin, buybackBps, burnBps, minIntervalSeconds, treasuryWallet } = req.body;

    if (!admin) {
      return res.status(400).json({ error: 'Missing admin' });
    }

    if (buybackBps + burnBps > 10000) {
      return res.status(400).json({ error: 'BPS sum exceeds 100%' });
    }

    // In production: create transaction and return for signing
    // For now, return success
    res.status(200).json({
      success: true,
      message: 'Initialization instructions prepared',
      note: 'In production, return serialized transaction for wallet signing',
    });
  } catch (error) {
    console.error('Error initializing config:', error);
    res.status(500).json({ error: 'Failed to initialize' });
  }
}
