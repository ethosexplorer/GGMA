import os
import re

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            # Try regex if literal fails
            content = re.sub(re.escape(old), new, content)
            
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/App.tsx', [
    ("role === 'executive_founder' || role === 'executive_ceo'", "role === 'executive_founder' || role === 'executive_ceo' || role === 'executive_monica'")
])

print("Updated App.tsx routing for Monica.")
