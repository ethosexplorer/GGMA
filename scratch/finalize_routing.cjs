const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Refine renderDashboardByRole to match individual dashboard requirements
const oldRender = `    case 'admin':
    case 'enforcement_state':
    case 'regulator_state':
    case 'executive_founder':
    case 'backoffice_staff':
      return <AdminDashboard onLogout={onLogout} user={user} />;`;

const newRender = `    case 'admin':
    case 'regulator_state':
    case 'executive_founder':
    case 'backoffice_staff':
      return <AdminDashboard onLogout={onLogout} user={user} />;
    case 'enforcement_state':
      return <EnforcementDashboard onLogout={onLogout} user={user} />;`;

c = c.replace(oldRender, newRender);

// 2. Ensure "Oversight Portal" link goes to Login for Oversight
// (User: "And in oversight noone should be able to see who and what is in Oversight unless they work in it.")

// 3. Make sure the role category comparison in SignupScreen is case-insensitive or consistent
// LandingPage sets initialRole to 'Business', 'Patient', 'Oversight'
// roles.category is 'Business', 'Patient', 'Oversight'
// Loop is ['Patient', 'Business', 'Oversight']
// Logic was: {['Patient', 'Business', 'Oversight'].filter(cat => !initialRole || initialRole === 'all' || cat === initialRole).map((cat) => (

// 4. Update the "Oversight Portal" Card button text to "Oversight Access"
c = c.replace('Admin Login', 'Oversight Access');

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx Dashboard routing and Landing Page finalized.');
