const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetLine = "      } else if (lower.includes('reschedule') || lower.includes('return later')) {";

const replacementBlock = `      } else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        const response = 'dY? Let\\'s begin your **Commercial License Application**.\\n\\n**Section 1: First-Time Registration**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
        setSignupStep(100);
        setIsTyping(false);
        return;
      } else if (lower.includes('reschedule') || lower.includes('return later')) {`;

if (content.includes(targetLine)) {
  content = content.replace(targetLine, replacementBlock);
  fs.writeFileSync(path, content);
  console.log('Successfully injected start business intake interceptor in signupStep 0');
} else {
  console.log('Failed to find target line');
}
