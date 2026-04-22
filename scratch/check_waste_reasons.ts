import { MetrcConnector } from '../src/lib/metrc/MetrcConnector';

async function checkReasons() {
  const c = new MetrcConnector({ 
    integratorApiKey: 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v', 
    userApiKey: '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k', 
    licenseNumber: 'SF-SBX-OK-11-6801', 
    environment: 'sandbox' 
  });
  const res = await c.getWasteReasons();
  console.log('Type of response:', typeof res);
  console.log('Is Array:', Array.isArray(res));
  console.log('Content:', JSON.stringify(res, null, 2));
}

checkReasons();
