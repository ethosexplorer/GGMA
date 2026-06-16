// Approve Jaime Laughing — Firebase REST API with correct project and credentials

const API_KEY = 'AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw';
const PROJECT_ID = 'ggp-os';

async function signIn() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'globalgreenhp@gmail.com', password: 'Oklahoma1', returnSecureToken: true })
  });
  const data = await res.json();
  if (data.error) {
    console.log('❌ Firebase Auth failed:', data.error.message);
    console.log('\n💡 The Firebase Auth password may have been changed by a previous model.');
    console.log('   To approve Jaime manually:');
    console.log('   1. Log in at ggp-os.com');
    console.log('   2. Go to Operations Dashboard');
    console.log('   3. Click Jaime Laughing in the queue');
    console.log('   4. Change status to "Approved"');
    console.log('   5. Enter License ID: IA-0001904728');
    return null;
  }
  console.log('✅ Authenticated as:', data.email);
  return data.idToken;
}

async function findAndApproveJaime(token) {
  let allDocs = [];
  let nextPageToken = null;
  do {
    let url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?pageSize=100`;
    if (nextPageToken) url += `&pageToken=${nextPageToken}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    if (data.documents) allDocs = allDocs.concat(data.documents);
    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);

  console.log(`📊 ${allDocs.length} users found\n`);

  for (const doc of allDocs) {
    const f = doc.fields || {};
    const email = (f.email?.stringValue || '').toLowerCase();
    const name = (f.displayName?.stringValue || '').toLowerCase();
    if (email === 'jjlaughing@gmail.com' || name.includes('jaime') || name.includes('laughing')) {
      console.log(`🔍 Found: ${f.displayName?.stringValue} | ${f.email?.stringValue}`);
      
      const updateUrl = `https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=applicationStatus&updateMask.fieldPaths=status&updateMask.fieldPaths=ommaLicenseId&updateMask.fieldPaths=ommaLicenseType&updateMask.fieldPaths=ommaSubmissionDate&updateMask.fieldPaths=ommaDecisionDate&updateMask.fieldPaths=ommaApproved`;
      const updateRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            applicationStatus: { stringValue: 'Approved' },
            status: { stringValue: 'Active' },
            ommaLicenseId: { stringValue: 'IA-0001904728' },
            ommaLicenseType: { stringValue: 'Adult Patient 2-Year License' },
            ommaSubmissionDate: { stringValue: '2026-06-09' },
            ommaDecisionDate: { stringValue: '2026-06-16' },
            ommaApproved: { booleanValue: true }
          }
        })
      });
      const result = await updateRes.json();
      if (result.error) { console.log('❌ Update failed:', result.error.message); return; }
      
      console.log('\n🎉🎉🎉 JAIME LAUGHING — APPROVED! 🎉🎉🎉');
      console.log('   License:   IA-0001904728');
      console.log('   Type:      Adult Patient 2-Year License');
      console.log('   Approved:  06/16/2026');
      return;
    }
  }
  
  console.log('⚠️  Jaime not found. All users:');
  allDocs.forEach(d => {
    const f = d.fields || {};
    console.log(`   ${f.displayName?.stringValue || 'N/A'} | ${f.email?.stringValue || 'N/A'}`);
  });
}

async function main() {
  const token = await signIn();
  if (!token) return;
  await findAndApproveJaime(token);
}

main().catch(e => console.error('Error:', e.message));
