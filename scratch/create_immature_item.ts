import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createImmaturePlantItem() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Creating "Immature Plants" item (Count-based)...');
    
    const body = [{
      Name: "GGP Immature Plant",
      ItemCategory: "Immature Plants",
      UnitOfMeasure: "Each",
      Strain: "GGP Gold"
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/items/v2?licenseNumber=${license}`, {
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

createImmaturePlantItem();
