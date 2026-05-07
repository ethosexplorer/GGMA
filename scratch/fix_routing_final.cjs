const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldMinus1 = `    if (signupStep === -1) {
      if (lower === 'english' || lower === 'español' || lower.includes('português') || lower.includes('français') || lower.includes('kreyòl') || lower.includes('中文')) {
        if (variant === 'rip') {
          response = '🕵️ **RIP Intelligence Portal**\\n\\nBefore we can proceed with intelligence retrieval, please specify which **Law Enforcement** or **Oversight Agency** you are representing:';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['State Police (OSBI)', 'Federal Enforcement (DEA/FBI)', 'State Regulator (OMMA)', 'Local Law Enforcement'] } as any]);
          setSignupStep(900);
          setIsTyping(false);
          return;
        }

        if (variant === 'sinc') {
          response = '🛡️ **SINC Compliance Infrastructure**\\n\\nSINC handles encrypted audit trails and seed-to-sale architecture for commercial entities. Are you representing an active **Cannabis Business**, or are you looking for general information on becoming a licensed business?';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Active Cannabis Business', 'Learn About Licensing', 'Main Menu'] } as any]);
          setSignupStep(901);
          setIsTyping(false);
          return;
        }

        if (variant === 'ggma' || variant === 'ggma-patient') {
          response = 'Welcome to the **GGMA Sector**.\\n\\nTo ensure we provide the correct licensing and medical card information, please select which **State Jurisdiction** you are inquiring about:';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Oklahoma', 'Kentucky', 'Missouri', 'Texas', 'Other State'] } as any]);
          setSignupStep(902);
          setIsTyping(false);
          return;
        }

        setSignupStep(-0.5);
        const response = getBriefSummary(variant) + '\\n\\n**Do you understand and would you like to proceed?** (Yes/No)';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }
    }`;

const newMinus1 = `    if (signupStep === -1) {
      if (lower === 'english' || lower === 'español' || lower.includes('português') || lower.includes('français') || lower.includes('kreyòl') || lower.includes('中文')) {
        setSignupStep(-0.5);
        const response = getBriefSummary(variant) + '\\n\\n**Do you understand and would you like to proceed?** (Yes/No)';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }
    }`;

const oldMinus05 = `    if (signupStep === -0.5) {
      if (lower === 'yes' || lower === 'y' || lower.includes('proceed') || lower.includes('understand')) {
        setSignupStep(0);
        const response = getGreeting();
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getInitialChoices() } as any]);
      } else if (lower === 'no' || lower === 'n' || lower.includes('back')) {`;

const newMinus05 = `    if (signupStep === -0.5) {
      if (lower === 'yes' || lower === 'y' || lower.includes('proceed') || lower.includes('understand')) {
        if (variant === 'rip') {
          response = '🕵️ **RIP Intelligence Portal**\\n\\nBefore we can proceed with intelligence retrieval, please specify which **Law Enforcement** or **Oversight Agency** you are representing:';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['State Police (OSBI)', 'Federal Enforcement (DEA/FBI)', 'State Regulator (OMMA)', 'Local Law Enforcement'] } as any]);
          setSignupStep(900);
          setIsTyping(false);
          return;
        }
        if (variant === 'sinc') {
          response = '🛡️ **SINC Compliance Infrastructure**\\n\\nSINC handles encrypted audit trails and seed-to-sale architecture for commercial entities. Are you representing an active **Cannabis Business**, or are you looking for general information on becoming a licensed business?';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Active Cannabis Business', 'Learn About Licensing', 'Main Menu'] } as any]);
          setSignupStep(901);
          setIsTyping(false);
          return;
        }
        if (variant === 'ggma' || variant === 'ggma-patient') {
          response = 'Welcome to the **GGMA Sector**.\\n\\nTo ensure we provide the correct licensing and medical card information, please select which **State Jurisdiction** you are inquiring about:';
          setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Oklahoma', 'Kentucky', 'Missouri', 'Texas', 'Other State'] } as any]);
          setSignupStep(902);
          setIsTyping(false);
          return;
        }

        setSignupStep(0);
        const responseStr = getGreeting();
        setMessages(prev => [...prev, { role: 'bot', text: responseStr, choices: getInitialChoices() } as any]);
      } else if (lower === 'no' || lower === 'n' || lower.includes('back')) {`;

// Safety fallback using indexOf if exact string replace fails
let replaced = false;

if (content.includes(oldMinus1)) {
  content = content.replace(oldMinus1, newMinus1);
  replaced = true;
} else {
  console.log("Could not find exact oldMinus1");
}

if (content.includes(oldMinus05)) {
  content = content.replace(oldMinus05, newMinus05);
  replaced = true;
} else {
  console.log("Could not find exact oldMinus05");
}

if (replaced) {
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully fixed routing!');
}
