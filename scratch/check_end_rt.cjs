const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < 5500; i++) { // 1-indexed lines 1 to 5500
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (i >= 5490 && i <= 5500) {
        console.log(`Line ${i+1}: Balance ${balance}: ${line}`);
    }
}
