const fs = require('fs');

let c = fs.readFileSync('src/pages/EnforcementDashboard.tsx', 'utf8');

// Replace the ShieldAlert icon box with the GGMA Logo
c = c.replace(
    '<div className="w-10 h-10 rounded bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">\n              <ShieldAlert size={22} />\n            </div>',
    '<img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />'
);

fs.writeFileSync('src/pages/EnforcementDashboard.tsx', c);
console.log('EnforcementDashboard logo updated.');
