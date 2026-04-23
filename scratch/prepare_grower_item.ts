import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function prepareGrowerItem() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801'; // Grower

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Creating "GGP Test Item" on Grower License SF-SBX-OK-3-6801...');
    
    const response = await fetch(`https://sandbox-api-ok.metrc.com/items/v1/create?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ Name: "GGP Test Item", ItemCategory: "MMJ Waste", UnitOfMeasure: "Grams" }])
    });
    console.log('Item creation status:', response.status);
    if (!response.ok) {
      console.log('Error:', await response.text());
    }
  } catch (err) {
    console.error(err);
  }
}

prepareGrowerItem();
