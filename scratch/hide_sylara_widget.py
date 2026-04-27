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

old_sylara_widget = """        {/* Persistent Sylara Support everywhere */}
        {view !== 'larry-chatbot' && (
          <SylaraFloatingWidget onClick={() => setShowLarryModal(true)} />
        )}"""

new_sylara_widget = """        {/* Persistent Sylara Support everywhere */}
        {view !== 'larry-chatbot' && (!userProfile || !['business', 'compliance_service'].includes(roleOverride || userProfile.role)) && (
          <SylaraFloatingWidget onClick={() => setShowLarryModal(true)} />
        )}"""

replace_in_file('src/App.tsx', [
    (old_sylara_widget, new_sylara_widget)
])

print("Removed Sylara Widget from Business Dashboard.")
