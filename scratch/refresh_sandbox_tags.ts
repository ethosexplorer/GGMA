import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function setupAndGetTags() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const license = 'SF-SBX-OK-3-6801';

  const connector = new MetrcConnector({
    integratorApiKey: integratorKey,
    userApiKey: userKey,
    licenseNumber: license,
    environment: 'sandbox'
  });

  try {
    console.log('Running Sandbox Setup to refresh tags...');
    // This might fail if already setup, but let's see
    const setup = await connector.setupSandbox().catch(e => e.message);
    console.log('Setup result:', JSON.stringify(setup));

    console.log('Fetching available tags...');
    const credentials = btoa(`${integratorKey}:${userKey}`);
    const response = await fetch(`https://sandbox-api-ok.metrc.com/tags/v1/available?licenseNumber=${license}`, {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    const tags = await response.json().catch(() => []);
    console.log('Available Tags:', JSON.stringify(tags));
  } catch (err) {
    console.error(err);
  }
}

setupAndGetTags();
