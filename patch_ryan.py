import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all instances of ryanj.ferrari@icloud.com
content = content.replace('ryanj.ferrari@icloud.com', 'ceo.globalgreenhp@gmail.com')

# Replace lowerEmail.includes('ryanj.ferrari') and similar
content = content.replace("lowerEmail.includes('ryanj.ferrari')", "lowerEmail.includes('ceo.globalgreenhp')")

# For displayName generation where it checks 'ferrari'
content = content.replace("lowerEmail.includes('ferrari') ? 'Ryan Ferrari'", "lowerEmail.includes('ceo.globalgreenhp') ? 'Ryan Ferrari'")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
