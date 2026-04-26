const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Find PatientDashboard inside patient-portal view
const pattern = /view === 'patient-portal' && \(\s*<PatientDashboard\s+onLogout=\{handleLogout\}\s+user=\{userProfile\}\s+onSignup=\{([^}]+)\}\s+key="patient-portal"\s*\/>\s*\)/m;
const match = c.match(pattern);

if (match) {
  const replacement = `view === 'patient-portal' && (
            <PatientDashboard
              onLogout={handleLogout}
              user={userProfile}
              onSignup={${match[1]}}
              onOpenConcierge={() => setShowLarryModal(true)}
              key="patient-portal"
            />
          )`;
  c = c.replace(pattern, replacement);
  fs.writeFileSync('src/App.tsx', c, 'utf8');
  console.log('✅ Replaced using regex');
} else {
  console.log('❌ Regex not found');
}
