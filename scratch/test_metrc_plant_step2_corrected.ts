import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createPlantingStep2Corrected() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const plantLabel = 'AAA0E0000000D13000000990';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log(`Running Plants Step 2 (Create Planting from ${plantLabel}) with corrected field names...`);
    
    // v2/plantings uses 'PlantLabel', 'PlantBatchName', 'PlantCount', 'LocationName', 'StrainName'
    const body = [{
      PlantLabel: plantLabel,
      PlantBatchName: "GGP New Batch from Plant",
      PlantBatchType: "Clone",
      PlantCount: 1,
      LocationName: "Processing Area - Updated",
      StrainName: "GGP Gold",
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plants/v2/plantings?licenseNumber=${license}`, {
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

createPlantingStep2Corrected();
