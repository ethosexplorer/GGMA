const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldSubscriptionBlock = `    // Handle Subscription / Pricing Keywords
    if (lower.includes('subscription plan') || lower.includes('view subscription') || lower.includes('state authority plan') || lower.includes('pricing') || lower.includes('basic subscription') || lower.includes('professional subscription') || lower.includes('enterprise subscription')) {
      response = 'dY"< **GGHP Subscription Plans**\\n\\n' +
        '**Patient Plans (B2C):**\\n' +
        '? **Basic**: $49.99/mo (Care Wallet + Telehealth + Basic Sylara)\\n' +
        '? **Medium**: $99/mo (Enhanced Sylara + Priority Support)\\n' +
        '? **Full AI**: $199/mo (Unlimited Sylara + Larry + AI Guardian)\\n\\n' +
        '**Business Plans (Cannabis):**\\n' +
        '? **Starter**: $199/mo (POS + Metrc Sync + Basic Compliance)\\n' +
        '? **Professional**: $249/mo (Multi-Location + Full Larry Enforcement)\\n' +
        '? **Enterprise**: $499/mo (Unlimited Locations + White-Label POS)\\n\\n' +
        '_All tiers include a 30-Day Free Trial. Business & Government plans also receive 30% off their first month after the trial._\\n\\n' +
        'To upgrade or start a trial, please select **Start Intake** below, or visit the main dashboard after logging in.';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'Start Business Intake', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }`;

const newSubscriptionBlock = `    // Handle Subscription / Pricing Keywords
    if (lower.includes('subscription plan') || lower.includes('view subscription') || lower.includes('state authority plan') || lower.includes('pricing') || lower.includes('basic subscription') || lower.includes('professional subscription') || lower.includes('enterprise subscription')) {
      
      let response = '';
      let choices = [];

      if (isBusiness || variant === 'business' || variant === 'sinc') {
        response = 'dY"< **GGHP Business Subscription Plans**\\n\\n' +
          '? **Starter**: $199/mo (POS + Metrc Sync + Basic Compliance)\\n' +
          '? **Professional**: $249/mo (Multi-Location + Full Larry Enforcement)\\n' +
          '? **Enterprise**: $499/mo (Unlimited Locations + White-Label POS)\\n\\n' +
          '_All Business tiers include a 30-Day Free Trial and 30% off your first month after the trial._\\n\\n' +
          'To upgrade or start your trial, please select **Start Business Intake** below.';
        choices = ['Start Business Intake', 'Speak with Business Expert', 'Main Menu'];
      } else if (variant === 'ggma-patient' || variant === 'patient') {
        response = 'dY"< **GGHP Patient Subscription Plans**\\n\\n' +
          '? **Basic**: $49.99/mo (Care Wallet + Telehealth + Basic Sylara)\\n' +
          '? **Medium**: $99/mo (Enhanced Sylara + Priority Support)\\n' +
          '? **Full AI**: $199/mo (Unlimited Sylara + Larry + AI Guardian)\\n\\n' +
          '_All Patient tiers include a 30-Day Free Trial._\\n\\n' +
          'To upgrade or start your trial, please select **Start Patient Intake** below.';
        choices = ['Start Patient Intake', 'Book Physician ($45)', 'Main Menu'];
      } else if (variant === 'provider' || variant === 'legal' || variant === 'attorney' || variant === 'government' || variant === 'political_executive' || variant === 'advocate' || variant === 'advocacy_research') {
        response = 'dY"< **GGHP Professional Suite Subscription Plans**\\n\\n' +
          '? **Professional Network**: $249/mo (Network Integration, Encrypted Communications, AI Support)\\n' +
          '? **Enterprise Operations**: $499/mo (Full Ecosystem Access, Custom Operations)\\n\\n' +
          '_All Professional tiers include a 30-Day Free Trial and 30% off your first month after the trial._\\n\\n' +
          'To upgrade or start your trial, please begin your professional onboarding.';
        choices = ['Main Menu'];
      } else {
        // Fallback for General / GGMA generic portal
        response = 'dY"< **GGHP Subscription Plans**\\n\\n' +
          '**Patient Plans:** Starts at $49.99/mo (Includes Care Wallet & Telehealth)\\n' +
          '**Business Plans:** Starts at $199/mo (Includes POS & Metrc Sync)\\n' +
          '**Professional Plans:** Starts at $249/mo\\n\\n' +
          '_All tiers include a 30-Day Free Trial._\\n\\n' +
          'Please select which intake you would like to start to view specific pricing:';
        choices = ['Start Patient Intake', 'Start Business Intake', 'Main Menu'];
      }

      setMessages(prev => [...prev, { role: 'bot', text: response, choices: choices } as any]);
      setIsTyping(false);
      return;
    }`;

// Use indexOf and substring to safely replace, handling any minor unicode differences
const searchKeyword = "if (lower.includes('subscription plan') || lower.includes('view subscription')";
const startIndex = content.indexOf(searchKeyword);
if (startIndex !== -1) {
  const commentStart = content.lastIndexOf("// Handle Subscription", startIndex);
  const nextSection = content.indexOf("// Handle split fee schedule", startIndex);
  if (commentStart !== -1 && nextSection !== -1) {
    const originalPart = content.substring(commentStart, nextSection);
    content = content.replace(originalPart, newSubscriptionBlock + '\n\n    ');
    fs.writeFileSync(path, content);
    console.log('Successfully updated subscription plan chatbot responses.');
  } else {
    console.log('Failed to find boundaries.');
  }
} else {
  console.log('Keyword not found.');
}
