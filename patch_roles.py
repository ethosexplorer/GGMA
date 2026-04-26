import re

# 1. Update App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

if "import { RoleSelectorScreen" not in app:
    app = app.replace(
        "import { GlobalHeader } from './components/GlobalHeader';",
        "import { GlobalHeader } from './components/GlobalHeader';\nimport { RoleSelectorScreen } from './components/RoleSelectorScreen';"
    )

if "const [hasBypassedSelector, setHasBypassedSelector]" not in app:
    app = app.replace(
        "const [roleOverride, setRoleOverride] = useState<string | null>(null);",
        "const [roleOverride, setRoleOverride] = useState<string | null>(null);\n  const [hasBypassedSelector, setHasBypassedSelector] = useState(false);"
    )

old_dashboard_render = """                ) : (
                  <motion.div 
                    key="active-dashboard" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-screen"
                  >
                    {renderDashboardByRole(userProfile)}
                  </motion.div>
                )}"""

new_dashboard_render = """                ) : (
                  <motion.div 
                    key="active-dashboard" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-screen"
                  >
                    {userProfile && (userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('monica') || userProfile.email?.includes('mgreen')) && !hasBypassedSelector ? (
                      <RoleSelectorScreen 
                        userProfile={userProfile}
                        onSelect={(role) => {
                          setRoleOverride(role === 'executive_founder' ? null : role);
                          setHasBypassedSelector(true);
                        }}
                      />
                    ) : (
                      renderDashboardByRole(userProfile)
                    )}
                  </motion.div>
                )}"""

app = app.replace(old_dashboard_render, new_dashboard_render)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)


# 2. Update FederalDashboard.tsx
with open('src/pages/FederalDashboard.tsx', 'r', encoding='utf-8') as f:
    fed = f.read()

fed = fed.replace('Sylara Federal AI', 'L.A.R.R.Y Federal AI')

with open('src/pages/FederalDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(fed)


# 3. Update FounderDashboard.tsx
with open('src/pages/FounderDashboard.tsx', 'r', encoding='utf-8') as f:
    founder = f.read()

founder = founder.replace('Intake Agent', 'Personal Intelligence Assistant')

with open('src/pages/FounderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(founder)

print('done')
