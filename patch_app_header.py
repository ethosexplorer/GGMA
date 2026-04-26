import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if "import { GlobalHeader" not in content:
    content = content.replace(
        "import { SylaraFloatingWidget } from './components/SylaraFloatingWidget';",
        "import { SylaraFloatingWidget } from './components/SylaraFloatingWidget';\nimport { GlobalHeader } from './components/GlobalHeader';"
    )

# Add jurisdiction state
if "const [jurisdiction, setJurisdiction] = useState" not in content:
    content = content.replace(
        "const [roleOverride, setRoleOverride] = useState<string | null>(null);",
        "const [roleOverride, setRoleOverride] = useState<string | null>(null);\n  const [jurisdiction, setJurisdiction] = useState('Oklahoma');"
    )

# Inject GlobalHeader inside the main render block
# Let's put it right after `<div className="flex flex-col h-screen overflow-hidden bg-slate-100">` or similar
# App.tsx returns `<div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans">`
content = content.replace(
    '<div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans">',
    '<div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans pt-12">\n      <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} roleOverride={roleOverride} setRoleOverride={setRoleOverride} />'
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
