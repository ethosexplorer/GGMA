import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function findCountBasedCategory() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';

  const credentials = btoa(`${integratorKey}:${userKey}`);

  try {
    const response = await fetch(`https://sandbox-api-ok.metrc.com/items/v2/categories`, {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    const data = await response.json();
    const categories = data.Data || data;
    
    console.log('Count-based categories for Plants:');
    categories.filter(c => c.QuantityType === 'CountBased').forEach(c => {
      console.log(`- ${c.Name} (Type: ${c.ProductCategoryType})`);
    });
  } catch (err) {
    console.error(err);
  }
}

findCountBasedCategory();
