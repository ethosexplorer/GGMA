const fs = require('fs');

let c = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace the Shield icon box with the GGMA Logo
c = c.replace(
    '<div className="w-10 h-10 rounded bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">\n            <Shield size={22} />\n          </div>',
    '<img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />'
);

// Rename Dashboard Title
c = c.replace(
    '<h2 className="font-bold text-sm text-white leading-tight">Admin Dashboard</h2>',
    '<h2 className="font-bold text-sm text-white leading-tight">Oversight Command</h2>'
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', c);
console.log('AdminDashboard updated to Oversight Command and logo added.');
