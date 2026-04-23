import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function orderTags() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Attempting to order tags in sandbox...');
    
    // Some sandboxes use /tags/v1/order or /tags/v1/provision
    const response = await fetch(`https://sandbox-api-ok.metrc.com/tags/v1/order?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TagType: "Package",
        Count: 10
      })
    });

    console.log('Order status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (err) {
    console.error(err);
  }
}

orderTags();
