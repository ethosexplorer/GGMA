import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Imports
if "import { GlobalHeader" not in app:
    app = app.replace(
        "import { SylaraFloatingWidget } from './components/SylaraFloatingWidget';",
        "import { SylaraFloatingWidget } from './components/SylaraFloatingWidget';\nimport { GlobalHeader } from './components/GlobalHeader';\nimport { RoleSelectorScreen } from './components/RoleSelectorScreen';"
    )

# 2. States
# Search for `const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);`
if "const [roleOverride" not in app:
    app = app.replace(
        "const [showLarryModal, setShowLarryModal] = useState(false);",
        "const [showLarryModal, setShowLarryModal] = useState(false);\n  const [roleOverride, setRoleOverride] = useState<string | null>(null);\n  const [hasBypassedSelector, setHasBypassedSelector] = useState(false);\n  const [jurisdiction, setJurisdiction] = useState('Oklahoma');"
    )

# 3. Global Header Injection
if "<GlobalHeader" not in app:
    app = app.replace(
        '<div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">',
        '<div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">\n        <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />'
    )

# 4. Use roleOverride in renderDashboardByRole
if "const role = roleOverride || profile.role;" not in app:
    app = app.replace(
        "const role = profile.role;",
        "const role = roleOverride || profile.role;"
    )

# 5. RoleSelectorScreen Injection
# Let's find the place where `renderDashboardByRole(userProfile)` is called and wrap it.
old_render = "                    {renderDashboardByRole(userProfile)}"
new_render = """                    {userProfile && (userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('monica') || userProfile.email?.includes('mgreen') || userProfile.email?.includes('globalgreenhp@gmail.com')) && !hasBypassedSelector ? (
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
    app = app.replace(old_render, new_render)

# 6. Make sure LandingPage has the jurisdiction prop
if "jurisdiction={jurisdiction}" not in app and "<LandingPage" in app:
    app = app.replace(
        '<LandingPage \n                onNavigate={handleNavigate} \n              />',
        '<LandingPage \n                onNavigate={handleNavigate} \n                jurisdiction={jurisdiction}\n                setJurisdiction={setJurisdiction}\n              />'
    )
    # Also if it's rendered differently:
    app = app.replace(
        '<LandingPage onNavigate={handleNavigate} />',
        '<LandingPage onNavigate={handleNavigate} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} />'
    )

# Write it back
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

print('done')
