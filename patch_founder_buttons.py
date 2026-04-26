import re

with open('src/pages/FounderDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if "import { FounderModals" not in content:
    content = content.replace(
        "import { MasterBankingInfo } from '../components/MasterBankingInfo';",
        "import { MasterBankingInfo } from '../components/MasterBankingInfo';\nimport { FounderModals } from '../components/FounderModals';"
    )

# Add activeModal state right after isAddingLedgerEntry
if "const [activeModal, setActiveModal] = useState" not in content:
    content = content.replace(
        "const [isAddingLedgerEntry, setIsAddingLedgerEntry] = useState<'revenue' | 'payable' | null>(null);",
        "const [isAddingLedgerEntry, setIsAddingLedgerEntry] = useState<'revenue' | 'payable' | null>(null);\n  const [activeModal, setActiveModal] = useState<{type: string, data?: any} | null>(null);"
    )

# 1. Network Reserves -> View Master Ledger
content = content.replace(
    '<button className="px-6 py-2 bg-indigo-600/20 text-indigo-300 font-bold rounded-xl hover:bg-indigo-600/40 transition-colors border border-indigo-500/30">View Master Ledger</button>',
    '<button onClick={() => setActiveModal({type: \'master_ledger\'})} className="px-6 py-2 bg-indigo-600/20 text-indigo-300 font-bold rounded-xl hover:bg-indigo-600/40 transition-colors border border-indigo-500/30">View Master Ledger</button>'
)

# 2. System Health -> View Detailed Logs
content = content.replace(
    '<button className="mt-6 w-full py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-slate-800 transition-colors flex justify-center gap-2 items-center">',
    '<button onClick={() => setActiveModal({type: \'system_logs\'})} className="mt-6 w-full py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-slate-800 transition-colors flex justify-center gap-2 items-center">'
)

# 3. HR Intelligence -> Click on Humans
# The human table is mapped over [ { name: 'Sarah Jenkins', ... } ]
content = content.replace(
    '<tr key={i} className="hover:bg-slate-50 transition-colors group">',
    '<tr key={i} onClick={() => setActiveModal({type: \'employee_profile\', data: e})} className="hover:bg-slate-50 transition-colors group cursor-pointer">'
)

# 4. Negligence Alerts -> Intercept
content = content.replace(
    '<button className="px-4 py-2 bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-200 transition-colors">Intercept</button>',
    '<button onClick={(ev) => { ev.stopPropagation(); setActiveModal({type: \'negligence_report\', data: {user: alert.user}}); }} className="px-4 py-2 bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-200 transition-colors">Intercept</button>'
)

# 5. Advertise new virtual position
content = content.replace(
    '<button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-200 hover:bg-indigo-100 transition-colors">Advertise New Virtual Position</button>',
    '<button onClick={() => setActiveModal({type: \'job_posting\'})} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-200 hover:bg-indigo-100 transition-colors">Advertise New Virtual Position</button>'
)
content = content.replace(
    '<button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-colors">Online Recruiting / Temp Services Link</button>',
    '<button onClick={() => setActiveModal({type: \'job_posting\'})} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-colors">Online Recruiting / Temp Services Link</button>'
)

# Inject <FounderModals /> at the very end right before SystemFreezeAlert
if "<FounderModals" not in content:
    content = content.replace(
        "{/* Proactive System Alert */}",
        "<FounderModals activeModal={activeModal} onClose={() => setActiveModal(null)} />\n\n        {/* Proactive System Alert */}"
    )

with open('src/pages/FounderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
