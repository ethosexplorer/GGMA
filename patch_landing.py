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

old_inner_rip = "response = '🕵️ **RIP (Regulatory Intelligence Policing)**\\n\\nRIP handles enforcement, background verification, and regulatory oversight for **government and state authority entities only**.\\n\\nWhich government function do you need?';"
new_inner_rip = "response = '🕵️ **RIP (Regulatory Intelligence Policing)**\\n\\nDue to the highly sensitive nature of intelligence and enforcement operations, I can only provide basic guidance here. For secure access to field reports or oversight actions, you must create an official account.\\n\\nWould you like to begin intake?';"
app_content = app_content.replace(old_inner_rip, new_inner_rip)

old_inner_rip_choices = "choices: ['Field Intelligence Report', 'Background Verification Check', 'Enforcement Status Inquiry', 'Compliance Audit Request', 'Contact Oversight Division', 'Main Menu']"
new_inner_rip_choices = "choices: ['Start Official Intake', 'Basic Overview', 'Main Menu']"
app_content = app_content.replace(old_inner_rip_choices, new_inner_rip_choices)


# 2. Update LandingPage Definition
old_landing_def = "const LandingPage = ({ onNavigate }: { onNavigate: (view: 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business' | 'legal-advocacy', role?: string) => void }) => {"
new_landing_def = "const LandingPage = ({ onNavigate, jurisdiction, setJurisdiction }: { onNavigate: (view: 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business' | 'legal-advocacy', role?: string) => void, jurisdiction?: string, setJurisdiction?: (s: string) => void }) => {"
app_content = app_content.replace(old_landing_def, new_landing_def)

# 3. Update LandingPage Top Nav to include Jurisdiction
# Search for the <nav> block
nav_target = '''<nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center">
            <img src="/gghp-logo.png" alt="GGHP Logo" className="h-14 md:h-16 w-auto object-contain object-left" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
            }} />
            <div className="fallback-logo hidden flex items-center">
              <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">'''

nav_replacement = '''<nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center">
            <img src="/gghp-logo.png" alt="GGHP Logo" className="h-14 md:h-16 w-auto object-contain object-left" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
            }} />
            <div className="fallback-logo hidden flex items-center">
              <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
            )}'''
app_content = app_content.replace(nav_target, nav_replacement)

# 4. Update LandingPage invocation
app_content = app_content.replace(
    "<LandingPage \n                onNavigate={handleNavigate} \n              />",
    "<LandingPage \n                onNavigate={handleNavigate}\n                jurisdiction={jurisdiction}\n                setJurisdiction={setJurisdiction}\n              />"
)

# 5. GlobalHeader invocation
app_content = app_content.replace(
    '<GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} />',
    '<GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)
print('done')
