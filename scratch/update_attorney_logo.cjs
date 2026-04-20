const fs = require('fs');

let c = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');

// Replace the Scale icon box with the GGMA Logo
c = c.replace(
    '<div className="w-10 h-10 rounded-lg bg-[#1a4731] border border-[#2a6b4a] flex items-center justify-center font-bold shadow-inner">\n              <Scale size={24} className="text-emerald-400" />\n            </div>',
    '<img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />'
);

fs.writeFileSync('src/pages/AttorneyDashboard.tsx', c);
console.log('AttorneyDashboard logo updated.');
