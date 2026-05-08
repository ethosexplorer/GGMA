const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const old990 = `    else if (signupStep === 990) {
      setBusinessData(prev => ({ ...prev, registrationType: text }));
      const sectionHeader = text.toLowerCase().includes('renewal') ? 'License Renewal Registration' : 'First-Time Registration';
      const response = \`Got it. Let's proceed with your **\${text}**.\\n\\n**Section 1: \${sectionHeader}**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.\`;
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setSignupStep(100);
      setIsTyping(false);
      return;
    }`;

const new990 = `    else if (signupStep === 990) {
      setBusinessData(prev => ({ ...prev, registrationType: text }));

      if (lower.includes('state mma') || lower.includes('renewal')) {
        // State MMA path — requires GGHP account first
        const response = '📋 **State MMA Application (New or Renewal)**\\n\\nTo file a State Medical Marijuana Authority application — whether it\\'s a brand-new license or a renewal — you\\'ll first need a **free GGHP Business Account**. This account stores your credentials, tracks your application, and syncs directly with state regulatory systems.\\n\\n**Let\\'s set up your GGHP account now, and once verified, your State MMA application will be auto-generated from your profile.**\\n\\nWhat is your **Full Name** (First & Last)?';
        setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
        setSignupStep(100);
        setIsTyping(false);
        return;
      } else {
        // New GGHP Registration path
        const response = '✅ **New GGHP Business Registration**\\n\\nGreat — let\\'s create your **free Global Green Hybrid Platform (GGHP) Business Account**. This account gives you access to compliance tools, document vaults, and the ability to file State MMA applications when you\\'re ready.\\n\\n**Section 1: Account Setup**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
        setSignupStep(100);
        setIsTyping(false);
        return;
      }
    }`;

if (content.includes(old990)) {
  content = content.replace(old990, new990);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully updated step 990!');
} else {
  console.log('Could not find old990 block');
  const idx = content.indexOf('else if (signupStep === 990)');
  console.log(content.substring(idx, idx + 500));
}
