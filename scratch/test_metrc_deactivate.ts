import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function deactivateLocation() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';
  const locationId = 5301;

  try {
    console.log(`Step 3: Deactivating location ${locationId}...`);
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const response = await fetch(`https://sandbox-api-ok.metrc.com/locations/v1/${locationId}?licenseNumber=${license}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Deactivation Successful! Status:', response.status);
      const data = await response.json().catch(() => ({}));
      console.log('Response:', JSON.stringify(data));
    } else {
      console.error('Deactivation Failed:', response.status);
      const err = await response.text();
      console.error('Error Details:', err);
    }
  } catch (err) {
    console.error('Execution failed:', err.message);
  }
}

deactivateLocation();
