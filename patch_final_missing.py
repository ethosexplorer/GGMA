import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Inject GlobalHeader just below <div className="antialiased text-slate-900">
# The index of this line is around 7669
for i, line in enumerate(lines):
    if 'className="antialiased text-slate-900"' in line and '<GlobalHeader' not in lines[i+1]:
        lines.insert(i+1, '        <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0} />\n')
        break

# 2. Inject RoleSelectorScreen into the Active Dashboard render
# Find the line: {renderDashboardByRole(userProfile)} inside the active-dashboard motion.div
# It's right after <motion.div key="active-dashboard" ... className="min-h-screen">
active_dash_start = -1
for i, line in enumerate(lines):
    if 'key="active-dashboard"' in line:
        active_dash_start = i
        break

if active_dash_start != -1:
    for i in range(active_dash_start, active_dash_start + 15):
        if '{renderDashboardByRole(userProfile)}' in lines[i] and 'RoleSelectorScreen' not in lines[i-5]:
            lines[i] = """                  {userProfile && (userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('monica') || userProfile.email?.includes('mgreen') || userProfile.email?.includes('globalgreenhp@gmail.com')) && !hasBypassedSelector ? (
                    <RoleSelectorScreen 
                      userProfile={userProfile}
                      onSelect={(role) => {
                        setRoleOverride(role === 'executive_founder' ? null : role);
                        setHasBypassedSelector(true);
                      }}
                    />
                  ) : (
                    renderDashboardByRole(userProfile)
                  )}\n"""
            break

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('done')
