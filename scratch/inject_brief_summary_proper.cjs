const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Inject Helper Function `getBriefSummary` right before `const getGreeting`
const helperFunc = `
  const getBriefSummary = (v: string) => {
    switch (v) {
      case 'ggma-patient':
      case 'patient':
      case 'ggma':
        return 'You have selected the **Patient Intake** sector. This process helps individuals register for their state-approved medical cannabis cards, verify eligibility, and book telehealth appointments seamlessly.';
      case 'sinc':
      case 'business':
        return 'You have selected the **Business Intake** sector. This process helps commercial entities establish their regulatory profile, apply for state-approved commercial licenses, and access compliance tools.';
      case 'provider':
        return 'You have selected the **Provider Intake** sector. This path is for physicians and clinicians looking to join our verified telehealth network and register with the state board.';
      case 'rip':
      case 'law-enforcement':
        return 'You have selected the **Regulatory/Law Enforcement** portal. This is a restricted gateway for state inspectors, regulators, and enforcement agencies to verify compliance and run reports.';
      case 'legal':
      case 'attorney':
        return 'You have selected the **Legal Representation** sector. This connects you with attorneys for compliance defense, corporate counsel, or patient advocacy matters.';
      case 'government':
      case 'political_executive':
        return 'You have selected the **Government Office** sector. This portal provides municipalities and elected officials with economic impact data and regulatory policy tools.';
      case 'advocate':
      case 'advocacy_research':
        return 'You have selected the **Advocacy & Non-Profit** sector. This portal connects social equity applicants and researchers with community polling and resources.';
      default:
        return 'You have selected a specialized intake sector. Let\\'s proceed to set up your profile.';
    }
  };
`;
if (!content.includes('const getBriefSummary = (v: string) => {')) {
  content = content.replace('const getGreeting = () => {', helperFunc + '\n  const getGreeting = () => {');
}

// 2. Change language click to go to -0.5 instead of 0
// We need to replace the fallback at the end of the `if (signupStep === -1)` block
const targetFallback = `        setMessages(prev => [...prev, { role: 'bot', text: getGreeting(), choices: getInitialChoices() } as any]);
        setSignupStep(0);
        setIsTyping(false);
        return;`;

const newFallback = `        setSignupStep(-0.5);
        const response = getBriefSummary(variant) + '\\n\\n**Do you understand and would you like to proceed?** (Yes/No)';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;`;

if (content.includes(targetFallback)) {
  content = content.replace(targetFallback, newFallback);
}

// 3. Step -0.5
const stepMinus05 = `    if (signupStep === -0.5) {
      if (lower === 'yes' || lower === 'y' || lower.includes('proceed') || lower.includes('understand')) {
        setSignupStep(0);
        const response = getGreeting();
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getInitialChoices() } as any]);
      } else if (lower === 'no' || lower === 'n' || lower.includes('back')) {
        const response = 'No problem! Let\\'s return to the main selection. How can I assist you today?';
        setSignupStep(-1);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Patient', 'Business', 'Provider', 'Legal', 'Government', 'Advocacy'] } as any]);
      } else {
        const response = getBriefSummary(variant) + '\\n\\n**Do you understand and would you like to proceed?** (Yes/No)';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
      }
      setIsTyping(false);
      return;
    }

    if (signupStep === 0) {`;

if (!content.includes('if (signupStep === -0.5) {')) {
  content = content.replace('    if (signupStep === 0) {', stepMinus05);
}

// Ensure the FREE account logic is in the business greeting
const targetBizGreeting = `if (isBusiness) return \`👋 Hello! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is now a **\${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and handle your initial onboarding. Once we complete intake, your file routes to **L.A.R.R.Y** (Compliance Engine) for operational processing, and **Monica Green** (Compliance Director) for human review. \\n\\nHow can I assist your business today?\`;`;

const newBizGreeting = `if (isBusiness) return \`👋 Hello! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is now a **\${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and handle your initial onboarding. *(You will be creating a **FREE account** today, with options to upgrade to premium tiers later)*. Once we complete intake, your file routes to **L.A.R.R.Y** (Compliance Engine) for operational processing, and **Monica Green** (Compliance Director) for human review. \\n\\nHow can I assist your business today?\`;`;

if (content.includes(targetBizGreeting)) {
  content = content.replace(targetBizGreeting, newBizGreeting);
}

fs.writeFileSync('src/App.tsx', content);
console.log('Successfully injected brief summary logic!');
