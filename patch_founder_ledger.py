import re

with open('src/pages/FounderDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ArrowLeft import if not present
if "import { ArrowLeft" not in content and "ArrowLeft," not in content:
    content = content.replace("import { Activity", "import { Activity, ArrowLeft")

# Add state
content = content.replace(
    "const [activeTab, setActiveTab] = useState('overview');",
    "const [activeTab, setActiveTab] = useState('overview');\n  const [isAddingLedgerEntry, setIsAddingLedgerEntry] = useState<'revenue' | 'payable' | null>(null);\n  const [ledgerForm, setLedgerForm] = useState({ name: '', amount: '' });"
)

# Replace addRevenueStream functions
old_add_funcs = '''  const addRevenueStream = () => {
    setFounderLedger([{ n: 'New Custom Receivable', t: 'Manual Entry', g: '$0', net: '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderLedger]);
  };
  
  const addPayableStream = () => {
    setFounderPayables([{ n: 'New Custom Payable', t: 'Manual Entry', g: '$0', net: '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderPayables]);
  };'''

new_add_funcs = '''  const addRevenueStream = () => {
    setIsAddingLedgerEntry('revenue');
  };
  
  const addPayableStream = () => {
    setIsAddingLedgerEntry('payable');
  };

  const handleSaveLedgerEntry = () => {
    if (isAddingLedgerEntry === 'revenue') {
       setFounderLedger([{ n: ledgerForm.name || 'Custom Revenue Stream', t: 'Manual Entry', g: ledgerForm.amount || '$0', net: ledgerForm.amount || '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderLedger]);
    } else if (isAddingLedgerEntry === 'payable') {
       setFounderPayables([{ n: ledgerForm.name || 'Custom Payable', t: 'Manual Entry', g: ledgerForm.amount || '$0', net: ledgerForm.amount || '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderPayables]);
    }
    setIsAddingLedgerEntry(null);
    setLedgerForm({ name: '', amount: '' });
  };'''

content = content.replace(old_add_funcs, new_add_funcs)

# Update renderAccountingLedger to conditionally render the form
render_accounting_start = "const renderAccountingLedger = () => ("
form_render = '''const renderAccountingLedger = () => {
    if (isAddingLedgerEntry) {
      return (
        <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <button onClick={() => setIsAddingLedgerEntry(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
              <ArrowLeft size={18} /> Back to Ledger
           </button>
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {isAddingLedgerEntry === 'revenue' ? 'Add Revenue Stream' : 'Add Account Payable'}
              </h2>
              <p className="text-slate-500 mb-8 font-medium">Enter the details for this new manual ledger entry.</p>
              
              <div className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Account / Source Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Consulting Retainer"
                      value={ledgerForm.name}
                      onChange={(e) => setLedgerForm({...ledgerForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount (Monthly/Gross)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $5,000"
                      value={ledgerForm.amount}
                      onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                 </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button onClick={handleSaveLedgerEntry} className="px-6 py-3 bg-[#1a4731] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg transition-colors flex-1">
                    Save Entry
                 </button>
              </div>
           </div>
        </div>
      );
    }
    
    return ('''

content = content.replace(render_accounting_start, form_render)

# Close the new block properly
content = content.replace('''           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={120} /></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                   <h3 className="text-2xl font-black mb-1">Generate Compliance Export</h3>
                   <p className="text-slate-400 text-sm">Download full QuickBooks-ready CSV ledger for OMMA auditing.</p>
                 </div>
                 <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shrink-0">Download Audit File</button>
              </div>
           </div>
        </div>
      </motion.div>
    );''', '''           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={120} /></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                   <h3 className="text-2xl font-black mb-1">Generate Compliance Export</h3>
                   <p className="text-slate-400 text-sm">Download full QuickBooks-ready CSV ledger for OMMA auditing.</p>
                 </div>
                 <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shrink-0">Download Audit File</button>
              </div>
           </div>
        </div>
      </motion.div>
    );
  };''')

with open('src/pages/FounderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
