import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Imports
if "import { GlobalHeader }" not in app:
    app = re.sub(
        r"(import { SylaraFloatingWidget } from '\./components/SylaraFloatingWidget';)",
        r"\1\nimport { GlobalHeader } from './components/GlobalHeader';\nimport { RoleSelectorScreen } from './components/RoleSelectorScreen';",
        app
    )

# 2. States
if "const [roleOverride" not in app:
    app = re.sub(
        r"(const \[showLarryModal, setShowLarryModal\] = useState\(false\);)",
        r"\1\n  const [roleOverride, setRoleOverride] = useState<string | null>(null);\n  const [hasBypassedSelector, setHasBypassedSelector] = useState(false);\n  const [jurisdiction, setJurisdiction] = useState('Oklahoma');",
        app
    )

# 3. Global Header Injection
if "<GlobalHeader" not in app:
    app = re.sub(
        r'(<div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">)',
        r'\1\n        <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />',
        app
    )

# 4. Use roleOverride in renderDashboardByRole
if "roleOverride || profile.role" not in app:
    app = re.sub(
        r"const role = profile\.role;",
        r"const role = roleOverride || profile.role;",
        app
    )
    # in case it was "const role = roleOverride || profile.role;" already? No it wasn't there

# 5. RoleSelectorScreen Injection
old_render = r"\{renderDashboardByRole\(userProfile\)\}"
new_render = """{userProfile && (userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('monica') || userProfile.email?.includes('mgreen') || userProfile.email?.includes('globalgreenhp@gmail.com')) && !hasBypassedSelector ? (
                      <RoleSelectorScreen 
                        userProfile={userProfile}
                        onSelect={(role) => {
                          setRoleOverride(role === 'executive_founder' ? null : role);
                          setHasBypassedSelector(true);
                        }}
                      />
                    ) : (
                      renderDashboardByRole(userProfile)
                    )}"""
if "RoleSelectorScreen" not in app:
    # There are multiple {renderDashboardByRole(userProfile)} in App.tsx (in blurred and non-blurred views)
    app = re.sub(old_render, new_render, app)

# Write it back
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

print('done')
