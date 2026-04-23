import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPlantBatch() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801'; // Grower license

  try {
    console.log('PlantBatches Step 1: Creating plant batch "GGP Test Batch 1" on Grower license with correct v1 fields...');
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      Name: "GGP Test Batch 1",
      Type: "Clone",
      Count: 6,
      Location: "Processing Area - Updated",
      Strain: "GGP Gold",
      ActualDate: "2026-04-22"
    }];

    const url = `https://sandbox-api-ok.metrc.com/plantbatches/v1/createplantings?licenseNumber=${license}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      console.log('Create Successful! Status:', response.status);
      const data = await response.json().catch(() => ({}));
      console.log('Response:', JSON.stringify(data));
    } else {
      console.error('Create Failed:', response.status);
      const err = await response.text();
      console.error('Error Details:', err);
    }
  } catch (err) {
    console.error('Execution failed:', err.message);
  }
}

createPlantBatch();
