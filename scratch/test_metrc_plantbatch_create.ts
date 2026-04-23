import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPlantBatch() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';

  try {
    console.log('PlantBatches Step 1: Creating plant batch "GGP Test Batch 1"...');
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      PlantBatchName: "GGP Test Batch 1",
      PlantBatchType: "Clone",
      Quantity: 6,
      LocationName: "Processing Area - Updated",
      StrainName: "GGP Gold",
      ActualDate: "2026-04-22"
    }];

    // Metrc v1/v2 create plantings is usually POST /plantbatches/v1/createplantings
    const url = `/plantbatches/v1/createplantings`;

    const response = await fetch(`https://sandbox-api-ok.metrc.com${url}?licenseNumber=${license}`, {
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
