import re

with open('src/components/GlobalHeader.tsx', 'r', encoding='utf-8') as f:
    header = f.read()

# Fix God Mode to only be on Founder Dashboard OR only for specific founder email
# Let's change the condition so it only shows if the CURRENT ROLE is executive_founder
# This means if they switch to Patient Portal, the God Mode widget disappears (they can use the back button or logout to return)
# WAIT! If the God Mode widget disappears, the only way to switch back is to use the "Back" button or "Logout"!
# But if it's "supposed to be on mine", they probably mean it shouldn't show up when they are simulating another role!
# "Quality assurance mode on every dashboard and it is only suppose to be on mine haha"
# Yes! It shouldn't appear on the Patient dashboard when they are simulating it. It should ONLY appear on the Founder dashboard.
# So I'll change:
# `isGodModeEligible = ...` to `isGodModeEligible = userProfile.role === 'executive_founder' && !roleOverride;`

if "&& !roleOverride" not in header:
    header = header.replace(
        "const isGodModeEligible = userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('mgreen') || userProfile.email?.includes('monica') || userProfile.email?.includes('globalgreenhp@gmail.com');",
        "const isGodModeEligible = (userProfile.email?.includes('globalgreenhp@gmail.com') || userProfile.email?.includes('mgreen')) && !roleOverride;"
    )

with open('src/components/GlobalHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(header)

print('done')
