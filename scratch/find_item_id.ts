import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function findItem() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';

  try {
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const response = await fetch(`https://sandbox-api-ok.metrc.com/items/v1/active?licenseNumber=${license}`, {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    const items = await response.json();
    const item = items.find((i: any) => i.Name === "GGP Test Item");
    if (item) {
      console.log('Found Item:', JSON.stringify(item, null, 2));
    } else {
      console.log('Item not found. All items:', items.map((i: any) => i.Name));
    }
  } catch (err) {
    console.error(err);
  }
}

findItem();
