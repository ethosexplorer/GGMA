import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function changeGrowthPhaseStep3Corrected() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';
  const tag = 'AAA0E0000000D13000000990';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Running PlantBatches Step 3 (Change Growth Phase) with corrected field names...');
    
    // v2/growthphase uses 'Name', 'Count', 'StartingTag', and 'GrowthDate'
    const body = [{
      Name: "GGP Test Batch 1",
      Count: 3,
      StartingTag: tag,
      GrowthPhase: "Vegetative",
      NewLocation: "Processing Area - Updated",
      GrowthDate: "2026-04-22"
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

changeGrowthPhaseStep3Corrected();
