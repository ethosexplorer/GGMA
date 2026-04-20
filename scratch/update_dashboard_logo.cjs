const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// Update Logo in DashboardLayout (Sidebar)
// User wants "the other" (GGMA) on the left hand side corner of every other page.
c = c.replace(
    'img src="/ggp-os-logo.png" alt="GGP-OS Logo"',
    'img src="/logo.png" alt="GGMA Logo"'
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx DashboardLayout logo updated.');
