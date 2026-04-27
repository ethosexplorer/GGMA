import os

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
        else:
            print(f"  WARN not found: {old[:90]}...")
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  OK: {path}")


# ============================================================
# 1) APP.TSX — Restore Sylara as the floating intake widget  
#    (she greets everyone, not L.A.R.R.Y)
# ============================================================
print("\n[1] Restoring Sylara as the floating intake widget...")

replace_in_file('src/App.tsx', [
    # Rename widget back to Sylara
    ("const LarryFloatingWidget = ({ onClick }: { onClick: () => void }) => (",
     "const SylaraFloatingWidget = ({ onClick }: { onClick: () => void }) => ("),
    ('alt="L.A.R.R.Y"', 'alt="Sylara"'),
    ('<div className="text-sm font-bold leading-tight">L.A.R.R.Y Compliance AI</div>',
     '<div className="text-sm font-bold leading-tight">Sylara Intake Agent</div>'),
    ('<div className="text-[11px] text-white/80">Intake & Compliance Engine</div>',
     '<div className="text-[11px] text-white/80">Onboarding & Support</div>'),
    ("<LarryFloatingWidget onClick={() => setShowLarryModal(true)} />",
     "<SylaraFloatingWidget onClick={() => setShowLarryModal(true)} />"),
    
    # Sylara widget shows everywhere EXCEPT business, compliance, authority, enforcement
    # (those portals have L.A.R.R.Y embedded directly)
    ("        {/* Persistent L.A.R.R.Y Support \u2014 hidden from business, compliance, and attorney roles */}\n        {view !== 'larry-chatbot' && (!userProfile || !['business', 'compliance_service', 'attorney'].includes(roleOverride || userProfile.role)) && (",
     "        {/* Sylara Intake Agent \u2014 visible everywhere except business/compliance/authority/enforcement (L.A.R.R.Y handles those) */}\n        {view !== 'larry-chatbot' && (!userProfile || !['business', 'compliance_service', 'regulator_state', 'regulator_federal', 'law_enforcement', 'enforcement_state'].includes(roleOverride || userProfile.role)) && ("),
])


# ============================================================
# 2) APP.TSX — Fix chatbot persona label (sylara persona = Sylara)
# ============================================================
print("\n[2] Fixing persona label back to Sylara...")

replace_in_file('src/App.tsx', [
    # When persona is 'sylara', show her name, not L.A.R.R.Y
    ("'L.A.R.R.Y Compliance AI'", "'Sylara Intake Agent'"),
    # Bottom status label
    ('<span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block -mt-1">L.A.R.R.Y Compliance AI</span>',
     '<span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block -mt-1">Sylara Intake Agent</span>'),
])


# ============================================================
# 3) APP.TSX — Restore Sylara in ALL chatbot greetings
#    Sylara handles initial intake for everyone, then routes:
#      - Business/Compliance -> L.A.R.R.Y for operations, Monica for human review
#      - Legal -> Sylara stays on (she IS the legal AI), Shantell for human review  
#      - Authority/Enforcement -> L.A.R.R.Y takes over
# ============================================================
print("\n[3] Restoring Sylara in chatbot greetings with proper handoff routing...")

