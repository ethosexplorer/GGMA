import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function updateLocation() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: userKey,
    licenseNumber: license,
    environment: 'sandbox'
  });

  try {
    console.log('Step 2: Updating location 5301...');
    // We'll use a custom request here to match the user's requirement exactly if possible
    // or use a known working endpoint.
    // Metrc v1/v2 update is usually POST /locations/v1/update
    const url = `/locations/v1/update`;
    const body = [{
      Id: 5301,
      Name: "Processing Area - Updated",
      LocationTypeName: "Default Location Type"
    }];

    // Using the internal request method of connector
    // Note: connector.request is private, so I'll just use fetch directly
    const credentials = btoa(`${integratorKey}:${userKey}`);
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

updateLocation();
