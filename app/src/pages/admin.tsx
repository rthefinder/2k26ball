import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Button, LoadingSpinner } from '@/components/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export default function Admin() {
  const { publicKey, signTransaction } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [config, setConfig] = useState({
    buybackBps: 5000,
    burnBps: 5000,
    minIntervalSeconds: 3600,
    treasuryWallet: '',
  });

  const [depositAmount, setDepositAmount] = useState('');

  // Check if current wallet is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!publicKey) {
        setIsAdmin(false);
        return;
      }
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.config && data.config.admin === publicKey.toBase58()) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Failed to check admin status:', err);
      }
    };

    checkAdmin();
  }, [publicKey]);

  const handleInitialize = async () => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin: publicKey.toBase58(),
          buybackBps: config.buybackBps,
          burnBps: config.burnBps,
          minIntervalSeconds: config.minIntervalSeconds,
          treasuryWallet: config.treasuryWallet || null,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || 'Initialization failed');
      }

      setSuccess('Configuration initialized successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    if (!isAdmin) {
      setError('Only admin can update configuration');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buybackBps: config.buybackBps,
          burnBps: config.burnBps,
          minIntervalSeconds: config.minIntervalSeconds,
          treasuryWallet: config.treasuryWallet || null,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || 'Update failed');
      }

      setSuccess('Configuration updated successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositFees = async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Invalid amount');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const amount = Math.floor(parseFloat(depositAmount) * 1_000_000); // Assume 6 decimals
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositor: publicKey.toBase58(),
          amount,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || 'Deposit failed');
      }

      setSuccess('Fees deposited successfully!');
      setDepositAmount('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteFlywheel = async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executor: publicKey.toBase58(),
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || 'Execution failed');
      }

      setSuccess('Flywheel executed successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-slate-400 mb-8">Connect your wallet to access admin controls.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-12">Admin Controls</h1>

        {error && (
          <div className="card bg-red-900/20 border-red-700 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="card bg-green-900/20 border-green-700 mb-8">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Initialize */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Initialize Configuration</h2>
            <p className="text-slate-400 mb-6">Set up the flywheel configuration on-chain.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Buyback BPS (basis points)</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={config.buybackBps}
                  onChange={(e) => setConfig({ ...config, buybackBps: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">{(config.buybackBps / 100).toFixed(2)}% = {config.buybackBps} BPS</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Burn BPS</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={config.burnBps}
                  onChange={(e) => setConfig({ ...config, burnBps: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">{(config.burnBps / 100).toFixed(2)}% = {config.burnBps} BPS</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Min Interval (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={config.minIntervalSeconds}
                  onChange={(e) => setConfig({ ...config, minIntervalSeconds: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Treasury Wallet (optional)</label>
                <input
                  type="text"
                  placeholder="Solana address"
                  value={config.treasuryWallet}
                  onChange={(e) => setConfig({ ...config, treasuryWallet: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <Button variant="primary" onClick={handleInitialize} loading={loading} className="w-full">
                Initialize
              </Button>
            </div>
          </div>

          {/* Update Configuration (Admin Only) */}
          {isAdmin && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Update Configuration</h2>
              <p className="text-slate-400 mb-6">Modify flywheel parameters (admin only).</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Buyback BPS</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={config.buybackBps}
                    onChange={(e) => setConfig({ ...config, buybackBps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Burn BPS</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={config.burnBps}
                    onChange={(e) => setConfig({ ...config, burnBps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>

                <Button variant="primary" onClick={handleUpdateConfig} loading={loading} className="w-full">
                  Update Config
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Deposit & Execute */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Deposit Fees</h2>
            <p className="text-slate-400 mb-6">Add tokens to the fee vault.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (in tokens)</label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
                />
              </div>
              <Button variant="primary" onClick={handleDepositFees} loading={loading} className="w-full">
                Deposit
              </Button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Execute Flywheel</h2>
            <p className="text-slate-400 mb-6">Trigger the buyback & burn cycle (permissionless within 2026).</p>
            <Button variant="primary" onClick={handleExecuteFlywheel} loading={loading} className="w-full">
              {loading ? <LoadingSpinner size="sm" /> : 'Execute Flywheel'}
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              The flywheel will:
              <ul className="mt-2 space-y-1">
                <li>• Split fees by BPS configuration</li>
                <li>• Swap portion for 2k26ball (mock for now)</li>
                <li>• Burn acquired tokens</li>
                <li>• Emit on-chain events</li>
              </ul>
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 card bg-slate-800">
          <h3 className="font-semibold mb-2">Current Wallet</h3>
          <p className="font-mono text-sm text-cyan-400">{publicKey.toBase58()}</p>
          {isAdmin && <p className="text-green-400 mt-2">✓ Admin privileges</p>}
          {!isAdmin && <p className="text-yellow-400 mt-2">⚠️ Not an admin</p>}
        </div>
      </div>
    </Layout>
  );
}