replace_in_file('src/App.tsx', [
    # GGMA greeting: Sylara does intake
    ("if (variant === 'ggma') return `\U0001f44b Welcome to the **GGMA Sector**. I am **L.A.R.R.Y**, your **Compliance Agent**.",
     "if (variant === 'ggma') return `\U0001f44b Welcome to the **GGMA Sector**. I am **Sylara**, your **Intake Agent**."),
    
    # RIP greeting: Sylara does initial intake, routes to L.A.R.R.Y
    ("if (variant === 'rip') return `\U0001f575\ufe0f **RIP Intelligence Portal**. I am **L.A.R.R.Y**, coordinating the **Enforcement Engine**.",
     "if (variant === 'rip') return `\U0001f575\ufe0f **RIP Intelligence Portal**. I am **Sylara**, coordinating with the **L.A.R.R.Y Enforcement Engine**."),
    
    # SINC greeting: Sylara does initial intake
    ("if (variant === 'sinc') return `\U0001f6e1\ufe0f **SINC Compliance Infrastructure**. I am **L.A.R.R.Y**, managing your secure operational backbone.",
     "if (variant === 'sinc') return `\U0001f6e1\ufe0f **SINC Compliance Infrastructure**. I am **Sylara**, managing your secure operational backbone."),
    
    # Business greeting: Sylara does intake, routes to L.A.R.R.Y for operations
    ("if (isBusiness) return `\U0001f44b Hello! I am **L.A.R.R.Y** \u2014 your **Compliance & Intake Agent**. Global Green Enterprise Inc is now a **${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and resolve any operational hurdles. Once we complete this initial intake, your file will be handed off to **Monica Green (Compliance Director)** for processing.",
     "if (isBusiness) return `\U0001f44b Hello! I am **Sylara** \u2014 your **Intake & Support Agent**. Global Green Enterprise Inc is now a **${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and handle your initial onboarding. Once we complete intake, your file routes to **L.A.R.R.Y** (Compliance Engine) for operational processing, and **Monica Green** (Compliance Director) for human review."),
    
    # General concierge greeting: Sylara greets, shows routing
    ("if (isGeneral) return `\U0001f44b Welcome to the **Global Green Hybrid Platform (GGHP)** Concierge. I am **L.A.R.R.Y**, your Compliance Agent.",
     "if (isGeneral) return `\U0001f44b Welcome to the **Global Green Hybrid Platform (GGHP)** Concierge. I am **Sylara**, your Intake Agent."),
    # Fix the routing info in general greeting
    ("I handle:\\n\u2022 **Intake & Onboarding** (GGMA)\\n\u2022 **Operational Support**\\n\u2022 **Escalations & Alerts**\\n\u2022 **Intake Contacts:** Legal \u2192 Shantell Robinson | Business & Compliance \u2192 Monica Green",
     "I handle all initial intake & onboarding across the ecosystem.\\n\\n**After intake, your file routes to:**\\n\u2022 **Business & Compliance** \u2192 L.A.R.R.Y (Operations) + Monica Green (Human Review)\\n\u2022 **Legal matters** \u2192 Sylara (Legal AI) + Shantell Robinson (Human Review)\\n\u2022 **Authority & Enforcement** \u2192 L.A.R.R.Y Enforcement Engine"),
    
    # Default patient greeting: Sylara does intake
    ("return `\U0001f44b Hello! I am **L.A.R.R.Y**, your **AI Healthcare Assistant** and **State Concierge**.",
     "return `\U0001f44b Hello! I am **Sylara**, your **AI Healthcare Assistant** and **State Concierge**."),
    # Fix handoff section
    ("**After this intake session, your file will be assigned to:**\\n\u2022 **Legal matters** \u2192 Shantell Robinson\\n\u2022 **Business & Compliance** \u2192 Monica Green\\n\\nAre you ready",
     "**After this intake session, your file routes to:**\\n\u2022 **Business & Compliance** \u2192 L.A.R.R.Y (Operations) + Monica Green (Review)\\n\u2022 **Legal matters** \u2192 Sylara (Legal AI) + Shantell Robinson (Review)\\n\\nAre you ready"),
])


# ============================================================
# 4) GEMINI.TS — Restore Sylara for intake roles, keep L.A.R.R.Y 
#    for compliance/enforcement roles
# ============================================================
print("\n[4] Fixing gemini.ts AI persona split...")

replace_in_file('src/lib/gemini.ts', [
    # General: Sylara does intake, not L.A.R.R.Y
    ("'You are L.A.R.R.Y, an advanced AI Compliance & Intake Agent for the Global Green Hybrid Platform (GGHP).",
     "'You are Sylara, an advanced AI Intake Agent for the Global Green Hybrid Platform (GGHP)."),
    # GGMA: Sylara does intake
    ("'You are L.A.R.R.Y, the GGMA Sector Compliance Agent.",
     "'You are Sylara, the GGMA Sector Intake Agent."),
    # Business: L.A.R.R.Y stays (he handles business compliance operations)
    # This one is correct already - L.A.R.R.Y handles business compliance
    # RIP: Sylara does intake, interfaces with L.A.R.R.Y
    # already correct - "You are Sylara, the intake coordinator for the RIP portal"
    # SINC: Sylara does intake
    # already correct - "You are Sylara, managing the SINC Compliance Infrastructure"
])


# ============================================================
# 5) ATTORNEY DASHBOARD — Restore Sylara (she handles legal)
# ============================================================
print("\n[5] Restoring Sylara in AttorneyDashboard (she handles legal)...")

replace_in_file('src/pages/AttorneyDashboard.tsx', [
    ("L.A.R.R.Y Legal Triage",
     "Sylara & L.A.R.R.Y Legal Triage"),
    ('"Alex, I have pre-processed a Florida licensing dispute.',
     '"Alex, Sylara and I have pre-processed a Florida licensing dispute.'),
])


print("\nDone - Sylara/L.A.R.R.Y role split applied correctly.")
