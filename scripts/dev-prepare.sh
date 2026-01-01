#!/usr/bin/env bash
set -euo pipefail

echo "Starting local development environment for 2k26ball..."

# Start solana-test-validator in background if not running
if ! pgrep -f solana-test-validator > /dev/null; then
  echo "Launching solana-test-validator..."
  solana-test-validator -r ./scripts/validator-ledger --quiet &
  sleep 2
else
  echo "solana-test-validator already running"
fi

# Build and deploy Anchor program (non-blocking if anchor not installed)
if command -v anchor >/dev/null 2>&1; then
  echo "Building and deploying Anchor program..."
  (cd programs/2k26ball && anchor build && anchor deploy) || true
else
  echo "Anchor CLI not found; please install anchor to auto-deploy. Skipping deploy."
fi

# Run init script to prepare config template
pnpm --filter ./scripts run init || true

# Start Next.js app
echo "Starting Next.js app..."
pnpm --filter ./app run dev
