import React from 'react';
import { truncateAddress } from './ui';

interface AddressLinkProps {
  address: string;
  className?: string;
  cluster?: 'localnet' | 'devnet' | 'mainnet';
}

export const AddressLink: React.FC<AddressLinkProps> = ({ address, className = '', cluster = 'localnet' }) => {
  const baseUrl = cluster === 'localnet' ? 'http://localhost:3001' : 'https://explorer.solana.com';
  const clusterParam = cluster === 'devnet' ? '?cluster=devnet' : '';
  const url = `${baseUrl}/address/${address}${clusterParam}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`font-mono text-xs ${className}`}>
      {truncateAddress(address, 4)}
    </a>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      {icon && <div className="text-4xl opacity-50">{icon}</div>}
    </div>
  </div>
);

interface EventItemProps {
  type: string;
  timestamp: number;
  data: Record<string, any>;
}

export const EventItem: React.FC<EventItemProps> = ({ type, timestamp, data }) => {
  const icons: Record<string, string> = {
    deposit: '📥',
    execute: '⚙️',
    burn: '🔥',
    withdraw: '📤',
  };

  const colors: Record<string, string> = {
    deposit: 'text-blue-400',
    execute: 'text-green-400',
    burn: 'text-red-400',
    withdraw: 'text-yellow-400',
  };

  const date = new Date(timestamp * 1000).toLocaleString();

  return (
    <div className="card border-l-4 border-l-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icons[type] || '📝'}</span>
            <div>
              <p className={`font-semibold ${colors[type] || 'text-gray-400'}`}>{type.toUpperCase()}</p>
              <p className="text-xs text-slate-400">{date}</p>
            </div>
          </div>
          <pre className="mt-3 text-xs bg-slate-950 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${sizeClass} border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin`} />
  );
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
  }
> = ({ variant = 'primary', loading = false, children, disabled, ...props }) => {
  const baseClass = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClass = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600';

  return (
    <button {...props} disabled={disabled || loading} className={`${baseClass} ${variantClass}`}>
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};
