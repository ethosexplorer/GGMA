const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Find line 'else if (signupStep === 133)'
const idx = lines.findIndex(l => l.includes('else if (signupStep === 133) {'));
if (idx === -1) { console.log('Could not find step 133'); process.exit(1); }

console.log('Found step 133 at line', idx + 1);

// Find where this block ends (the closing `}` of the if/else chain before the next comment/step)
let endIdx = idx;
for (let i = idx + 1; i < lines.length; i++) {
  if (lines[i].trim() === '}') {
    endIdx = i;
    break;
  }
  if (lines[i].includes('// ──') || lines[i].includes('else if (signupStep ===')) {
    endIdx = i - 1;
    break;
  }
}
console.log('End of step 133 block at line', endIdx + 1);
console.log('Replacing lines', idx + 1, 'to', endIdx + 1);

const newBlock = [
  `    } else if (signupStep === 133) {`,
  `      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {`,
  `        // GGHP Account created — now transition to State MMA Application`,
  `        response = '✅ **GGHP Account Registration Complete!**\\n\\n**Step 1 is done!** Your free GGHP Business Account has been created.\\n\\nNow let\\'s move to **Step 2: Your State MMA Application**. This is your official Medical Marijuana Authority license application that will be filed with your state.\\n\\nWhat **State** are you applying for your business license in?';`,
  `        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Oklahoma', 'Kentucky', 'Missouri', 'Texas', 'Other State'] } as any]);`,
  `        setSignupStep(950);`,
  `        setIsTyping(false);`,
  `        return;`,
  `      } else if (lower === 'no' || lower === 'nope') {`,
  `        response = 'No problem! Your progress has been saved. Type **start** when you\\'re ready to continue.';`,
  `        setSignupStep(0);`,
  `      } else {`,
  `        response = 'Please answer **Yes** or **No**. Are you ready to proceed to your State MMA Application?';`,
  `        setMessages(prev => [...prev, {`,
  `          role: 'bot',`,
  `          text: response,`,
  `          choices: ['Yes', 'No']`,
  `        } as any]);`,
  `        setIsTyping(false);`,
  `        return;`,
  `      }`,
  `    }`,
];

lines.splice(idx, endIdx - idx + 1, ...newBlock);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Successfully replaced step 133!');
