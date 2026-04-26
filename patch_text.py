import re

# App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

app = app.replace('live agent Robinson', 'Live Agent Robinson')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

# FounderDashboard.tsx
with open('src/pages/FounderDashboard.tsx', 'r', encoding='utf-8') as f:
    founder = f.read()

founder = founder.replace('QuickBooks Core', 'GGP Core')
founder = founder.replace('Regulatory/Authority', 'State Regulatory/Authority')
founder = founder.replace('Founder & System Architect', 'Quality Assurance')
founder = founder.replace('Founder Exclusive:', 'Quality Assurance:')

with open('src/pages/FounderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(founder)

print('done')
