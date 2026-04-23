import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function sandboxCreatePackage() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801'; 

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Attempting to use sandbox/v2/packages/create to auto-provision tags...');
    
    const body = [{
      ItemName: "GGP Test Item",
      Quantity: 10,
      UnitOfMeasure: "Grams",
      LocationName: "Processing Area - Updated",
      ActualDate: "2026-04-22"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/sandbox/v2/packages/create?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (err) {
    console.error(err);
  }
}

sandboxCreatePackage();
