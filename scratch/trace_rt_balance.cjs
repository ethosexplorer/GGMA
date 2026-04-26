const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 3149; i < 5500; i++) { // 1-indexed lines 3150 to 5500
    const line = lines[i];
    let startBalance = balance;
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i >= 5440) {
        console.log(`Line ${i+1}: Balance ${balance} (start ${startBalance}): ${line}`);
    }
}
