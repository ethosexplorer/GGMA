const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /<button className="px-5 py-2\.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md hover:bg-slate-700 transition-colors flex items-center gap-2">\s*<Plus size=\{16\} \/ onClick=\{\(\) => alert\("Opening secure Staff Provisioning modal\.\.\."\)\}> Create Staff Invite/g,
  '<button onClick={() => alert("Opening secure Staff Provisioning modal...")} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md hover:bg-slate-700 transition-colors flex items-center gap-2">\n              <Plus size={16} /> Create Staff Invite'
);

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed syntax error in AdminDashboard.tsx');
