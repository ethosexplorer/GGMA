import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function movePlantStep1() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const plantId = 42104;

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log(`Running Plants Step 1 (Move Plant ${plantId})...`);
    
    const body = [{
      Id: plantId,
      LocationName: "Processing Area - Updated"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plants/v2/location?licenseNumber=${license}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (err) {
    console.error(err);
  }
}

movePlantStep1();
