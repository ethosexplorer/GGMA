import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Imports
if "import { GlobalHeader }" not in app:
    app = app.replace(
        "import { FeaturedPoll, StickyPollWidget } from './components/CommunityPolls';",
        "import { FeaturedPoll, StickyPollWidget } from './components/CommunityPolls';\nimport { GlobalHeader } from './components/GlobalHeader';\nimport { RoleSelectorScreen } from './components/RoleSelectorScreen';"
    )

# 2. States (Search for showLarryModal which I saw in the lines)
# Wait, let's just make sure it's injected right below it.
if "const [roleOverride" not in app:
    app = app.replace(
        "const [showLarryModal, setShowLarryModal] = useState(false);",
        "const [showLarryModal, setShowLarryModal] = useState(false);\n  const [roleOverride, setRoleOverride] = useState<string | null>(null);\n  const [hasBypassedSelector, setHasBypassedSelector] = useState(false);\n  const [jurisdiction, setJurisdiction] = useState('Oklahoma');"
    )

# 3. Global Header Injection
# Wait, I saw the exact string: <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">
if "GlobalHeader userProfile" not in app:
    app = app.replace(
        '<div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">',
        '<div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">\n        <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />'
    )

# 4. Use roleOverride in renderDashboardByRole
if "roleOverride || profile.role" not in app:
    app = app.replace(
        "const role = profile.role;",
        "const role = roleOverride || profile.role;"
    )

# 5. RoleSelectorScreen Injection
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

# Write it back
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

print('done')
