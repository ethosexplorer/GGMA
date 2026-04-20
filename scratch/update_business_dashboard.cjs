const fs = require('fs');

let c = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');

// Update Locations tab label for compliance_service
const oldLocTab = `<MapPin size={18} /> Locations`;
const newLocTab = `{user?.role === 'compliance_service' ? <Users size={18} /> : <MapPin size={18} />} {user?.role === 'compliance_service' ? 'Managed Clients' : 'Locations'}`;

c = c.replace(oldLocTab, newLocTab);

// Update Dashboard header for compliance_service
const oldHeader = `<h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Business Portal</h2>`;
const newHeader = `<h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{user?.role === 'compliance_service' ? 'Compliance Service Portal' : 'Business Portal'}</h2>`;

c = c.replace(oldHeader, newHeader);

fs.writeFileSync('src/pages/BusinessDashboard.tsx', c);
console.log('BusinessDashboard updated for Compliance Service role.');
