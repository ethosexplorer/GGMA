import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function updateStrain() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';
  const strainId = 6201;

  try {
    console.log(`Strains Step 2: Updating strain ${strainId}...`);
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      Id: strainId,
      Name: "GGP Gold",
      TestingStatus: "None",
      IndicaPercentage: 60.0,
      SativaPercentage: 40.0
    }];

    // Metrc v1/v2 update is usually POST /strains/v1/update or PUT /strains/v1
    // The user said PUT /strains/v2. I'll try POST /strains/v1/update first as it's most standard for v1 license.
    const url = `/strains/v1/update`;

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

updateStrain();
