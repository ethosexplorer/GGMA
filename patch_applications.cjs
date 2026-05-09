const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'OperationsDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/<div key=\{i\} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">/g,
  `<div key={i} onClick={() => alert('Opening application package for ' + a.name + '... Connecting to State Portal.')} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched Applications Queue in OperationsDashboard.tsx');
