const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'PublicHealthDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Add NotificationDropdown import
if (!c.includes('NotificationDropdown')) {
  c = c.replace(/import \{ StatCard \} from '\.\.\/components\/StatCard';/, "import { StatCard } from '../components/StatCard';\nimport { NotificationDropdown } from '../components/shared/NotificationDropdown';");
}

// 2. Add NotificationDropdown to Header
const headerRegex = /<h1 className="text-xl font-bold text-slate-800 hidden sm:block">Public Health & Labs Dashboard<\/h1>\s*<\/div>\s*<div className="flex items-center gap-4">/;
if (headerRegex.test(c)) {
  c = c.replace(headerRegex, `<h1 className="text-xl font-bold text-slate-800 hidden sm:block">Public Health & Labs Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="w-px h-6 bg-slate-200" />`);
}

// 3. Wire Generate Report
c = c.replace(/<button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">\s*<Download size=\{16\} \/> Generate Report\s*<\/button>/, 
  `<button onClick={() => alert('Generating Public Health Report... Compiling statewide lab data.')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
              <Download size={16} /> Generate Report
            </button>`);

// 4. Wire State Mapping & Calibrate Tests
c = c.replace(/<button className="px-3 py-1\.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">State Mapping: Strict<\/button>/g, 
  `<button onClick={() => alert('Opening State Legislature Mapping Configuration...')} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">State Mapping: Strict</button>`);

c = c.replace(/<button className="px-3 py-1\.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Calibrate Tests<\/button>/g, 
  `<button onClick={() => alert('Initializing mass calibration sequence for all connected rapid test devices...')} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Calibrate Tests</button>`);

// 5. Wire Timeline Actions (These are mapped from event.actions)
c = c.replace(/<button key=\{i\} className="px-3 py-1\.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">\s*\{action\}\s*<\/button>/g, 
  `<button key={i} onClick={() => alert(\`Executing: \${action}... L.A.R.R.Y is logging this interaction.\`)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                  {action}
                                </button>`);

// 6. Make Exposure Mapping Live
// Using direct indexOf and substring to precisely replace only the target div
const searchStrStart = `<div className="mt-8 w-full max-w-2xl bg-slate-50 rounded-xl border border-slate-200 h-64 flex items-center justify-center relative overflow-hidden">`;
const searchStrEnd = `</div>\n              </div>\n            )}`;

const startIndex = c.indexOf(searchStrStart);
const endIndex = c.indexOf(searchStrEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const liveExposure = `<div className="mt-8 w-full max-w-4xl bg-slate-900 rounded-xl border border-slate-800 h-96 relative overflow-hidden shadow-2xl">
                   {/* Radar background */}
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent animate-pulse"></div>
                   
                   {/* Grid lines */}
                   <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   
                   {/* Map Nodes */}
                   <div className="absolute top-1/4 left-1/4">
                     <span className="flex h-4 w-4 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
                     </span>
                     <div className="absolute top-5 -left-10 bg-slate-800 text-white text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">Retailer: GreenLeaf Ext.</div>
                   </div>

                   <div className="absolute top-1/2 right-1/3">
                     <span className="flex h-3 w-3 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" style={{ animationDelay: '0.5s' }}></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-slate-900"></span>
                     </span>
                     <div className="absolute top-4 -left-6 bg-slate-800 text-white text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap">Patient Cluster</div>
                   </div>
                   
                   <div className="absolute bottom-1/3 right-1/4">
                     <span className="flex h-3 w-3 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" style={{ animationDelay: '1s' }}></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-slate-900"></span>
                     </span>
                   </div>

                   <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur border border-slate-700 p-3 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live GIS Tracking
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Sync: 12ms ping - Data: OMMA API</div>
                   </div>
                </div>\n              `;
                
    c = c.substring(0, startIndex) + liveExposure + c.substring(endIndex);
}

// 7. Wire Compliance Data Export
c = c.replace(/<button className="px-6 py-3 bg-\[\#1a4731\] text-white rounded-xl font-bold hover:bg-\[\#153a28\] shadow-md flex items-center gap-2 mx-auto">\s*<Download size=\{18\} \/> Export Full State Dataset \(CSV\)\s*<\/button>/,
  `<button onClick={() => alert('Compiling Historical Compliance Dataset... The CSV download will begin shortly.')} className="px-6 py-3 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md flex items-center gap-2 mx-auto">
                  <Download size={18} /> Export Full State Dataset (CSV)
                </button>`);

// Also fix "Edit Limits" inside activeTab === 'standards'
c = c.replace(/<button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Edit Limits<\/button>/g, 
  `<button onClick={() => alert('Opening State Threshold Editor...')} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Edit Limits</button>`);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched PublicHealthDashboard.tsx completely');
