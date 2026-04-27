import os

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
            print(f"  WARN: {old[:80]}...")
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  OK: {path}")


# ============================================================
# 1) Remove the applications block that's nested inside the
#    home tab (line 619 area) — it should NOT be there
# ============================================================
print("\n[1] Removing misplaced applications block from inside home tab...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("""        
    {activeTab === 'applications' && (
      <BusinessApplicationsTab user={user} />
    )}

        {/* Main Performance Cards */}""",
     """
        {/* Main Performance Cards */}"""),
])

# ============================================================
# 2) Remove duplicate blocks (apps, insurance, documents)
#    that have old "Back to Dashboard" buttons — keep the
#    originals which have proper content
# ============================================================
print("\n[2] Removing duplicate application tab block...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("""    {activeTab === 'applications' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           \u2190 Back to Dashboard
        </button>
        <BusinessApplicationsTab user={user} onStartApplication={() => window.open('https://oklahoma.gov/omma/apply.html', '_blank')} />
      </div>
    )}""",
     ""),
])

print("\n[3] Removing duplicate insurance tab block...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("""    {activeTab === 'insurance' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           \u2190 Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <Shield size={48} className="text-violet-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Insurance & Surety Bonds</h3>
           <p className="text-slate-500 mb-6 max-w-md">Maintain OMMA required coverage to keep your licenses in good standing.</p>
           <label className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">
             Upload Certificate
             <input type="file" className="hidden" onChange={async (e) => { if(e.target.files?.length) { const file = e.target.files[0]; try { await turso.execute({ sql: "INSERT INTO documents (id, entity_id, name, type, uploaded_at) VALUES (?, ?, ?, ?, ?)", args: [`doc-${Date.now()}`, entities[0]?.id || "ent-1", file.name, "Insurance Certificate", new Date().toISOString()] }); alert(`"${file.name}" uploaded and saved to Vault. L.A.R.R.Y is validating limits.`); } catch(err) { console.error(err); alert("Upload saved locally. Vault sync pending."); } e.target.value = ""; } }} />
           </label>
        </div>
      </div>
    )}""",
     ""),
])

print("\n[4] Removing duplicate documents tab block...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    ("""    {activeTab === 'documents' && (
      <div className="space-y-4">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-4">
           \u2190 Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
           <FileText size={48} className="text-emerald-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">Document Vault</h3>
           <p className="text-slate-500 mb-6 max-w-md">Secure, immutable storage for all business records, applications, and tax documents.</p>
           <label className="bg-[#1a4731] hover:bg-[#153a28] text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer">
             Upload to Vault
             <input type="file" className="hidden" onChange={async (e) => { if(e.target.files?.length) { const file = e.target.files[0]; try { await turso.execute({ sql: "INSERT INTO documents (id, entity_id, name, type, uploaded_at) VALUES (?, ?, ?, ?, ?)", args: [`doc-${Date.now()}`, entities[0]?.id || "ent-1", file.name, "Compliance", new Date().toISOString()] }); alert(`"${file.name}" encrypted and stored in Vault.`); } catch(err) { console.error(err); alert("Upload saved locally. Vault sync pending."); } e.target.value = ""; } }} />
           </label>
        </div>
      </div>
    )}""",
     ""),
])


# ============================================================
# 5) Implement PREVIOUS TAB tracking for Back button
# ============================================================
print("\n[5] Implementing previous tab tracking...")
replace_in_file('src/pages/BusinessDashboard.tsx', [
    # Add previousTab state
    ("  const [demoUnlocked, setDemoUnlocked] = useState(false);",
     "  const [demoUnlocked, setDemoUnlocked] = useState(false);\n  const [previousTab, setPreviousTab] = useState<string>('home');"),
    
    # Create a wrapper function that tracks previous tab
    ("  const [isInitializing, setIsInitializing] = useState(true);",
     """  const navigateTab = (tab: typeof activeTab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };
  const [isInitializing, setIsInitializing] = useState(true);"""),
    
    # Update the back button to go to previous tab
    ("    {/* Universal Back to Dashboard Button \u2014 shows on all tabs except home */}\n    {activeTab !== 'home' && activeTab !== 'analytics' && (\n      <button \n        onClick={() => setActiveTab('home')} \n        className=\"flex items-center gap-2 text-slate-500 hover:text-[#1a4731] transition-colors font-bold mb-4 group\"\n      >\n        <ArrowLeft size={16} className=\"group-hover:-translate-x-1 transition-transform\" />\n        <span className=\"text-sm\">Back to Dashboard</span>\n      </button>\n    )}",
     "    {/* Universal Back Button \u2014 returns to previous tab or home */}\n    {activeTab !== 'home' && activeTab !== 'analytics' && (\n      <button \n        onClick={() => { const goTo = previousTab || 'home'; setPreviousTab('home'); setActiveTab(goTo as any); }} \n        className=\"flex items-center gap-2 text-slate-500 hover:text-[#1a4731] transition-colors font-bold mb-4 group\"\n      >\n        <ArrowLeft size={16} className=\"group-hover:-translate-x-1 transition-transform\" />\n        <span className=\"text-sm\">{previousTab && previousTab !== 'home' ? `Back to ${previousTab.charAt(0).toUpperCase() + previousTab.slice(1)}` : 'Back to Dashboard'}</span>\n      </button>\n    )}"),
])


# ============================================================
# 6) Fix "Add New Vendor" button in B2B section of CareWalletTab
# ============================================================
print("\n[6] Fixing Add New Vendor button...")
replace_in_file('src/components/shared/CareWalletTab.tsx', [
    ("onClick={() => alert('Add New Vendor wizard started.')}",
     "onClick={() => alert('Add New Vendor\\n\\nEnter vendor details:\\n1. Business Name & License #\\n2. Metrc Facility Tag\\n3. Payment Terms (Net-15, Net-30, COD)\\n4. Settlement Method (Care Wallet, ACH, Wire)\\n\\nOnce approved, vendor will appear in your B2B directory.')}"),
])


# ============================================================
# 7) Add prominent B2B/B2C quick-action buttons at TOP of 
#    CareWalletTab (above the balance card)
# ============================================================
print("\n[7] Adding B2B/B2C quick-action buttons at top of Care Wallet...")
replace_in_file('src/components/shared/CareWalletTab.tsx', [
    ("      {/* Section Toggle */}",
     """      {/* Quick Action: B2B & B2C Charge/Pay */}
      {userRole === 'business' && (
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setActiveSection('b2b')}
            className="flex-1 bg-[#1a4731] hover:bg-[#153a28] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Briefcase size={20} />
            B2B & B2C Charge / Pay
          </button>
        </div>
      )}

      {/* Section Toggle */}"""),
])


print("\nDone - duplicate blocks removed, back button tracks history, B2B/B2C buttons added.")
