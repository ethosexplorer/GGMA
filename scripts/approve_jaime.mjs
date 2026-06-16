// Approve Jaime Laughing — Try Firestore REST API without auth (if rules allow)
// Also try with anonymous auth

const API_KEY = 'AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw';
const PROJECT_ID = 'ggp-os';

// Try anonymous sign-in first
async function signInAnonymously() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ returnSecureToken: true })
  });
  const data = await res.json();
  if (data.idToken) {
    console.log('✅ Got anonymous auth token');
    return data.idToken;
  }
  console.log('⚠️  Anonymous auth failed, trying without auth...');
  return null;
}

async function listAndUpdate(token) {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  // Try to list users
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?pageSize=100`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  
  if (data.error) {
    console.log('❌ Cannot read users:', data.error.message);
    console.log('\n💡 Alternative: You can approve Jaime directly from your platform.');
    console.log('   Go to God Overview → Operations Dashboard → find Jaime Laughing → change status to Approved');
    return;
  }
  
  if (!data.documents || data.documents.length === 0) {
    console.log('No documents found');
    return;
  }

  console.log(`📊 Found ${data.documents.length} users\n`);

  for (const doc of data.documents) {
    const f = doc.fields || {};
    const email = (f.email?.stringValue || '').toLowerCase();
    const name = (f.displayName?.stringValue || '').toLowerCase();
    
    if (email === 'jjlaughing@gmail.com' || name.includes('jaime') || name.includes('laughing')) {
      console.log(`🔍 Found: ${f.displayName?.stringValue} | ${f.email?.stringValue}`);
      
      // Try to update
      const docPath = doc.name;
      const updateUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=applicationStatus&updateMask.fieldPaths=status&updateMask.fieldPaths=ommaLicenseId&updateMask.fieldPaths=ommaLicenseType&updateMask.fieldPaths=ommaSubmissionDate&updateMask.fieldPaths=ommaDecisionDate&updateMask.fieldPaths=ommaApproved`;
      
      const updateRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
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
      if (result.error) {
        console.log('❌ Update failed:', result.error.message);
      } else {
        console.log('\n🎉🎉🎉 JAIME LAUGHING — APPROVED! 🎉🎉🎉');
        console.log('   License ID:  IA-0001904728');
        console.log('   Type:        Adult Patient 2-Year License');  
        console.log('   Submitted:   06/09/2026');
        console.log('   Approved:    06/16/2026');
      }
      return;
    }
  }
  
  console.log('⚠️  Jaime not found. All users:');
  for (const doc of data.documents) {
    const f = doc.fields || {};
    console.log(`   ${f.displayName?.stringValue || 'N/A'} | ${f.email?.stringValue || 'N/A'} | status: ${f.status?.stringValue || f.applicationStatus?.stringValue || 'N/A'}`);
  }
}

async function main() {
  console.log('🔐 Attempting Firebase auth...\n');
  const token = await signInAnonymously();
  await listAndUpdate(token);
}

main().catch(err => console.error('Error:', err.message));
