const fs = require('fs');

let c = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Update sidebar items to include RIP Intelligence
const oldNav = `{ id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'enforcement', label: 'Enforcement Queue', icon: Gavel, dot: true },`;

const newNav = `{ id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'enforcement', label: 'RIP Enforcement Queue', icon: Gavel, dot: true },`;

c = c.replace(oldNav, newNav);

fs.writeFileSync('src/pages/AdminDashboard.tsx', c);
console.log('AdminDashboard sidebar updated.');
