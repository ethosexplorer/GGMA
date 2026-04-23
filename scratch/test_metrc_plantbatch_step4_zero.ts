import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function destroyPlantBatchStep4Zero() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const batchName = "GGP Test Batch 1";

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log(`Running PlantBatches Step 4 (Destroy Batch ${batchName}) with Count 0...`);
    
    const body = [{
      PlantBatch: batchName,
      Count: 0,
      WasteReasonName: "Damage/Spoilage",
      ReasonNote: "Technical Evaluation Test",
      WasteWeight: 0.0,
      WasteUnitOfMeasure: "Grams",
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plantbatches/v2/?licenseNumber=${license}`, {
      method: 'DELETE',
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

destroyPlantBatchStep4Zero();
