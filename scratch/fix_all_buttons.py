import os, re

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        print(f"  SKIP: {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
        else:
            print(f"  WARN not found in {os.path.basename(path)}: {old[:80]}...")
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  OK: {path}")

# ============================================================
# 1) UPGRADE ENGINE BUTTON — currently works (setActiveTab subscription)
#    but let's also set the demo flag so the subscription portal loads
# ============================================================
print("\n[1] Fixing Upgrade Engine button...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("<Button onClick={() => setActiveTab('subscription')} className=\"bg-white text-[#1a4731] hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-black/10 whitespace-nowrap mt-4 md:mt-0 font-black rounded-xl\">",
     "<Button onClick={() => { setDemoUnlocked(true); setActiveTab('subscription'); }} className=\"bg-white text-[#1a4731] hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-black/10 whitespace-nowrap mt-4 md:mt-0 font-black rounded-xl\">"),
])

# ============================================================
# 2) ACTIVE LOCATIONS CARD — make it clickable to go to locations tab
# ============================================================
print("\n[2] Making Active Locations card clickable...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("""          {/* Active Locations */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">""",
     """          {/* Active Locations — clickable to see details */}
          <div onClick={() => setActiveTab('locations')} className="cursor-pointer bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">"""),
])

# ============================================================
# 3) STAFF TAB — Add onClick to "Add Employee" and "Manage" buttons
#    Remove the duplicate injected staff tab (lines 1551+)
# ============================================================
print("\n[3] Fixing Staff tab buttons...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    # Fix Add Employee button
    ("<Button icon={Plus}>Add Employee</Button>",
     "<Button icon={Plus} onClick={() => alert('Add Employee wizard initiated. Collecting name, role, OMMA card number, and background check consent...')}>Add Employee</Button>"),
    # Fix Manage button
    ('<button className="text-xs font-bold text-[#1a4731] hover:underline">Manage</button>',
     '<button onClick={() => alert("Employee management panel opened. You can edit role, schedule, and compliance status.")} className="text-xs font-bold text-[#1a4731] hover:underline cursor-pointer">Manage</button>'),
])

# ============================================================
# 4) TRACEABILITY — Fix top "New Harvest Batch" and "Export Manifest"
# ============================================================
print("\n[4] Fixing Traceability tab buttons...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("<Button icon={Plus}>New Harvest Batch</Button>",
     "<Button icon={Plus} onClick={() => alert('New Harvest Batch initialized. Enter batch name, strain, plant count, and assign RFID tags.')}>New Harvest Batch</Button>"),
    ('<Button variant="outline" icon={FileText}>Export Manifest</Button>',
     '<Button variant="outline" icon={FileText} onClick={() => alert("Transfer manifest generated and saved to Vault.")}>Export Manifest</Button>'),
])

# ============================================================
# 5) COMPLIANCE — Fix "Run Full Compliance Audit" button
# ============================================================
print("\n[5] Fixing Run Full Compliance Audit button...")
replace_in_file('src/components/business/ComplianceEngineTab.tsx', [
    ('<button className="w-full py-4 bg-white text-[#1a4731] rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-lg">\n                   Run Full Compliance Audit\n                </button>',
     '<button onClick={() => { alert("Full Compliance Audit initiated. L.A.R.R.Y is scanning all facilities against OMMA inspection form v5.3...\\n\\nAudit results will be saved to your Vault."); }} className="w-full py-4 bg-white text-[#1a4731] rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95 cursor-pointer">\n                   Run Full Compliance Audit\n                </button>'),
])

# ============================================================
# 6) COMPLIANCE — Fix Investigate buttons
# ============================================================
print("\n[6] Fixing Investigate buttons in Anomaly Detection...")
replace_in_file('src/components/business/ComplianceEngineTab.tsx', [
    ('<button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest">\n                              Investigate\n                           </button>',
     '<button onClick={() => alert("L.A.R.R.Y Investigation initiated.\\n\\nPulling Metrc chain-of-custody records, cross-referencing with SINC ledger, and generating deviation report...\\n\\nResults saved to Vault.")} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest cursor-pointer active:scale-95">\n                              Investigate\n                           </button>'),
])

# ============================================================
# 7) OMMA READINESS — Fix "Export OMMA Report" button
# ============================================================
print("\n[7] Fixing Export OMMA Report button...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("<Button icon={FileText}>Export OMMA Report</Button>",
     "<Button icon={FileText} onClick={() => alert('OMMA Pre-Inspection Report exported and saved to your Vault. Ready for inspector review.')}>Export OMMA Report</Button>"),
])

