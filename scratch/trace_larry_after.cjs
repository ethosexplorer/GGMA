const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 1; // LarryMedCardChatbot is open
for (let i = 5365; i < 6502; i++) {
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance < 0) {
        console.log(`Balance dropped below 0 at line ${i+1}: ${l}`);
        balance = 0;
    }
}
console.log(`Final balance at line 6502: ${balance}`);
