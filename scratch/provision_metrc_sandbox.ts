import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function generateSandboxKey() {
  console.log('--- Metrc Sandbox Provisioning ---');
  
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: '', // Not needed for setup
    licenseNumber: '', // Not needed for setup
    environment: 'sandbox'
  });

  try {
    console.log('Calling POST /sandbox/v2/integrator/setup...');
    // We use fetch directly here because MetrcConnector might expect Basic Auth in its request() method
    // but the setup endpoint needs x-metrc-key. 
    // I already updated MetrcConnector.ts with a setupSandbox method.
    
    const result = await connector.setupSandbox();
    console.log('Metrc Response:', JSON.stringify(result, null, 2));
    
    console.log('\n--- SUCCESS! ---');
    console.log('Your Sandbox User API Key is:', result.UserApiKey);
    console.log('---------------------------');
    console.log('NEXT STEPS:');
    console.log('1. Update your .env or database with this User API Key.');
    console.log('2. Return your Evaluation Form to Metrc with this key included.');
    
  } catch (err) {
    console.error('Provisioning failed:', err.message);
    if (err.message.includes('403')) {
      console.log('\nTIP: Make sure you selected "Read/Write" for all permissions when generating your Integrator Key.');
    }
  }
}

generateSandboxKey();
