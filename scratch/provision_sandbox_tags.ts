import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function provisionTags() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Attempting to provision tags in sandbox via /sandbox/v1/provision/tags...');
    
    const response = await fetch(`https://sandbox-api-ok.metrc.com/sandbox/v1/provision/tags?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        PackageTagCount: 10,
        PlantTagCount: 10
      })
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (err) {
    console.error(err);
  }
}

provisionTags();
