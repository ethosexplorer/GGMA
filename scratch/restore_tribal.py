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
    ("'OK Driver\\'s License', 'OK State ID', 'Passport'", "'OK Driver\\'s License', 'OK State ID', 'Passport', 'Tribal ID'"),
    ("Restricted land attest", "Tribal land attest"),
    ("userProfile.email?.includes('mgreen') || userProfile.email?.includes('globalgreenhp@gmail.com'))", "userProfile.email?.includes('mgreen') || userProfile.email?.includes('globalgreenhp@gmail.com') || userProfile.email?.includes('ryan'))")
])

replace_in_file('src/components/business/BusinessApplicationsTab.tsx', [
    ("Restricted land attest", "Tribal land attest")
])

replace_in_file('src/pages/BusinessRegistrationPage.tsx', [
    ("<option>Passport</option>", "<option>Passport</option><option>Tribal ID</option>"),
    ("will not be located on restricted lands", "will not be located on tribal lands")
])

print("Restored Tribal references and added Ryan to the router whitelist.")