# ============================================================
# 8) SETTINGS TAB — Should show same as dashboard home, but with editable config
# ============================================================
print("\n[8] Fixing Settings button to show subscription/config tab...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("onClick={() => { setDemoUnlocked(true); setActiveTab('home'); }}\n          className={cn(\"px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap\", activeTab === 'subscription' ? \"bg-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20\" : \"text-slate-500 hover:text-amber-600 hover:bg-slate-200/50\")}\n        >\n          <Sparkles size={18} /> Settings",
     "onClick={() => { setDemoUnlocked(true); setActiveTab('subscription'); }}\n          className={cn(\"px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap\", activeTab === 'subscription' ? \"bg-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20\" : \"text-slate-500 hover:text-amber-600 hover:bg-slate-200/50\")}\n        >\n          <Sparkles size={18} /> Settings"),
])

# ============================================================
# 9) REMOVE DUPLICATE STAFF + TRACEABILITY TABS
#    The injected ones (from earlier) create duplicates
# ============================================================
print("\n[9] Removing duplicate injected staff/traceability/insurance/documents tabs...")

with open('src/pages/BusinessDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate staff block (the one with "Staff Directory & Compliance")
dup_staff = """    {activeTab === 'staff' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           \u2190 Back to Dashboard
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
    )}"""

dup_trace = """    {activeTab === 'traceability' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           \u2190 Back to Dashboard
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
    )}"""

if dup_staff in content:
    content = content.replace(dup_staff, '')
    print("  Removed duplicate staff tab")
else:
    print("  WARN: duplicate staff tab not found (may have different whitespace)")

if dup_trace in content:
    content = content.replace(dup_trace, '')
    print("  Removed duplicate traceability tab")
else:
    print("  WARN: duplicate traceability tab not found")

with open('src/pages/BusinessDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# ============================================================
# 10) CARE WALLET — Split General vs Care Wallet Transactions
# ============================================================
print("\n[10] Splitting General vs Care Wallet transactions...")

replace_in_file('src/components/shared/CareWalletTab.tsx', [
    # Update the section toggle to split transactions
    ("{ id: 'overview', label: 'Transactions' },",
     "{ id: 'overview', label: 'Care Wallet Transactions' },\n          { id: 'general_tx', label: 'General Transactions' },"),
])

# Now inject the General Transactions view after the overview section
general_tx_block = """
      {activeSection === 'general_tx' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">General Business Transactions</h3>
              <p className="text-xs text-slate-500">Non-wallet transactions: cash, card, bank transfers, and vendor payments</p>
            </div>
            <button onClick={() => alert('Full transaction history exported to CSV.')} className="text-sm text-[#1a4731] font-bold hover:underline">Export All</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 101, type: 'revenue', desc: 'POS Sale \u2014 Walk-in Customer #4821', amount: 127.50, date: '1 hour ago', method: 'Cash', ref: 'POS-4821' },
              { id: 102, type: 'revenue', desc: 'POS Sale \u2014 Online Order #1092', amount: 89.00, date: '3 hours ago', method: 'Card (Visa)', ref: 'POS-1092' },
              { id: 103, type: 'expense', desc: 'Vendor Payment \u2014 Green Leaf Wholesale', amount: -2400.00, date: 'Yesterday', method: 'Bank Transfer', ref: 'VND-882' },
              { id: 104, type: 'revenue', desc: 'POS Sale \u2014 Medical Patient (Care Wallet)', amount: 45.00, date: 'Yesterday', method: 'Care Wallet', ref: 'CW-9921' },
              { id: 105, type: 'expense', desc: 'OMMA License Renewal Fee', amount: -2500.00, date: '3 days ago', method: 'Bank Transfer', ref: 'OMMA-2026' },
              { id: 106, type: 'revenue', desc: 'Catering Order \u2014 Event Supply', amount: 1800.00, date: '5 days ago', method: 'Invoice', ref: 'INV-0042' },
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    tx.type === 'revenue' ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-500"
                  )}>
                    {tx.type === 'revenue' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{tx.desc}</p>
                    <p className="text-xs text-slate-500">{tx.method} \u2022 Ref: {tx.ref} \u2022 {tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold text-sm",
                  tx.amount > 0 ? "text-emerald-600" : "text-slate-800"
                )}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue (30d)</p>
                <p className="text-2xl font-black text-emerald-600">$24,891.50</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses (30d)</p>
                <p className="text-2xl font-black text-red-600">-$8,420.00</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net</p>
                <p className="text-2xl font-black text-slate-800">$16,471.50</p>
              </div>
            </div>
          </div>
        </div>
      )}
"""

replace_in_file('src/components/shared/CareWalletTab.tsx', [
    ("      {/* Compassion Allocation Modal */}",
     general_tx_block + "      {/* Compassion Allocation Modal */}"),
])


print("\nAll business dashboard button fixes applied.")
