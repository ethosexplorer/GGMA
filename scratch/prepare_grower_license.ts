import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function prepareGrowerLicense() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801'; // Grower

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    console.log('Preparing Grower License SF-SBX-OK-3-6801...');
    
    // 1. Create Strain "GGP Gold"
    await fetch(`https://sandbox-api-ok.metrc.com/strains/v1/create?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ Name: "GGP Gold", TestingStatus: "None", IndicaPercentage: 60.0, SativaPercentage: 40.0 }])
    });
    console.log('Strain created.');

    // 2. Create Location "Processing Area - Updated"
    await fetch(`https://sandbox-api-ok.metrc.com/locations/v1/create?licenseNumber=${license}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ Name: "Processing Area - Updated", LocationTypeName: "Default Location Type" }])
    });
    console.log('Location created.');

  } catch (err) {
    console.error(err);
  }
}

prepareGrowerLicense();
