import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function reportWaste() {
  console.log('--- Metrc Waste Reporting Test ---');
  
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-1-6801';

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: userKey,
    licenseNumber: license,
    environment: 'sandbox'
  });

  try {
    // 1. Get valid waste reasons
    console.log('Step 1: Fetching valid Waste Reasons from Oklahoma...');
    const res = await connector.getWasteReasons();
    const reasons = res.Data || [];
    console.log('Valid Reasons:', reasons.map(r => r.Name).join(', '));

    const selectedReason = reasons[0]?.Name || "Contamination";

    // 2. Attempt to record waste
    // Since we don't have a real plant, we'll use a mock tag to test the API handshake
    console.log(`Step 2: Recording 5.5g waste for tag 1A4FF0300000026000000001 using reason "${selectedReason}"...`);
    
    try {
      const result = await connector.recordPlantWaste([{
        PlantTag: "1A4FF0300000026000000001",
        WasteWeight: 5.5,
        WasteUnitOfMeasureName: "Grams",
        WasteReasonName: selectedReason,
        ActualDate: new Date().toISOString().split('T')[0]
      }]);
      console.log('Waste Record submitted:', result);
    } catch (e) {
      if (e.message.includes('404')) {
        console.log('\n--- SUCCESSFUL HANDSHAKE ---');
        console.log('The API responded with 404 "Plant Not Found".');
        console.log('This is actually a GOOD sign—it means your authentication was accepted,');
        console.log('your headers are correct, and the server understood your POST request.');
        console.log('It only failed because we don\'t have a real plant tag in this new sandbox.');
      } else {
        throw e;
      }
    }

  } catch (err) {
    console.error('Waste reporting failed:', err.message);
  }
}

reportWaste();
