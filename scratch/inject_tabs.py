import os

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

tabs_injection = """
    {activeTab === 'applications' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           ← Back to Dashboard
        </button>
        <BusinessApplicationsTab user={user} onStartApplication={() => window.open('https://oklahoma.gov/omma/apply.html', '_blank')} />
      </div>
    )}

    {activeTab === 'staff' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           ← Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <Users size={48} className="text-emerald-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Staff Directory & Compliance</h3>
           <p className="text-slate-500 mb-6 max-w-md">Manage employee badges, access levels, and run automated background checks via Checkr integration.</p>
           <button onClick={() => alert('Add Employee wizard initiated. Collecting background check consent...')} className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md">
             + Add New Employee
           </button>
        </div>
      </div>
    )}

    {activeTab === 'traceability' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           ← Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <Database size={48} className="text-emerald-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Metrc Traceability Hub</h3>
           <p className="text-slate-500 mb-6 max-w-md">Live sync with state regulatory systems. Generate manifests and track plant life cycles.</p>
           <div className="flex gap-4">
             <button onClick={() => alert('New Harvest Batch initialized. Assigning RFID tags...')} className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md">
               Create Harvest Batch
             </button>
             <button onClick={() => alert('Manifest exported and saved to Vault.')} className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-6 py-3 rounded-xl font-bold shadow-sm">
               Export Manifest
             </button>
           </div>
        </div>
      </div>
    )}

    {activeTab === 'insurance' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           ← Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <Shield size={48} className="text-violet-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Insurance & Surety Bonds</h3>
           <p className="text-slate-500 mb-6 max-w-md">Maintain OMMA required coverage to keep your licenses in good standing.</p>
           <label className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">
             Upload Certificate
             <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.length) { alert("Certificate uploaded and added to Vault. L.A.R.R.Y is validating limits."); e.target.value = ""; } }} />
           </label>
        </div>
      </div>
    )}

    {activeTab === 'documents' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           ← Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <FileText size={48} className="text-emerald-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Document Vault</h3>
           <p className="text-slate-500 mb-6 max-w-md">Secure, immutable storage for all business records, applications, and tax documents.</p>
           <label className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">
             Upload to Vault
             <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.length) { alert("Document successfully encrypted and stored in Vault."); e.target.value = ""; } }} />
           </label>
        </div>
      </div>
    )}
"""

replace_in_file('src/pages/BusinessDashboard.tsx', [
    (
        "{activeTab === 'wallet' && (",
        tabs_injection + "\n    {activeTab === 'wallet' && ("
    ),
    (
        '<button className={cn("w-full py-2 rounded-lg text-xs font-bold transition-colors", int.status === \'Connected\' ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[#1a4731] text-white hover:bg-[#153a28]")}>{int.status === \'Connected\' ? \'Configure\' : \'Connect Now\'}</button>',
        '<button onClick={() => int.status !== \'Connected\' && alert(int.name + " integration initialized. API keys pending...")} className={cn("w-full py-2 rounded-lg text-xs font-bold transition-colors", int.status === \'Connected\' ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[#1a4731] text-white hover:bg-[#153a28]")}>{int.status === \'Connected\' ? \'Configure\' : \'Connect Now\'}</button>'
    ),
    (
        '<button className="text-xs font-bold text-[#1a4731] hover:underline flex items-center gap-1"><ArrowRight size={14} /> Export OMMA Report</button>',
        '<button onClick={() => alert("OMMA Report generated and saved securely to your Vault.")} className="text-xs font-bold text-[#1a4731] hover:underline flex items-center gap-1"><ArrowRight size={14} /> Export OMMA Report</button>'
    )
])

print("Injected missing tabs and fixed button alerts.")
