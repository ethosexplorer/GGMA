import re

# 1. Fix App.tsx State Dropdown
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

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

if 'STATES DROPDOWN BAR' not in app:
    # Use regex to find the broadcastMsg block and append the states_dropdown
    app = re.sub(r'(<div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-red-700 relative z-\[60\]">\s*<div className="inline-block animate-marquee-fast font-black text-sm uppercase tracking-widest">.*?</div>\s*</div>)', r'\1\n' + states_dropdown, app, flags=re.DOTALL)
    
    # Remove old jurisdiction dropdown inside the header
    app = re.sub(r'\{jurisdiction && setJurisdiction && \(\s*<div className="flex items-center gap-2 mr-2 bg-slate-50 px-3 py-1\.5 rounded-lg border border-slate-200">.*?</div>\s*\)\}', '', app, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)


# 2. Fix GlobalHeader.tsx Job Titles
with open('src/components/GlobalHeader.tsx', 'r', encoding='utf-8') as f:
    header = f.read()

header = header.replace('<option value="patient">Patient Portal</option>', '<option value="patient">Registered Patient</option>')
header = header.replace('<option value="business">Business (Dispensary/Grow)</option>', '<option value="business">Licensed Business Owner</option>')
header = header.replace('<option value="regulator_state">State Authority</option>', '<option value="regulator_state">State Regulatory Authority</option>')
header = header.replace('<option value="regulator_federal">Federal Dashboard</option>', '<option value="regulator_federal">Federal Compliance Officer</option>')
header = header.replace('<option value="admin_external">External Admin (Support)</option>', '<option value="admin_external">External Administrator</option>')
header = header.replace('<option value="admin_internal">Internal Admin Command</option>', '<option value="admin_internal">Internal Executive Command</option>')
header = header.replace('<option value="provider">Medical Provider</option>', '<option value="provider">Licensed Medical Provider</option>')

if "Exit Quality Assurance Mode" not in header:
    header = header.replace(
        "{isGodModeEligible && (",
        "{isGodModeEligible && !roleOverride && ("
    )
    # Add a global exit button when in simulation mode
    exit_btn = """
        {roleOverride && (
          <div className="flex items-center">
            <button onClick={() => setRoleOverride(null)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">
              <LogOut size={14} /> Exit Simulation Mode
            </button>
          </div>
        )}
"""
    header = re.sub(r'(<div className="flex items-center gap-4">\s*\{jurisdiction)', exit_btn + r'\1', header)

with open('src/components/GlobalHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(header)

# 3. Add Applications to BusinessDashboard.tsx
with open('src/pages/BusinessDashboard.tsx', 'r', encoding='utf-8') as f:
    bus = f.read()

app_btn = """
        <button 
          onClick={() => setActiveTab('applications')}
          className={cn("px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap", activeTab === 'applications' ? "bg-white text-[#1a4731] shadow-sm shadow-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
        >
          <FileText size={18} /> Applications
        </button>
"""
if "Applications" not in bus:
    bus = bus.replace("          <FileText size={18} /> Reporting\n        </button>", "          <FileText size={18} /> Reporting\n        </button>" + app_btn)

# Add fallback render for applications tab
app_render = """
    {activeTab === 'applications' && (
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
        <FileText size={48} className="text-[#1a4731] mb-4 opacity-50" />
        <h3 className="text-2xl font-black text-slate-800 mb-2">Self-Apply Licensing Hub</h3>
        <p className="text-slate-500 max-w-md">Direct pipeline to OMMA. Complete your business application directly or transmit your records for $25 processing fee. No subscription required for direct access.</p>
        <button className="mt-6 bg-[#1a4731] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2">
          Start Application <ArrowRight size={16} />
        </button>
      </div>
    )}
"""
if "Self-Apply Licensing Hub" not in bus:
    bus = bus.replace("{/* Main Performance Cards */}", app_render + "\n        {/* Main Performance Cards */}")

with open('src/pages/BusinessDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(bus)

print('done')
