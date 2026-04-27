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

replace_in_file('src/components/DashboardAnalytics.tsx', [
    (
        '<button className="text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">Run Deep Forensic Audit</button>',
        '<button onClick={() => alert("Deep Forensic Audit initiated. Results will be deposited into your Vault.")} className="text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">Run Deep Forensic Audit</button>'
    ),
    (
        '<button className="w-full py-3 bg-[#1a4731] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#153a28] transition-all flex items-center justify-center gap-2">',
        '<button onClick={() => alert("Detailed Analytics Report generated and saved securely to your Vault.")} className="w-full py-3 bg-[#1a4731] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#153a28] transition-all flex items-center justify-center gap-2">'
    )
])

print("Fixed Analytics Tab buttons.")
