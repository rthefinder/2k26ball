import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8899';
const PROGRAM_ID = process.env.PROGRAM_ID || '2k26BoL1eUfFhqFXRdVH5p1FCd9mFhfhyMZBZyH3A7TJ';

async function smoke() {
  console.log('🧪 Running smoke tests for 2k26ball...');
  console.log(`RPC: ${RPC_URL}`);
  console.log(`Program ID: ${PROGRAM_ID}`);

  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    const wallet = anchor.Wallet.local();

    console.log(`✓ Provider initialized`);
    console.log(`✓ Payer: ${wallet.publicKey.toBase58()}`);

    // Test 1: Check RPC connectivity
    console.log('\n📋 Test 1: RPC Connectivity');
    const version = await connection.getVersion();
    console.log(`✓ Solana version: ${version['solana-core']}`);

    // Test 2: Check program exists
    console.log('\n📋 Test 2: Program Exists');
    const programId = new PublicKey(PROGRAM_ID);
    const programInfo = await connection.getAccountInfo(programId);
    if (programInfo) {
      console.log(`✓ Program found`);
      console.log(`  Owner: ${programInfo.owner.toBase58()}`);
      console.log(`  Size: ${programInfo.data.length} bytes`);
    } else {
      console.log('⚠️  Program not found (expected for first deploy)');
    }

    // Test 3: Check wallet balance
    console.log('\n📋 Test 3: Wallet Balance');
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`✓ Balance: ${balance / 1e9} SOL`);

    // Test 4: Derive config PDA
    console.log('\n📋 Test 4: Derive Config PDA');
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      programId
    );
    console.log(`✓ Config PDA: ${configPda.toBase58()}`);

    console.log('\n✅ Smoke tests complete');
  } catch (error) {
    console.error('❌ Smoke test failed:', error);
    process.exit(1);
  }
}

smoke().catch(console.error);
