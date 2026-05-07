const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      } else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\n**Section 1: First-Time Registration**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setSignupStep(100);
      } else if (lower.includes('patient')) {`;

const replace = `      } else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);
        setSignupStep(990);
        setIsTyping(false);
        return;
      } else if (lower.includes('patient')) {`;

if (content.includes(target)) {
  fs.writeFileSync('src/App.tsx', content.replace(target, replace));
  console.log('Successfully replaced second block.');
} else {
  console.log('Target not found!');
  
  // Let's try splitting the lines and modifying
  let lines = content.split('\\n');
  let replaced = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('start business intake') && lines[i+2] && lines[i+2].includes('What is your **Full Name**')) {
       lines[i+2] = "        response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';";
       lines[i+3] = "        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);";
       lines.splice(i+4, 0, "        setSignupStep(990);\\n        setIsTyping(false);\\n        return;");
       replaced = true;
       break;
    }
  }
  if (replaced) {
    fs.writeFileSync('src/App.tsx', lines.join('\\n'));
    console.log('Successfully replaced second block via array splice.');
  }
}
