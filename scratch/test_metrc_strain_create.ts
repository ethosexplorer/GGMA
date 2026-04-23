import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function createStrain() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-11-6801';

  try {
    console.log('Strains Step 1: Creating strain "GGP Gold"...');
    
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const body = [{
      Name: "GGP Gold",
      TestingStatus: "None",
      IndicaPercentage: 70.0,
      SativaPercentage: 30.0
    }];

    const response = await fetch(`https://sandbox-api-ok.metrc.com/strains/v1/create?licenseNumber=${license}`, {
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

createStrain();
