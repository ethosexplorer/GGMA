import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# 1. Update SINC and RIP chatbot greetings in App.tsx
old_rip = "if (variant === 'rip') return `🕵️ **RIP Intelligence Portal**. I am **Sylara**, coordinating with the **L.A.R.R.Y Enforcement Engine**. We are a **${metrcStatus}** as of ${date}. We handle real-time background checks, field oversight, and compliance policing via live sync. \\n\\nWhat intelligence or oversight task do you need assistance with?`;"
new_rip = "if (variant === 'rip') return `🕵️ **RIP Intelligence Portal**. I am **Sylara**, coordinating with the **L.A.R.R.Y Enforcement Engine**. Due to the highly sensitive nature of intelligence and enforcement operations, I can only provide basic guidance here. For secure access to field reports or oversight actions, you must create an official account. \\n\\nWould you like to begin intake?`;"
app_content = app_content.replace(old_rip, new_rip)

old_sinc = "if (variant === 'sinc') return `🛡️ **SINC Compliance Infrastructure**. I am **Sylara**, managing your secure operational backbone. SINC is a **${metrcStatus}**. We ensure audit-trails, encrypted records, and network integrity across all state jurisdictions. \\n\\nHow can I help secure your business today?`;"
new_sinc = "if (variant === 'sinc') return `🛡️ **SINC Compliance Infrastructure**. I am **Sylara**, managing your secure operational backbone. Because SINC handles encrypted audit trails and seed-to-sale architecture, deep access requires an authenticated business account. \\n\\nWould you like to begin business intake?`;"
app_content = app_content.replace(old_sinc, new_sinc)

# Replace the inner responses as well
old_inner_rip = "response = '🕵️ **RIP (Regulatory Intelligence Policing)**\\n\\nRIP handles enforcement, background verification, and regulatory oversight for **government and state authority entities only**.\\n\\nWhich government function do you need?';"
new_inner_rip = "response = '🕵️ **RIP (Regulatory Intelligence Policing)**\\n\\nDue to the highly sensitive nature of intelligence and enforcement operations, I can only provide basic guidance here. For secure access to field reports or oversight actions, you must create an official account.\\n\\nWould you like to begin intake?';"
app_content = app_content.replace(old_inner_rip, new_inner_rip)

old_inner_rip_choices = "choices: ['Field Intelligence Report', 'Background Verification Check', 'Enforcement Status Inquiry', 'Compliance Audit Request', 'Contact Oversight Division', 'Main Menu']"
new_inner_rip_choices = "choices: ['Start Official Intake', 'Basic Overview', 'Main Menu']"
app_content = app_content.replace(old_inner_rip_choices, new_inner_rip_choices)

# Ensure SINC has the right inner response too (if it exists)
# 2. Add State Dropdown to Landing Page nav
# We will inject the <select> into the <nav> right before <LanguageSelector>
nav_target = '<div className="flex items-center gap-3">'
nav_injection = '''<div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-500">State:</span>
              <select 
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#1a4731] outline-none cursor-pointer"
              >
                {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>'''
app_content = app_content.replace(nav_target, nav_injection, 1) # Replace first occurrence which is in the top banner
# wait, there are multiple <div className="flex items-center gap-3"> in App.tsx
# The one in the nav is right under <img src="/gghp-logo.png"

# Let's use a safer regex replacement for the Landing Page nav
app_content = re.sub(
    r'(<nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">.*?<div className="flex items-center gap-3">)',
    r'\1\n            <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">\n              <span className="text-xs font-bold text-slate-500">State:</span>\n              <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="bg-transparent text-sm font-bold text-[#1a4731] outline-none cursor-pointer">\n                {["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"].map(s => <option key={s} value={s}>{s}</option>)}\n              </select>\n            </div>',
    app_content,
    flags=re.DOTALL
)

# Also pass handleBack and viewHistory to GlobalHeader
app_content = app_content.replace(
    '<GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} />',
    '<GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)


# 3. Update GlobalHeader.tsx
with open('src/components/GlobalHeader.tsx', 'r', encoding='utf-8') as f:
    gh_content = f.read()

# Add new props
gh_content = gh_content.replace(
    'setRoleOverride: (r: string | null) => void\n}) => {',
    'setRoleOverride: (r: string | null) => void,\n  handleBack?: () => void,\n  canGoBack?: boolean\n}) => {\n  const [searchQuery, setSearchQuery] = React.useState("");'
)

# Add imports for Back Arrow
if 'ArrowLeft' not in gh_content:
    gh_content = gh_content.replace('import { Shield, MapPin } from \'lucide-react\';', 'import { Shield, MapPin, ArrowLeft, Search } from \'lucide-react\';')

# Add Back button
gh_content = gh_content.replace(
    '{/* Jurisdiction Dropdown */}',
    '{/* Back Button & Jurisdiction Dropdown */}\n      <div className="flex items-center gap-4">\n        {canGoBack && (\n          <button onClick={handleBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-600">\n            <ArrowLeft size={16} /> <span className="text-xs font-bold">Back</span>\n          </button>\n        )}\n'
)

gh_content = gh_content.replace(
    '</select>\n          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>\n        </div>\n      </div>',
    '</select>\n          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>\n        </div>\n      </div>\n      </div>' # Closing the extra flex div
)

# Add God Mode Search Bar
gh_content = gh_content.replace(
    '<option value="provider">Medical Provider</option>\n          </select>',
    '<option value="provider">Medical Provider</option>\n          </select>\n\n          <div className="relative ml-2 flex items-center">\n            <Search size={14} className="absolute left-2 text-indigo-400" />\n            <input \n              type="text" \n              placeholder="Search user to impersonate..." \n              value={searchQuery}\n              onChange={(e) => setSearchQuery(e.target.value)}\n              className="bg-indigo-900/50 border border-indigo-500/50 text-white text-xs px-3 py-1 pl-7 rounded outline-none focus:border-indigo-400 w-48"\n            />\n          </div>'
)

with open('src/components/GlobalHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(gh_content)

print('done')
