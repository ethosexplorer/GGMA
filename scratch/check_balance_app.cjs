const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i % 100 === 0) {
        console.log(`Line ${i}: Balance ${balance}`);
    }
    if (balance < 0) {
        console.log(`Line ${i}: Balance went NEGATIVE (${balance}) at line ${i+1}: ${line}`);
        process.exit(1);
    }
}
console.log(`Final Balance: ${balance}`);
