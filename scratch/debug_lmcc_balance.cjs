const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let prevBalance = balance;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    // If balance became 0 or negative inside a function it shouldn't have
    if (i >= 3150 && i <= 7336) {
        // LarryMedCardChatbot starts at 3150, so balance should be >= 1
        if (balance < 1) {
            console.log(`Line ${i+1}: Balance ${balance} (was ${prevBalance}): ${line}`);
        }
    }
}
