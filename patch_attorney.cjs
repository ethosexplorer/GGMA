const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AttorneyDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Add state for Intake Modal
if (!c.includes('isIntakeOpen')) {
  c = c.replace(/const \[searchQuery, setSearchQuery\] = useState\(''\);/, "const [searchQuery, setSearchQuery] = useState('');\n  const [isIntakeOpen, setIsIntakeOpen] = useState(false);");
}

// 2. Replace New Case Intake alert with state trigger
c = c.replace(/onClick=\{.*?alert\('Opening Secure File Portal.*?'\)\}/, "onClick={() => setIsIntakeOpen(true)}");

// 3. Add Modal to the bottom
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
  c = c.replace(/<\/div>\n  \);\n\};/, `${modalUI}\n    </div>\n  );\n};`);
}

// 4. Calendar Tab
if (!c.includes(`activeTab === 'calendar'`)) {
  const calTab = `
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <UserCalendar user={user} />
              </div>
            )}
`;
  c = c.replace(/<div className="max-w-7xl mx-auto space-y-6">/, `<div className="max-w-7xl mx-auto space-y-6">\n${calTab}`);
}

// 5. Browse Cases - Search input wire up
c = c.replace(/<input type="text" placeholder="Search by jurisdiction, issue type, or keyword..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-\[\#1a4731\] outline-none" \/>/,
  `<input type="text" placeholder="Search by jurisdiction, issue type, or keyword..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#1a4731] outline-none" onKeyDown={(e) => { if(e.key === 'Enter') alert('Searching National Database for: ' + e.currentTarget.value + '... Connecting to L.A.R.R.Y Index.'); }} />`
);

// 6. Active Cases - Message Client & Submit Document
c = c.replace(/<button className="px-4 py-2 bg-\[\#1a4731\] text-white rounded-lg text-sm font-bold hover:bg-\[\#153a28\]">Message Client<\/button>/g,
  `<button onClick={() => alert('Opening secure message thread with client...')} className="px-4 py-2 bg-[#1a4731] text-white rounded-lg text-sm font-bold hover:bg-[#153a28]">Message Client</button>`
);
c = c.replace(/<button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">Submit Document<\/button>/g,
  `<button onClick={() => alert('Uploading to Secure Vault...')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">Submit Document</button>`
);

// 7. Law Library - Browse
c = c.replace(/<button className="mt-6 px-6 py-3 bg-\[\#1a4731\] text-white rounded-xl font-bold hover:bg-\[\#153a28\] shadow-md">Browse Library<\/button>/g,
  `<button onClick={() => alert('Accessing State/Federal Statutes Database...')} className="mt-6 px-6 py-3 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md">Browse Library</button>`
);

// 8. Vault Buttons
c = c.replace(/<button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size=\{14\}\/><\/button>/g,
  `<button onClick={() => alert('Opening Secure Document Viewer...')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>`
);
c = c.replace(/<button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size=\{14\}\/><\/button>/g,
  `<button onClick={() => alert('Decrypting and downloading vault asset...')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched Attorney Dashboard');
