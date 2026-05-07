const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("else if (lower.includes('start business intake')) {")) {
     if (lines[i+2] && lines[i+2].includes('What is your **Full Name**')) {
       // We found it!
       lines[i+2] = "        const response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';";
       lines[i+3] = "        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);";
       lines.splice(i+4, 0, "        setSignupStep(990);");
       lines.splice(i+5, 0, "        setIsTyping(false);");
       lines.splice(i+6, 0, "        return;");
     }
  }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed ALL instances!');
