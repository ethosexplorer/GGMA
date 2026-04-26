import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# Target the exact div that contains the LanguageSelector
target_div = r'(<div className="flex items-center gap-3">\s*<LanguageSelector)'
replacement = r"""<div className="flex items-center gap-3">
            {jurisdiction && setJurisdiction && (
              <div className="hidden md:flex items-center gap-2 mr-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <MapPin size={14} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 hidden lg:inline">Jurisdiction:</span>
                <select 
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="bg-transparent text-sm font-black text-[#1a4731] outline-none cursor-pointer w-24"
                >
                  {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <LanguageSelector"""

if "Jurisdiction:" not in app:
    app = re.sub(target_div, replacement, app)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

print('done')
