import os

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/App.tsx', [
    ('''<RoleSelectorScreen 
                        userProfile={userProfile}
                        onSelect={(role) => {
                          setRoleOverride(role === 'executive_founder' ? null : role);
                          setHasBypassedSelector(true);
                        }}
                      />''', 
     '''<RoleSelectorScreen 
                        userProfile={userProfile}
                        onSelect={(role) => {
                          setRoleOverride(role === 'executive_founder' ? null : role);
                          setHasBypassedSelector(true);
                        }}
                        onLogout={handleLogout}
                      />''')
])

print("Added onLogout to RoleSelectorScreen in App.tsx")
