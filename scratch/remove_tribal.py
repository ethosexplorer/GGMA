import os
import re

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/pages/FounderDashboard.tsx', [
    ('Native METRC User Guide', 'METRC User Guide')
])

replace_in_file('src/pages/AdminDashboard.tsx', [
    ('Native METRC User Guide', 'METRC User Guide')
])

replace_in_file('src/pages/BusinessRegistrationPage.tsx', [
    ('<option>Tribal ID</option>', ''),
    ('will not be located on tribal lands', 'will not be located on restricted lands')
])

replace_in_file('src/App.tsx', [
    ("'OK Driver\\'s License', 'OK State ID', 'Passport', 'Tribal ID'", "'OK Driver\\'s License', 'OK State ID', 'Passport'"),
    ("Tribal land attest", "Restricted land attest")
])

replace_in_file('src/components/business/BusinessApplicationsTab.tsx', [
    ("Tribal land attest", "Restricted land attest")
])

replace_in_file('src/legalKnowledge.ts', [
    ("tribal governments", "municipal governments")
])

replace_in_file('src/components/federal/JudicialMonitorTab.tsx', [
    ("Oglala Sioux Tribe", "Oglala Sioux"),
    ("tribal sovereign immunity", "sovereign immunity")
])

# Remove native option from CommunityPolls.tsx
with open('src/components/CommunityPolls.tsx', 'r', encoding='utf-8') as f:
    polls = f.read()
polls = re.sub(r"\{\s*id:\s*'native',\s*label:\s*'Native American \/ Indigenous'.*?\},?\s*", "", polls)
with open('src/components/CommunityPolls.tsx', 'w', encoding='utf-8') as f:
    f.write(polls)

# Remove Navajo from i18n
with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    i18n = f.read()
i18n = re.sub(r"// Indigenous / Native\s*\{\s*code:\s*'nv'.*?\},?\s*", "", i18n)
with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(i18n)

print("Replaced all tribal/native references.")
