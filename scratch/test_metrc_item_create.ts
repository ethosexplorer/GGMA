import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createItem() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';

  try {
    console.log('Items Step 1: Creating item "GGP Test Item"...');
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      Name: "GGP Test Item",
      ItemCategory: "MMJ Waste",
      UnitOfMeasure: "Grams"
    }];

    // Metrc v1/v2 create is usually POST /items/v1/create
    const url = `/items/v1/create`;

    const response = await fetch(`https://sandbox-api-ok.metrc.com${url}?licenseNumber=${license}`, {
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

createItem();
