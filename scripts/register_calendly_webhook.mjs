import dotenv from 'dotenv';
dotenv.config();

const CALENDLY_TOKEN = process.env.VITE_CALENDLY_TOKEN_V2 || process.env.VITE_CALENDLY_TOKEN;

async function main() {
  // Step 1: Get current user to find organization URI
  console.log('🔍 Getting Calendly user info...');
  const userRes = await fetch('https://api.calendly.com/users/me', {
    headers: { 'Authorization': `Bearer ${CALENDLY_TOKEN}`, 'Content-Type': 'application/json' }
  });
  
  if (!userRes.ok) {
    const err = await userRes.text();
    console.error('❌ Failed to get user info:', userRes.status, err);
    process.exit(1);
  }
  
  const userData = await userRes.json();
  const userUri = userData.resource.uri;
  const orgUri = userData.resource.current_organization;
  console.log('✅ User:', userData.resource.name);
  console.log('   Email:', userData.resource.email);
  console.log('   Org:', orgUri);

  // Step 2: Check existing webhooks and clean up disabled or matching subscriptions
  const WEBHOOK_URL = 'https://ggma.vercel.app/api/calendly-webhook';
  console.log('\n🔍 Checking existing webhooks...');
  const existingRes = await fetch(`https://api.calendly.com/webhook_subscriptions?organization=${encodeURIComponent(orgUri)}&scope=organization`, {
    headers: { 'Authorization': `Bearer ${CALENDLY_TOKEN}` }
  });
  
  if (existingRes.ok) {
    const existing = await existingRes.json();
    console.log(`   Found ${existing.collection.length} existing webhook(s)`);
    for (const wh of existing.collection) {
      console.log(`   - ${wh.callback_url} [${wh.state}]`);
      if (wh.callback_url === WEBHOOK_URL || wh.state === 'disabled') {
        console.log(`     🗑️ Deleting old/disabled webhook: ${wh.uri}`);
        const delRes = await fetch(wh.uri, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${CALENDLY_TOKEN}` }
        });
        if (delRes.ok) {
          console.log('     ✅ Deleted old webhook.');
        } else {
          console.error(`     ❌ Failed to delete: ${delRes.status}`, await delRes.text());
        }
      }
    }
  }

  // Step 3: Register the webhook
  console.log(`\n📡 Registering webhook: ${WEBHOOK_URL}`);
  const createRes = await fetch('https://api.calendly.com/webhook_subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CALENDLY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      events: ['invitee.created', 'invitee.canceled'],
      organization: orgUri,
      user: userUri,
      scope: 'organization',
    }),
  });

  const result = await createRes.json();
  
  if (createRes.ok || createRes.status === 201) {
    console.log('✅ Webhook registered successfully!');
    console.log('   URI:', result.resource?.uri);
    console.log('   State:', result.resource?.state);
    console.log('   Events:', result.resource?.events?.join(', '));
    console.log('   Callback:', result.resource?.callback_url);
  } else {
    console.error('❌ Webhook registration failed:', createRes.status);
    console.error('   Response:', JSON.stringify(result, null, 2));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
