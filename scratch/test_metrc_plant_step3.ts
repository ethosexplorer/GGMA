import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPackagePlantsStep3() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const tag = 'AAA0E0100000D13000001001';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Running Plants Step 3 (Create Package from Batch)...');
    
    // Attempting with the fields provided by the user
    const body = [{
      PlantBatchId: 5401,
      LocationName: "Processing Area - Updated",
      ItemName: "GGP Immature Plant", // Note: Using the count-based item
      Quantity: 1,
      Tag: tag,
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plants/v2/plantbatch/packages?licenseNumber=${license}`, {
      method: 'POST',
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

createPackagePlantsStep3();
