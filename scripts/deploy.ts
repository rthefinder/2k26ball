import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8899';
const PROGRAM_ID = 'TBD'; // Will be updated after deployment

async function deploy() {
  console.log('🚀 Deploying 2k26ball program...');
  console.log(`RPC: ${RPC_URL}`);

  try {
    // Initialize Anchor provider
    const connection = new Connection(RPC_URL, 'confirmed');
    const wallet = anchor.Wallet.local(); // Uses ~/.config/solana/id.json
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });

    anchor.setProvider(provider);

    console.log(`✓ Provider initialized`);
    console.log(`✓ Payer: ${wallet.publicKey.toBase58()}`);

    // In production:
    // 1. Build program: anchor build
    // 2. Deploy: anchor deploy
    // 3. Extract program ID from deploy output
    // 4. Update IDL

    // For now, log instructions
    console.log('\n📝 Deployment steps:');
    console.log('  1. Run: cd programs/2k26ball && anchor build');
    console.log('  2. Run: anchor deploy');
    console.log('  3. Extract PROGRAM_ID from output');
    console.log('  4. Update .env and PROGRAM_ID constant');
    console.log('\n✓ Deployment instructions logged');

    // Write environment template
    const envTemplate = `NEXT_PUBLIC_RPC_URL=http://localhost:8899
NEXT_PUBLIC_PROGRAM_ID=${PROGRAM_ID}
NEXT_PUBLIC_MINT=
`;
    fs.writeFileSync(path.join(process.cwd(), 'app', '.env.local.example'), envTemplate);
    console.log('✓ Created app/.env.local.example');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deploy().catch(console.error);
