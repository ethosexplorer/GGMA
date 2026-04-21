import { MetrcConnector } from './src/lib/metrc/MetrcConnector.ts';
import { turso } from './src/lib/turso.ts';

async function verifyAndConnect() {
  console.log('--- Metrc Final Connectivity Check ---');
  
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: userKey,
    licenseNumber: '', // Will fetch this
    environment: 'sandbox'
  });

  try {
    console.log('Fetching licensed facilities from Metrc Sandbox...');
    const facilities = await connector.getFacilities();
    console.log('Metrc Response:', JSON.stringify(facilities, null, 2));

    if (facilities && facilities.length > 0) {
      const firstLicense = facilities[0].License.Number;
      console.log(`\nSUCCESS: Found active license: ${firstLicense}`);

      // Update Database
      console.log('Updating GGMA Database with live credentials...');
      await turso.execute({
        sql: "UPDATE entities SET metrc_integrator_key = ?, metrc_user_key = ?, metrc_license_number = ? WHERE id = ?",
        args: [integratorKey, userKey, firstLicense, "ent-1"]
      });
      
      console.log('--- CONFIGURATION COMPLETE ---');
      console.log('Your GGMA North Dispensary is now live on the Metrc Sandbox!');
    } else {
      console.warn('Metrc connected but no facilities were found in this sandbox account.');
    }
    
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

verifyAndConnect();
