const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 3149; i < 7336; i++) { // 1-indexed lines 3150 to 7336
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance < 0) {
        console.log(`NEGATIVE BALANCE at line ${i+1} (relative balance ${balance}): ${line}`);
        // Reset balance to 0 to keep searching for more
        balance = 0;
    }
}
