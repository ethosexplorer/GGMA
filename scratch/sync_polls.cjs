const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN
});

async function syncPolls() {
  console.log('🔄 Syncing community_polls with actual CommunityPolls.tsx poll IDs...\n');

  // These are the actual poll IDs used in the CommunityPolls.tsx component
  const polls = [
    { id: 'federal_reschedule', question: '🚨 BREAKING: Cannabis rescheduled from Schedule I to Schedule III — What does this mean for Oklahoma?', category: 'Legal & Expungement' },
    { id: 'ok_enforcement', question: 'Oklahoma went from 8,400 cannabis farms to fewer than 1,400 — Is the crackdown working?', category: 'Legal & Expungement' },
    { id: 'natural_healing', question: 'Do you believe cannabis is a natural source of healing with minimal side effects?', category: 'Healing & Medical' },
    { id: 'medical_conditions', question: 'Which conditions do you believe benefit most from medical cannabis?', category: 'Healing & Medical' },
    { id: 'education_level', question: 'How would you rate your knowledge of medical cannabis?', category: 'Education & Awareness' },
    { id: 'age_group', question: 'What is your age group?', category: 'Demographics' },
    { id: 'med_vs_rec', question: 'Do you support medical cannabis programs over recreational legalization?', category: 'Support & Policy' },
    { id: 'side_effects', question: 'Compared to traditional pharmaceuticals, do you believe cannabis has fewer side effects?', category: 'Healing & Medical' },
    { id: 'nationality_background', question: 'Which background best describes you?', category: 'Demographics' },
    { id: 'growth_priority', question: 'What should be the #1 priority for the medical cannabis industry?', category: 'Growth & Priorities' },
    { id: 'econ_jobs', question: 'Should your state invest in cannabis industry job training programs?', category: 'Economic & Business' },
    { id: 'econ_tax', question: 'Where should cannabis tax revenue go?', category: 'Economic & Business' },
    { id: 'econ_small_biz', question: 'Is it too expensive for small businesses to enter the cannabis industry?', category: 'Economic & Business' },
    { id: 'legal_federal', question: 'Should cannabis be rescheduled from Schedule I at the federal level?', category: 'Legal & Expungement' },
    { id: 'legal_expungement', question: 'Should people with past cannabis convictions have their records expunged?', category: 'Legal & Expungement' },
    { id: 'political_trust', question: 'Do you trust your state legislature to create fair cannabis policy?', category: 'Political' },
    { id: 'political_vote', question: "Would a candidate's stance on cannabis influence your vote?", category: 'Political' },
    { id: 'culture_stigma', question: 'Has the stigma around cannabis changed in your community?', category: 'Culture & Lifestyle' },
    { id: 'culture_gen', question: 'Which generation do you think is driving cannabis normalization?', category: 'Culture & Lifestyle' },
    { id: 'culture_wellness', question: 'Do you view cannabis as part of a wellness routine — like yoga, meditation, or vitamins?', category: 'Culture & Lifestyle' },
    { id: 'biz_entrepreneur', question: 'Would you start a cannabis business if barriers were lower?', category: 'Economic & Business' },
    { id: 'legal_tribal_sovereignty', question: 'Should tribal nations have independent authority to regulate cannabis on sovereign land?', category: 'Legal & Expungement' },
    { id: 'legal_banking_safe', question: 'Should cannabis businesses have full access to banking and financial services?', category: 'Legal & Expungement' },
    { id: 'legal_attorney_access', question: 'Is it too difficult to find affordable cannabis legal counsel?', category: 'Legal & Expungement' },
    { id: 'legal_ip_protection', question: 'Should cannabis strains and products be eligible for federal patent and trademark protection?', category: 'Legal & Expungement' },
    { id: 'legal_social_equity', question: 'Should states prioritize cannabis licenses for communities most harmed by the War on Drugs?', category: 'Legal & Expungement' },
    { id: 'legal_patient_rights', question: 'Should medical cannabis patients be protected from employment discrimination?', category: 'Legal & Expungement' },
    { id: 'legal_interstate', question: 'Should legal cannabis be allowed to cross state lines between legal states?', category: 'Legal & Expungement' },
    { id: 'legal_civil_rights', question: 'Do you believe cannabis prohibition has been used as a tool for racial and social control?', category: 'Legal & Expungement' },
  ];

  // Clear old polls that don't match
  await client.execute({ sql: 'DELETE FROM community_polls WHERE id LIKE ?', args: ['poll_%'] });
  console.log('🗑️  Cleared old poll_1/poll_2 style entries');

  // Insert all actual polls
  for (const poll of polls) {
    await client.execute({
      sql: 'INSERT OR IGNORE INTO community_polls (id, question, category, status) VALUES (?, ?, ?, ?)',
      args: [poll.id, poll.question, poll.category, 'active']
    });
  }
  console.log(`✅ Synced ${polls.length} polls to community_polls table`);

  // Verify
  const count = await client.execute('SELECT COUNT(*) as c FROM community_polls');
  const voteCount = await client.execute('SELECT COUNT(*) as c FROM poll_votes');
  console.log(`\n📊 community_polls: ${count.rows[0].c} entries`);
  console.log(`📊 poll_votes: ${voteCount.rows[0].c} votes recorded`);
  console.log('\n✅ Founder Dashboard poll analytics should now show live data!');
}

syncPolls().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
