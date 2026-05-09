const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AttorneyDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-\[\#1a4731\] transition-colors cursor-pointer">\s*<h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">\s*<BarChart2 size=\{16\} className="text-blue-500" \/> Business Client View\s*<\/h4>/,
  `<div onClick={() => alert('Initiating Stripe upgrade for Business Client View module...')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <BarChart2 size={16} className="text-blue-500" /> Business Client View
                      </h4>`
);

c = c.replace(
  /<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-\[\#1a4731\] transition-colors cursor-pointer">\s*<h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">\s*<FileText size=\{16\} className="text-emerald-500" \/> Patient Record Access\s*<\/h4>/,
  `<div onClick={() => alert('Initiating Stripe upgrade for Patient Record Access module...')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <FileText size={16} className="text-emerald-500" /> Patient Record Access
                      </h4>`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched upsell buttons');
