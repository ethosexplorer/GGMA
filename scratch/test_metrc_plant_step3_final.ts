import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPackagePlantsStep3Final() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const tag = 'AAA0E0100000D13000000983';
  const plantLabel = 'AAA0E0000000D13000000991'; // Plant 42105

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log(`Running Plants Step 3 (Create Package from Plant) with Tag ${tag}...`);
    
    const body = [{
      PlantLabel: plantLabel,
      PackageTag: tag,
      PlantBatchType: "Clone",
      Item: "GGP Immature Plant",
      Location: "Processing Area - Updated",
      Count: 1,
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

createPackagePlantsStep3Final();
