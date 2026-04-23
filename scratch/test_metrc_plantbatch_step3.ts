import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function changeGrowthPhaseStep3() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const tag = 'AAA0E0000000D13000000990';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Running PlantBatches Step 3 (Change Growth Phase)...');
    
    const body = [{
      Id: 5301,
      GrowthPhase: "Vegetative",
      NewLocation: "Processing Area - Updated",
      Tag: tag,
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/plantbatches/v2/growthphase?licenseNumber=${license}`, {
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

changeGrowthPhaseStep3();
