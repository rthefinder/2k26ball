import React, { useCallback, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface NavbarProps {
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title = '2k26ball' }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">v0.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-slate-400 hover:text-white text-sm">
            Home
          </a>
          <a href="/dashboard" className="text-slate-400 hover:text-white text-sm">
            Dashboard
          </a>
          <a href="/admin" className="text-slate-400 hover:text-white text-sm">
            Admin
          </a>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 border-t border-slate-800 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-2">2k26ball</h3>
          <p className="text-sm text-slate-400">Creator fees fuel an always-on 2026 flywheel.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Links</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                GitHub
              </a>
            </li>
            <li>
              <a href="/docs" className="hover:text-white">
                Docs
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Status</h3>
          <p className="text-xs text-yellow-400">⚠️ Experimental - Not Audited</p>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
        <p>&copy; 2025 2k26ball Contributors. MIT License.</p>
      </div>
    </div>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
