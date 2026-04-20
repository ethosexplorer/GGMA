const fs = require('fs');

let c = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');

// Replace the G icon box with the GGMA Logo
c = c.replace(
    '<div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold">G</div>',
    '<img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />'
);

fs.writeFileSync('src/pages/ProviderDashboard.tsx', c);
console.log('ProviderDashboard logo updated.');
