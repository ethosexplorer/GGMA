import { MetrcConnector } from './src/lib/metrc/MetrcConnector.ts';

async function checkCategories() {
  const c = new MetrcConnector({ 
    integratorApiKey: 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v', 
    userApiKey: '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k', 
    licenseNumber: 'SF-SBX-OK-11-6801', 
    environment: 'sandbox' 
  });
  const res = await c.request('/items/v1/categories');
  console.log(JSON.stringify(res, null, 2));
}

checkCategories();
