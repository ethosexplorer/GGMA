const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    if (signupStep === -0.5) {
      if (lower === 'yes' || lower === 'y' || lower.includes('proceed') || lower.includes('understand')) {
        setSignupStep(0);
        response = getGreeting(variant);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getGreetingChoices(variant) } as any]);`;

const replacement = `    if (signupStep === -0.5) {
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
        response = getGreeting(variant);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getGreetingChoices(variant) } as any]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully updated -0.5 routing!');
} else {
  console.log('Could not find target block. Dumping what we found:');
  const idx = content.indexOf('if (signupStep === -0.5) {');
  console.log(content.substring(idx, idx + 300));
}
