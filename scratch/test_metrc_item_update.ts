import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function updateItem() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';
  const itemId = 31401;

  try {
    console.log(`Items Step 2: Updating item ${itemId}...`);
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      Id: itemId,
      Name: "GGP Test Item",
      ItemCategory: "MMJ Waste",
      UnitOfMeasure: "Ounces"
    }];

    // Metrc v1/v2 update is usually POST /items/v1/update
    const url = `/items/v1/update`;

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
      console.log('Update Successful! Status:', response.status);
      const data = await response.json().catch(() => ({}));
      console.log('Response:', JSON.stringify(data));
    } else {
      console.error('Update Failed:', response.status);
      const err = await response.text();
      console.error('Error Details:', err);
    }
  } catch (err) {
    console.error('Execution failed:', err.message);
  }
}

updateItem();
