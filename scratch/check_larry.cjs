const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 3149; i < 6503; i++) { // LarryMedCardChatbot
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance of LarryMedCardChatbot: ${balance}`);
