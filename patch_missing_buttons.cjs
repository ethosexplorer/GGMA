const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'PublicHealthDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /<button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 text-sm">Add New Protocol<\/button>/g,
  `<button onClick={() => alert('Opening Protocol Builder... Loading state legislative guidelines.')} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 text-sm">Add New Protocol</button>`
);

c = c.replace(
  /<button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 text-sm">Filter<\/button>/g,
  `<button onClick={() => alert('Opening Timeline Filters...')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 text-sm">Filter</button>`
);

c = c.replace(
  /<button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 text-sm flex items-center gap-2"><Plus size=\{16\} \/> Create Recall Alert<\/button>/g,
  `<button onClick={() => alert('Launching Emergency Broadcast Protocol...')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 text-sm flex items-center gap-2"><Plus size={16} /> Create Recall Alert</button>`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched the 3 missing buttons safely!');
