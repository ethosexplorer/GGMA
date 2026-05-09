const fs = require('fs');
const path = require('path');

// 1. Patch OperationsDashboard.tsx
const p1 = path.join(__dirname, 'src', 'pages', 'OperationsDashboard.tsx');
let c1 = fs.readFileSync(p1, 'utf8');

c1 = c1.replace(/<button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md">Pick Up<\/button>/g,
  `<button onClick={(e) => { e.stopPropagation(); alert('Connecting to patient queue...'); }} className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md">Pick Up</button>`
);

fs.writeFileSync(p1, c1, 'utf8');
console.log('Patched OperationsDashboard.tsx');

// 2. Patch ITSupportDashboard.tsx
const p2 = path.join(__dirname, 'src', 'components', 'it', 'ITSupportDashboard.tsx');
let c2 = fs.readFileSync(p2, 'utf8');

c2 = c2.replace(/<button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors">\s*Query User\s*<\/button>/g,
  `<button onClick={() => alert('Searching Global User Directory...')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors">\n            Query User\n          </button>`
);

c2 = c2.replace(/<button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg tooltip-trigger" title="Reset Password">/g,
  `<button onClick={() => alert('Sending forced password reset link...')} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg tooltip-trigger" title="Reset Password">`
);

c2 = c2.replace(/<button className="p-2 hover:bg-slate-100 text-red-600 rounded-lg tooltip-trigger" title="Suspend Account">/g,
  `<button onClick={() => alert('WARNING: Suspending user account will revoke all active API and portal tokens. Proceed?')} className="p-2 hover:bg-slate-100 text-red-600 rounded-lg tooltip-trigger" title="Suspend Account">`
);

c2 = c2.replace(/<div className="pt-1 cursor-pointer">/g,
  `<div className="pt-1 cursor-pointer" onClick={() => alert('Are you sure you want to toggle this feature flag? This affects global production traffic.')}>`
);

fs.writeFileSync(p2, c2, 'utf8');
console.log('Patched ITSupportDashboard.tsx');
