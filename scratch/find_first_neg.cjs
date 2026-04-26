const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
let count = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let prevBalance = balance;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i >= 3149 && i <= 7336) {
        if (balance <= 0 && count < 50) {
            console.log(`Line ${i+1}: Balance ${balance} (was ${prevBalance}): ${line}`);
            count++;
        }
    }
}
