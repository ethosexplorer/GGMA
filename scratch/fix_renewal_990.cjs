const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target990 = `    else if (signupStep === 990) {
      setBusinessData(prev => ({ ...prev, registrationType: text }));
      const response = \`Got it. Let's proceed with your **\${text}**.\\n\\n**Section 1: First-Time Registration**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.\`;
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setSignupStep(100);
      setIsTyping(false);
      return;
    }`;

const new990 = `    else if (signupStep === 990) {
      setBusinessData(prev => ({ ...prev, registrationType: text }));
      const sectionHeader = text.toLowerCase().includes('renewal') ? 'License Renewal Registration' : 'First-Time Registration';
      const response = \`Got it. Let's proceed with your **\${text}**.\\n\\n**Section 1: \${sectionHeader}**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.\`;
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setSignupStep(100);
      setIsTyping(false);
      return;
    }`;

if (content.includes(target990)) {
  content = content.replace(target990, new990);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully updated 990 renewal handling!');
} else {
  console.log('Could not find target990 block.');
}
