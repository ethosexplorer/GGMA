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
    (" || userProfile.email?.includes('ryan')", "")
])

replace_in_file('src/pages/FounderDashboard.tsx', [
    ("const isRyan = emailLower.includes('ryanj.ferrari') || emailLower.includes('ferrari') || displayNameLower.includes('ryan');", "const isRyan = emailLower.includes('ceo.globalgreenhp');")
])

replace_in_file('src/components/RoleSelectorScreen.tsx', [
    ("const isRyan = userProfile?.email?.toLowerCase().includes('ryan') || userProfile?.displayName?.toLowerCase().includes('ryan');", "const isRyan = userProfile?.email?.toLowerCase().includes('ceo.globalgreenhp');")
])

print("Updated Ryan's email logic to strictly use ceo.globalgreenhp@gmail.com")
