import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPackageWithTag() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801'; 
  const tag = '1A4FF0000000022000007982'; // Found in Instructions tab

  try {
    console.log(`PlantBatches Step 2: Creating package from batch 5301 using tag ${tag}...`);
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      PlantBatchId: 5301,
      Tag: tag,
      LocationName: "Processing Area - Updated",
      ItemName: "GGP Test Item",
      Quantity: 3,
      ActualDate: "2026-04-22"
    }];

    const url = `https://sandbox-api-ok.metrc.com/plantbatches/v2/packages?licenseNumber=${license}`;

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

createPackageWithTag();
