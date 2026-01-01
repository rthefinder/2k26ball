import React from 'react';
import { Layout } from '@/components/layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            2k26ball
          </h1>
          <p className="text-2xl text-slate-300 mb-4">
            Creator fees fuel an always-on 2026 flywheel: buybacks + burns.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A transparent, on-chain token experiment where collected fees automatically power an endless cycle of token buybacks and supply burns.
          </p>
        </section>

        {/* How it Works */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">How the Flywheel Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Creators Earn Fees',
                description: 'Any transaction or event generates creator fees that flow to our vault.',
                icon: '💰',
              },
              {
                step: 2,
                title: 'Fees Accumulate',
                description: 'The vault collects all fees, forming a growing pool of resources.',
                icon: '📊',
              },
              {
                step: 3,
                title: 'Execute Flywheel',
                description: 'Split fees into buybacks and burns according to BPS configuration.',
                icon: '⚙️',
              },
              {
                step: 4,
                title: 'Continuous Cycle',
                description: 'Supply decreases, value grows, repeat. A self-sustaining mechanism.',
                icon: '♻️',
              },
            ].map((item) => (
              <div key={item.step} className="card hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">Step {item.step}</h3>
                <h4 className="font-bold text-blue-400 mb-2">{item.title}</h4>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: '✨ Transparent',
                description: 'All fee inflows, buybacks, and burns logged as on-chain events.',
              },
              {
                title: '🎛️ Configurable',
                description: 'Admin can adjust buyback/burn split and timing rules via governance.',
              },
              {
                title: '🔐 Gated',
                description: '2026 window ensures flywheel runs only during the designated epoch.',
              },
              {
                title: '✅ Tested',
                description: 'Comprehensive unit tests validate BPS math and edge cases.',
              },
              {
                title: '📊 Dashboard',
                description: 'Real-time web UI showing totals, events, and on-chain verification.',
              },
              {
                title: '⛓️ On-Chain',
                description: 'Smart contract enforces all rules transparently and immutably.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="card border-l-4 border-l-cyan-500">
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Configuration */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 text-center">Configuration & Flexibility</h2>
          <div className="card max-w-3xl mx-auto">
            <p className="text-slate-300 mb-6">The on-chain configuration stores:</p>
            <ul className="space-y-3 text-slate-400">
              <li>
                <strong className="text-white">admin</strong> — address authorized to update config
              </li>
              <li>
                <strong className="text-white">buyback_bps</strong> — percentage of fees for buyback (e.g., 5000 = 50%)
              </li>
              <li>
                <strong className="text-white">burn_bps</strong> — percentage of fees for burn (e.g., 5000 = 50%)
              </li>
              <li>
                <strong className="text-white">epoch_start / epoch_end</strong> — 2026 window (Unix timestamps)
              </li>
              <li>
                <strong className="text-white">min_interval_seconds</strong> — anti-spam execution delay
              </li>
              <li>
                <strong className="text-white">treasury_wallet</strong> — optional admin withdrawal address
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 text-center">
          <div className="card max-w-2xl mx-auto bg-gradient-to-r from-blue-900 to-slate-900">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-slate-300 mb-8">
              View live data, execute transactions, and manage the flywheel from our dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
              >
                Go to Dashboard
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="text-center mb-8">
          <div className="card bg-yellow-900/20 border-yellow-700">
            <p className="text-yellow-300">
              ⚠️ <strong>Experimental software. Not audited. Do not use with real funds.</strong>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
