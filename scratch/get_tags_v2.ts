import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function getAvailableTagsV2() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Fetching available tags v2...');
    const url = `https://sandbox-api-ok.metrc.com/tags/v2/available?licenseNumber=${license}`;
    
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    console.log('Status:', response.status);
    const data = await response.json().catch(() => ({}));
    console.log('Available Tags:', JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

getAvailableTagsV2();
