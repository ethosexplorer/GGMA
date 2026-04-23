import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function finishPlantBatch() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const batchId = 5301;

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log(`Attempting to Finish Plant Batch ${batchId}...`);
    
    const body = [{
      Id: batchId,
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plantbatches/v1/finish?licenseNumber=${license}`, {
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

finishPlantBatch();
