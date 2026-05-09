const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AttorneyDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Add Modal to the bottom
if (!c.includes('isIntakeOpen && (')) {
  const modalUI = `
      {isIntakeOpen && (
        <ShadowOverlay onClose={() => setIsIntakeOpen(false)}>
          <div className="bg-white w-[600px] max-w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><PlusCircle size={20} className="text-[#1a4731]" /> Secure Case Intake Portal</h3>
                <p className="text-sm text-slate-500 mt-1">L.A.R.R.Y will automatically scan uploaded documents for compliance risks.</p>
              </div>
              <button onClick={() => setIsIntakeOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Client Jurisdiction / State</label>
                <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1a4731]">
                  <option>Select State...</option>
                  <option>Oklahoma</option>
                  <option>Florida</option>
                  <option>California</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Upload Initial Case Documents (PDF/ZIP)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { alert('Establishing secure vault connection...'); setIsIntakeOpen(false); }}>
                  <FolderLock size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-600">Click to Browse Local System</p>
                  <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOCX, ZIP, PNG</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsIntakeOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => { alert('Intake initiated. L.A.R.R.Y is scanning docs...'); setIsIntakeOpen(false); }} className="px-5 py-2.5 font-bold text-white bg-[#1a4731] hover:bg-[#153a28] rounded-xl transition-colors shadow-md">Initialize Case File</button>
            </div>
          </div>
        </ShadowOverlay>
      )}
  `;
  // Using a more robust regex that ignores line endings
  c = c.replace(/<\/div>[\r\n\s]*\);[\r\n\s]*\};/, `${modalUI}\n    </div>\n  );\n};`);
}

// 2. Fix "Watch Case" and "Summary"
c = c.replace(/<button className="flex-1 px-3 py-1\.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">\s*Watch Case\s*<\/button>/g, 
  `<button onClick={() => alert('Case added to Watchlist.')} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">Watch Case</button>`
);
c = c.replace(/<button className="flex-1 px-3 py-1\.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">\s*Summary\s*<\/button>/g, 
  `<button onClick={() => alert('Generating AI Summary of case documents...')} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">Summary</button>`
);

// 3. Fix "Compliance Modules"
c = c.replace(/<button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">\s*<div className="flex items-center gap-2 font-medium">\s*<Shield size=\{16\} className="text-\[\#1a4731\]" \/> Larry Enforcement\s*<\/div>\s*<ChevronRight size=\{16\} className="text-slate-400 group-hover:text-\[\#1a4731\]" \/>\s*<\/button>/g,
  `<button onClick={() => alert('Opening Larry Enforcement Module...')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield size={16} className="text-[#1a4731]" /> Larry Enforcement
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-[#1a4731]" />
                    </button>`
);
c = c.replace(/<button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">\s*<div className="flex items-center gap-2 font-medium">\s*<CreditCard size=\{16\} className="text-emerald-500" \/> Compassion Balance & Financials\s*<\/div>\s*<ChevronRight size=\{16\} className="text-slate-400 group-hover:text-emerald-500" \/>\s*<\/button>/g,
  `<button onClick={() => setActiveTab('billing')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard size={16} className="text-emerald-500" /> Compassion Balance & Financials
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500" />
                    </button>`
);
c = c.replace(/<button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">\s*<div className="flex items-center gap-2 font-medium">\s*<BookOpen size=\{16\} className="text-blue-500" \/> Gov \/ State Interface\s*<\/div>\s*<ChevronRight size=\{16\} className="text-slate-400 group-hover:text-blue-500" \/>\s*<\/button>/g,
  `<button onClick={() => alert('Syncing with State Regulatory Interfaces...')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen size={16} className="text-blue-500" /> Gov / State Interface
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched Attorney Dashboard final buttons');
