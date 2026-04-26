const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 3469; i < 5359; i++) {
    const l = lines[i];
    const prevBalance = balance;
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance < 0) {
        console.log(`NEGATIVE balance at line ${i+1}: ${l}`);
        balance = 0;
    }
}
console.log(`Final balance for if/else chain: ${balance}`);
