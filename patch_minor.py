import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. State Dropdown
states_dropdown = """        {/* STATES DROPDOWN BAR */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-center z-[55] relative shadow-inner">
          {jurisdiction && setJurisdiction && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
              <MapPin size={16} className="text-red-600 animate-bounce" />
              <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Select Jurisdiction:</span>
              <select 
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="bg-transparent text-sm font-black text-[#1a4731] outline-none cursor-pointer border-b-2 border-[#1a4731] pb-0.5 ml-2"
              >
                {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
"""

target = r"""        {/\* URGENT PLATFORM ALERT TICKER \*/}
        <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-red-700 relative z-\[60\]">
          <div className="inline-block animate-marquee-fast font-black text-sm uppercase tracking-widest">
            \{broadcastMsg\} &nbsp;   &nbsp; \{broadcastMsg\} &nbsp;   &nbsp; \{broadcastMsg\}
          </div>
        </div>"""

if 'STATES DROPDOWN BAR' not in app:
    app = re.sub(target, target.replace('\\', '') + '\n' + states_dropdown, app)
    # Remove old jurisdiction dropdown
    app = re.sub(r'\{jurisdiction && setJurisdiction && \(\s*<div className="flex items-center gap-2 mr-2 bg-slate-50 px-3 py-1\.5 rounded-lg border border-slate-200">.*?</div>\s*\)\}', '', app, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

# 2. RoleSelectorScreen: Add Attorney and Health & Laboratory
with open('src/components/RoleSelectorScreen.tsx', 'r', encoding='utf-8') as f:
    roles = f.read()

if "id: 'attorney'" not in roles:
    roles = roles.replace(
        "{ id: 'admin_external', label: 'External Admin', desc: 'Support & Processing', icon: Briefcase, color: 'teal' },",
        "{ id: 'admin_external', label: 'External Admin', desc: 'Support & Processing', icon: Briefcase, color: 'teal' },\n    { id: 'attorney', label: 'Attorney Dashboard', desc: 'Legal Counsel & Review', icon: Briefcase, color: 'indigo' },\n    { id: 'health_lab', label: 'Health & Laboratory', desc: 'Testing Results & Input', icon: Database, color: 'rose' },"
    )

with open('src/components/RoleSelectorScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(roles)

# 3. ProviderDashboard: Remove Referral and Compliance
with open('src/pages/ProviderDashboard.tsx', 'r', encoding='utf-8') as f:
    prov = f.read()

prov = re.sub(r"\{\s*id:\s*'referrals'.*?\},", "", prov)
prov = re.sub(r"\{\s*id:\s*'compliance'.*?\},", "", prov)

with open('src/pages/ProviderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(prov)

print('done')
