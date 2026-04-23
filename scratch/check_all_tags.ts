import { MetrcConnector } from '../src/lib/metrc/MetrcConnector.ts';

async function checkAllLicenseTags() {
  const integratorKey = 'nbY-MmTbILyceAe2izW4vO6GILlqHU5a9s2ySaISiOGtRq6v';
  const userKey = '5U55J9JxjYEgl6vlblmJRirN8xFrwOLtG995kCt7JR5qxJ8k';
  const licenses = [
    'SF-SBX-OK-1-6801',
    'SF-SBX-OK-2-6801',
    'SF-SBX-OK-3-6801',
    'SF-SBX-OK-4-6801',
    'SF-SBX-OK-5-6801',
    'SF-SBX-OK-6-6801',
    'SF-SBX-OK-7-6801',
    'SF-SBX-OK-8-6801',
    'SF-SBX-OK-9-6801',
    'SF-SBX-OK-10-6801',
    'SF-SBX-OK-11-6801'
  ];

  const credentials = btoa(`${integratorKey}:${userKey}`);

  for (const license of licenses) {
    try {
      console.log(`Checking tags for ${license}...`);
      const url = `https://sandbox-api-ok.metrc.com/tags/v2/available?licenseNumber=${license}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      const data = await response.json().catch(() => []);
      if (data.length > 0) {
        console.log(`[FOUND] ${license} has ${data.length} tags:`, JSON.stringify(data[0]));
      } else {
        console.log(`[EMPTY] ${license} has no tags.`);
      }
    } catch (err) {
      console.error(`Error checking ${license}:`, err.message);
    }
  }
}

checkAllLicenseTags();
