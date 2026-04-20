const fs = require('fs');

let c = fs.readFileSync('src/pages/EnforcementDashboard.tsx', 'utf8');

// Update Sidebar Title
c = c.replace(
    '<h2 className="font-bold text-sm text-white leading-tight">Enforcement</h2>',
    '<h2 className="font-bold text-sm text-white leading-tight">RIP Command</h2>'
);

// Update Header Title
c = c.replace(
    '<h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">\n                   <Zap className="text-emerald-500" size={28} /> Rapid Traffic Stop Control \n                   <span className="text-slate-500 font-normal">| Forensic Intelligence</span>\n                 </h2>',
    '<h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">\n                   <Zap className="text-emerald-500" size={28} /> RIP: Real-time Intelligence & Policing\n                   <span className="text-slate-500 font-normal">| Forensic Intelligence</span>\n                 </h2>'
);

// Update Dashboard Placeholder Title
c = c.replace(
    '<h1 className="text-2xl font-bold text-white mb-1">Local Enforcement Command</h1>',
    '<h1 className="text-2xl font-bold text-white mb-1">RIP: Local Command</h1>'
);

fs.writeFileSync('src/pages/EnforcementDashboard.tsx', c);
console.log('EnforcementDashboard updated to RIP.');
