import os
import re

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            content = re.sub(re.escape(old), new, content)
            
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = [
    (
        '<input type="text" placeholder="Ask L.A.R.R.Y to run an audit..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all" />\n                       <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors">\n                         <MessageSquare size={16} />\n                       </button>',
        '<input type="text" placeholder="Ask L.A.R.R.Y to run an audit..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all" onKeyDown={(e) => { if(e.key === "Enter") { alert("L.A.R.R.Y is analyzing your request. Standby."); e.currentTarget.value = ""; } }} />\n                       <button onClick={(e) => { const input = e.currentTarget.previousElementSibling as HTMLInputElement; if(input) { alert("L.A.R.R.Y is analyzing your request. Standby."); input.value = ""; } }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors">\n                         <MessageSquare size={16} />\n                       </button>'
    ),
    (
        '<button className="text-xs font-bold bg-white text-[#1a4731] px-4 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors shadow-sm w-max self-end hidden sm:block">',
        '<button onClick={() => { if(lowStockAlerts.length > 0) setActiveTab("inventory"); else if (unresolvedAlerts.length > 0) setActiveTab("compliance"); else setActiveTab("reporting"); }} className="text-xs font-bold bg-white text-[#1a4731] px-4 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors shadow-sm w-max self-end hidden sm:block">'
    )
]

replace_in_file('src/pages/BusinessDashboard.tsx', replacements)

print("Fixed Larry Chat")
