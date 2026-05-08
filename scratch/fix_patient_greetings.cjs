const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let changes = 0;

// ═══════════════════════════════════════════════════════════════════════
// FIX 1: Update the ggma-patient greeting with 3-step process
// ═══════════════════════════════════════════════════════════════════════
const oldPatientGreeting = `if (variant === 'ggma-patient') return \`👋 Welcome to the **GGMA Sector**. I am **Sylara**, your **Intake Agent**. We are an official **\${metrcStatus}**. I handle all regulatory onboarding, medical card processing, and registry management for patients across all states.\\n\\nHow can I assist with your GGMA licensing today?\`;`;

const newPatientGreeting = `if (variant === 'ggma-patient') return \`👋 Welcome! I am **Sylara** — your **Patient Intake & Support Agent**. Global Green Enterprise Inc is an official **\${metrcStatus}**.\\n\\nHere's how your patient onboarding works:\\n\\n**Step 1:** Create your **FREE GGHP Patient Account** (with options to upgrade later)\\n**Step 2:** Complete your **State MMA Patient Application** (Medical Marijuana Authority card)\\n**Step 3:** Receive your **login credentials** and access your **Patient Dashboard**\\n\\nOnce complete, your file routes to **L.A.R.R.Y** (Compliance Engine) for processing and **Monica Green** (Compliance Director) for human review.\\n\\nHow can I assist you today?\`;`;

if (content.includes(oldPatientGreeting)) {
  content = content.replace(oldPatientGreeting, newPatientGreeting);
  changes++;
  console.log('FIX 1: Updated ggma-patient greeting');
} else {
  console.log('FIX 1: Could not find old ggma-patient greeting');
}

// ═══════════════════════════════════════════════════════════════════════
// FIX 2: Update the ggma (general sector) greeting 
// ═══════════════════════════════════════════════════════════════════════
const oldGGMAGreeting = `if (variant === 'ggma') return \`👋 Welcome to the **GGMA Sector**. I am **Sylara**, your **Intake Agent**. We are an official **\${metrcStatus}**. I handle all regulatory onboarding, card processing, and registry management. \\n\\nHow can I assist with your GGMA licensing today?\`;`;

const newGGMAGreeting = `if (variant === 'ggma') return \`👋 Welcome! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is an official **\${metrcStatus}**.\\n\\nHere's how the onboarding process works:\\n\\n**Step 1:** Create your **FREE GGHP Account** (with options to upgrade later)\\n**Step 2:** Complete your **State MMA Application** (Medical Marijuana Authority license/card)\\n**Step 3:** Receive your **login credentials** and access your **Dashboard**\\n\\nOnce complete, your file routes to **L.A.R.R.Y** (Compliance Engine) for processing and **Monica Green** (Compliance Director) for human review.\\n\\nHow can I assist you today?\`;`;

if (content.includes(oldGGMAGreeting)) {
  content = content.replace(oldGGMAGreeting, newGGMAGreeting);
  changes++;
  console.log('FIX 2: Updated ggma greeting');
} else {
  console.log('FIX 2: Could not find old ggma greeting');
}

// ═══════════════════════════════════════════════════════════════════════
// FIX 3: Update default patient greeting (the long one with 30-Day Free Trial)
// ═══════════════════════════════════════════════════════════════════════
const oldDefaultGreeting = `return \`👋 Hello! I am **Sylara**, your **AI Healthcare Assistant** and **State Concierge**. Welcome to the Global Green Ecosystem! 🌿\\n\\nAs a member (currently enjoying your 30-Day Free Trial of the B2C Basic Plan), you have unlocked priority state processing, our encrypted Document Vault, and direct access to our Telehealth and Legal networks. My job is to make your medical card journey completely seamless and 100% compliant.\\n\\nEvery application step you complete with me is safely stored in your Vault. Even if you can't finish right now, we can pull it back up and continue right where you left off.\\n\\n**After this intake session, your file routes to:**\\n• **Business & Compliance** → L.A.R.R.Y (Operations) + Monica Green (Review)\\n• **Legal matters** → Sylara (Legal AI) + Shantell Robinson (Review)\\n\\nAre you ready to start your medical card application today? Do you have all your necessary documents ready?\\n*(Note: You can continue without them, but your application cannot be submitted to the state until all documents are uploaded.)*\`;`;

const newDefaultGreeting = `return \`👋 Hello! I am **Sylara** — your **AI Healthcare Assistant & State Concierge**. Welcome to the Global Green Ecosystem! 🌿\\n\\nHere's how your onboarding works:\\n\\n**Step 1:** Create your **FREE GGHP Account** (includes 30-Day Free Trial with priority state processing, encrypted Document Vault, and Telehealth access)\\n**Step 2:** Complete your **State MMA Application** (Medical Marijuana Authority card/license)\\n**Step 3:** Receive your **login credentials** and access your **Dashboard**\\n\\nEvery step you complete is safely stored in your Vault. Even if you can't finish now, we'll pick up right where you left off.\\n\\n**After intake, your file routes to:**\\n• **Compliance** → L.A.R.R.Y (Operations) + Monica Green (Review)\\n• **Legal** → Sylara (Legal AI) + Shantell Robinson (Review)\\n\\nReady to get started?\`;`;

if (content.includes(oldDefaultGreeting)) {
  content = content.replace(oldDefaultGreeting, newDefaultGreeting);
  changes++;
  console.log('FIX 3: Updated default patient greeting');
} else {
  console.log('FIX 3: Could not find default patient greeting');
}

if (changes > 0) {
  fs.writeFileSync('src/App.tsx', content);
  console.log(`\nDone! ${changes} greetings updated.`);
} else {
  console.log('\nNo changes made.');
}
