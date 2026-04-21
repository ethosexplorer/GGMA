import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.js';
import { turso } from '../src/lib/turso.js';

/**
 * UTILITY: Generate Sandbox User Key
 * Use this script to initialize your Metrc Sandbox environment
 * and receive your Vendor User API Key.
 */
async function generateSandboxKey() {
  console.log('--- Metrc Sandbox Provisioning ---');

  // 1. Fetch your Integrator Key from the database (facility ent-1)
  const res = await turso.execute({
    sql: "SELECT metrc_integrator_key FROM entities WHERE id = ?",
    args: ["ent-1"]
  });

  const integratorKey = res.rows[0]?.metrc_integrator_key;

  if (!integratorKey || integratorKey.includes('MOCK')) {
    console.error('ERROR: No real Integrator API Key found in database.');
    console.log('Please update the "entities" table with your real Metrc Connect key first.');
    return;
  }

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: '', // Not needed for setup
    licenseNumber: '', // Not needed for setup
    environment: 'sandbox'
  });

  try {
    console.log('Calling POST /sandbox/v2/integrator/setup...');
    const result = await connector.setupSandbox();
    
    console.log('\n--- SUCCESS! ---');
    console.log('Your Sandbox User API Key is:', result.UserApiKey);
    console.log('Please save this key and update your database/env variables.');
    
    // Optional: Auto-update the DB
    /*
    await turso.execute({
      sql: "UPDATE entities SET metrc_user_key = ? WHERE id = ?",
      args: [result.UserApiKey, "ent-1"]
    });
    console.log('Database updated for facility ent-1.');
    */

  } catch (err) {
    console.error('Provisioning failed:', err.message);
  }
}

generateSandboxKey();
