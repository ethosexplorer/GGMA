const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\n/);

let balance = 0;
// LarryMedCardChatbot started at 3150.
// Let's assume balance is 1 at 3150.
balance = 1;
for (let i = 3150; i < 6502; i++) {
    const l = lines[i];
    // Ignore regex
    if (l.includes('split(/')) continue;
    
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance <= 0) {
        console.log(`Balance hit 0/negative at line ${i+1}: ${l}`);
        balance = 1; // reset to keep finding more
    }
}
