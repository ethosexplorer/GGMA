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
    ("role === 'enforcement_state' || role?.startsWith('enforcement')", "role === 'enforcement_state' || role?.startsWith('enforcement') || role === 'law_enforcement'"),
    ("role === 'health' || role === 'lab'", "role === 'health' || role === 'lab' || role === 'health_lab'")
])

print("Updated router conditions.")
