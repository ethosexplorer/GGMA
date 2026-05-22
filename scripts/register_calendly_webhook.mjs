#!/usr/bin/env node
// Register the Calendly webhook for the GGMA platform
// This only needs to run once.

const CALENDLY_TOKEN = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzczODcwMjM3LCJqdGkiOiI1NzJhOGNmZC1lOTVhLTQzYjYtYWY1NC00MjA1MTAxYmYwZTkiLCJ1c2VyX3V1aWQiOiIwNWQ1ZjdkZC05YzRmLTQ1MzYtOTA5ZC1lMWZmOTVhOGIzODkiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSJ9.ryK94LrR5S4wLWMrFgHN_JSGyG0bi1qlPny1osbfUnOsMhnwWm0MTJnJ0w1CeGa8OKDr0bKCwApARw0ZKdkk2g';

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

  // Step 2: Check existing webhooks
  console.log('\n🔍 Checking existing webhooks...');
  const existingRes = await fetch(`https://api.calendly.com/webhook_subscriptions?organization=${encodeURIComponent(orgUri)}&scope=organization`, {
    headers: { 'Authorization': `Bearer ${CALENDLY_TOKEN}` }
  });
  
  if (existingRes.ok) {
    const existing = await existingRes.json();
    console.log(`   Found ${existing.collection.length} existing webhook(s):`);
    for (const wh of existing.collection) {
      console.log(`   - ${wh.callback_url} [${wh.state}] events: ${wh.events.join(', ')}`);
    }
  }

  // Step 3: Register the webhook
  const WEBHOOK_URL = 'https://ggma.vercel.app/api/calendly-webhook';
  
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
    
    // If it already exists, that's fine
    if (result.message?.includes('already')) {
      console.log('\n✅ Webhook already exists — you\'re good to go!');
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
