const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const old = `'🏢 Let\\'s begin your **Commercial License Application**.\\n\\nPlease select your registration type below:';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration (GGHP)', 'New / Renewal (State MMA Application)'] } as any]);
        setSignupStep(990);`;

const replacement = `'🏢 Let\\'s begin your **Commercial License Application**.\\n\\n**Section 1: Account Setup**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
        setSignupStep(100);`;

let count = 0;
while (content.includes(old)) {
  content = content.replace(old, replacement);
  count++;
}

if (count > 0) {
  fs.writeFileSync('src/App.tsx', content);
  console.log(`Replaced ${count} occurrences. Now goes straight to Section 1.`);
} else {
  console.log('Could not find target. Dumping search...');
  const idx = content.indexOf('start business intake');
  console.log(content.substring(idx, idx + 400));
}
