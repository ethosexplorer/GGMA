import os

path = 'src/pages/BusinessDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace inline navigation calls with navigateTab
replacements = [
    ("onClick={() => setActiveTab('locations')", "onClick={() => navigateTab('locations')"),
    ("onClick={() => setActiveTab('compliance')", "onClick={() => navigateTab('compliance')"),
    ("onClick={() => setActiveTab('insurance')", "onClick={() => navigateTab('insurance')"),
    ("onClick={() => { setDemoUnlocked(true); setActiveTab('subscription'); }}", "onClick={() => { setDemoUnlocked(true); navigateTab('subscription'); }}"),
    ("!isCompliant && setActiveTab('compliance')", "!isCompliant && navigateTab('compliance')"),
]

for old, new in replacements:
    if old in c:
        c = c.replace(old, new)
        print(f"  Replaced: {old[:60]}...")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("OK - inline navigation updated")
