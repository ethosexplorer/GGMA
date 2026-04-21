import { MetrcConnector } from './src/lib/metrc/MetrcConnector.ts';

async function seedSandbox() {
  console.log('--- Seeding Metrc Sandbox Data ---');
  
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
    // 1. Create a Strain
    console.log('Step 1: Creating Strain "GGP Gold"...');
    try {
      await connector.createStrains([{
        Name: "GGP Gold",
        TestingStatus: "None",
        ThcLevel: 0.25,
        CbdLevel: 0.02,
        IndicaPercentage: 70.0,
        SativaPercentage: 30.0
      }]);
      console.log('Strain created.');
    } catch (e) {
      console.log('Strain check:', e.message.includes('exists') ? 'Already exists (OK)' : e.message);
    }

    // 2. Create a Location
    console.log('Step 2: Creating Location "Processing Area"...');
    try {
      await connector.createLocations([{
        Name: "Processing Area",
        LocationTypeName: "Default Location Type"
      }]);
      console.log('Location created.');
    } catch (e) {
      console.log('Location check:', e.message.includes('exists') ? 'Already exists (OK)' : e.message);
    }

    // 3. Create an Item
    console.log('Step 3: Creating Item "GGP Waste Batch"...');
    try {
      await connector.createItems([{
        Name: "GGP Waste Batch",
        ItemCategory: "MMJ Waste",
        UnitOfMeasure: "Grams"
      }]);
      console.log('Item created.');
    } catch (e) {
      console.log('Item check:', e.message.includes('exists') ? 'Already exists (OK)' : e.message);
    }

    // 4. Create a Plant Batch
    console.log('Step 4: Creating Plant Batch "PB-GGP-TEST"...');
    try {
      await connector.createPlantBatches([{
        Name: "PB-GGP-TEST",
        Type: "Seedling",
        Strain: "GGP Gold",
        Count: 10,
        Location: "Processing Area",
        ActualDate: new Date().toISOString().split('T')[0]
      }]);
      console.log('Plant Batch created.');
    } catch (e) {
      console.log('Plant Batch check:', e.message.includes('exists') ? 'Already exists (OK)' : e.message);
    }

  } catch (err) {
    console.error('Seeding failed:', err.message);
    if (err.message.includes('403')) {
      console.log('\nTIP: This license type may not have permission to create this specific resource.');
    }
  }
}

seedSandbox();
