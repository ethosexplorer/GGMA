const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace corrupted emoji and the full name prompt with the New/Renewal prompt
// We will look for instances of `lower.includes('start business intake')` and rewrite them manually in the script.

content = content.replace(/else if \(lower\.includes\('start business intake'\)\) \{[\s\S]*?setSignupStep\(\d+\);[\s\S]*?\}/g, (match) => {
  // We want to replace everything inside with the new logic, but be careful not to consume too much.
  // Actually, let's just use substring replacement on the exact blocks by getting their indices.
  return `else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        const response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);
        setSignupStep(990);
        setIsTyping(false);
        return;
      }`;
});

// Since the regex above might match the `setIsTyping(false); return;` of the previous block, we need a safer regex.
content = fs.readFileSync('src/App.tsx', 'utf8');

let newContent = content;

// Safely replace the first instance
const regex1 = /else if \(lower\.includes\('start business intake'\)\) \{\s*setIsBusiness\(true\);\s*const response = 'dY\? Let\\'s begin your.*?setSignupStep\(\d+\);\s*setIsTyping\(false\);\s*return;\s*\}/s;
newContent = newContent.replace(regex1, `else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        const response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);
        setSignupStep(990);
        setIsTyping(false);
        return;
      }`);

// Safely replace the second instance
const regex2 = /else if \(lower\.includes\('start business intake'\)\) \{\s*setIsBusiness\(true\);\s*response = 'dY\? Let\\'s begin your.*?setSignupStep\(\d+\);\s*\}/s;
newContent = newContent.replace(regex2, `else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        response = '🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);
        setSignupStep(990);
        setIsTyping(false);
        return;
      }`);

fs.writeFileSync('src/App.tsx', newContent);
console.log('Fixed start business intake!');
