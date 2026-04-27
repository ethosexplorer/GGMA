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

b2b_injection = """
      {activeSection === 'b2b' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Charge Patient Wallet</h3>
            <p className="text-sm text-slate-500 mb-4">Deduct funds from a patient's Compassion Balance for in-store or walk-in purchases.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Patient Wallet ID / Email</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="e.g. PAT-9921 or patient@email.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Amount to Charge ($)</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="0.00" />
              </div>
              <button onClick={() => alert('Transaction successfully deducted from patient Care Wallet.')} className="w-full bg-[#1a4731] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#153a28]">
                Charge Patient
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">B2B Vendor Transactions</h3>
            <p className="text-sm text-slate-500 mb-4">Initiate bulk transfers or settle wholesale invoices via GGE Settlement Network.</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button onClick={() => alert('Add New Vendor wizard started.')} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
                  + Add New Vendor
                </button>
                <button onClick={() => alert('Bulk Transaction initiated via Settlement Network.')} className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200">
                  Initiate Bulk Tx
                </button>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <label className="text-xs font-bold text-slate-600 mb-1 block">Select Vendor</label>
                <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500">
                  <option>Select a verified vendor...</option>
                  <option>Green Leaf Wholesale (VND-882)</option>
                  <option>Nature\'s Extractors (VND-193)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Invoice Amount ($)</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="0.00" />
              </div>
              <button onClick={() => alert('B2B Settlement executed successfully.')} className="w-full bg-[#1a4731] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#153a28]">
                Pay Vendor Invoice
              </button>
            </div>
          </div>
        </div>
      )}
"""

replace_in_file('src/components/shared/CareWalletTab.tsx', [
    (
        "      {/* Compassion Allocation Modal */}",
        b2b_injection + "      {/* Compassion Allocation Modal */}"
    )
])

print("Injected B2B view into CareWalletTab.")
