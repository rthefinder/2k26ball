import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { StatCard, EventItem, LoadingSpinner, AddressLink } from '@/components/common';
import { useEventStore } from '@/lib/store';
import { formatToken, formatBps } from '@/lib/constants';

interface ConfigData {
  admin: string;
  tokenMint: string;
  feeVault: string;
  buybackBps: number;
  burnBps: number;
  lpAddBps: number;
  epochStart: number;
  epochEnd: number;
  minIntervalSeconds: number;
  lastExecution: number;
  totalFeesCollected: number;
  totalBoughtBack: number;
  totalBurned: number;
  totalLpAdded: number;
}

export default function Dashboard() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch config
        const configRes = await fetch('/api/config');
        const configData = await configRes.json();
        setConfig(configData.config);

        // Fetch recent events
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);

        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const isWithinEpoch = config && now >= config.epochStart && now <= config.epochEnd;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-12">Flywheel Dashboard</h1>

        {error && (
          <div className="card bg-red-900/20 border-red-700 mb-8">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {/* Status */}
        <div className="mb-12">
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-slate-400">Epoch Status</p>
              <p className="text-2xl font-bold mt-2">
                {isWithinEpoch ? '✅ Active' : '⏸️ Closed'}
              </p>
            </div>
            {config && (
              <div className="text-right text-sm text-slate-400">
                <p>Start: {new Date(config.epochStart * 1000).toLocaleDateString()}</p>
                <p>End: {new Date(config.epochEnd * 1000).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Statistics */}
        {config && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              label="Total Fees Collected"
              value={`${formatToken(config.totalFeesCollected)} tokens`}
              icon="💰"
            />
            <StatCard
              label="Total Bought Back"
              value={`${formatToken(config.totalBoughtBack)} tokens`}
              icon="📈"
            />
            <StatCard
              label="Total Burned"
              value={`${formatToken(config.totalBurned)} tokens`}
              icon="🔥"
            />
            <StatCard
              label="Total LP Added"
              value={`${formatToken(config.totalLpAdded)} tokens`}
              icon="💧"
            />
          </div>
        )}

        {/* Configuration Details */}
        {config && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Admin</p>
                    <p className="font-mono text-sm mt-1">
                      <AddressLink address={config.admin} />
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Token Mint</p>
                    <p className="font-mono text-sm mt-1">
                      <AddressLink address={config.tokenMint} />
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Fee Vault</p>
                    <p className="font-mono text-sm mt-1">
                      <AddressLink address={config.feeVault} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Buyback Split (BPS)</p>
                    <p className="text-xl font-bold mt-1">{formatBps(config.buybackBps)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Burn Split (BPS)</p>
                    <p className="text-xl font-bold mt-1">{formatBps(config.burnBps)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">LP Add Split (BPS)</p>
                    <p className="text-xl font-bold mt-1">{formatBps(config.lpAddBps)}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Min Interval (seconds)</p>
                    <p className="font-mono text-sm mt-1">{config.minIntervalSeconds}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Last Execution</p>
                    <p className="font-mono text-sm mt-1">
                      {config.lastExecution === 0
                        ? 'Never'
                        : new Date(config.lastExecution * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {events.length === 0 ? (
            <div className="card text-center text-slate-400">
              <p>No events yet. Execute the flywheel to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, idx) => (
                <EventItem key={idx} type={event.type} timestamp={event.timestamp} data={event.data} />
              ))}
            </div>
          )}
        </div>

        {/* On-Chain Verification */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">On-Chain Verification</h2>
          <div className="card">
            <p className="text-slate-300 mb-4">
              All flywheel actions are recorded as on-chain events. View them on the Solana explorer:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Program ID:</strong>{' '}
                <span className="font-mono text-cyan-400">
                  {process.env.NEXT_PUBLIC_PROGRAM_ID || 'Not configured'}
                </span>
              </li>
              <li>
                <strong>Mint:</strong>{' '}
                <span className="font-mono text-cyan-400">
                  {process.env.NEXT_PUBLIC_MINT || 'Not configured'}
                </span>
              </li>
              {config && (
                <>
                  <li>
                    <strong>Fee Vault:</strong>{' '}
                    <span className="font-mono text-cyan-400">
                      <AddressLink address={config.feeVault} />
                    </span>
                  </li>
                  <li>
                    <strong>Config PDA:</strong>{' '}
                    <span className="font-mono text-cyan-400">
                      <AddressLink address={config.admin} /> (derived from seeds)
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
