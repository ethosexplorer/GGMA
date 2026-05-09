const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'components', 'oversight', 'AuditLogsTab.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/<button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">/g, 
  `<button onClick={() => alert('Exporting full audit log to CSV...')} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">`);

c = c.replace(/<button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-lg shadow-emerald-900\/20 transition-all">/g, 
  `<button onClick={() => alert('Generating cryptographic PDF report...')} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all">`);

c = c.replace(/<button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all">/g, 
  `<button onClick={() => alert('Opening advanced filter criteria...')} className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all">`);

c = c.replace(/<button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all">Next<\/button>/g, 
  `<button onClick={() => alert('Fetching next 50 log entries...')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all">Next</button>`);

c = c.replace(/<input\s+type="text"\s+placeholder="Search logs by user, action, or entity..."\s+className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400"\s*\/>/g,
  `<input type="text" placeholder="Search logs by user, action, or entity..." onKeyDown={(e) => { if(e.key === 'Enter') alert('Searching index for: ' + e.currentTarget.value); }} className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400" />`);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched AuditLogsTab.tsx');
