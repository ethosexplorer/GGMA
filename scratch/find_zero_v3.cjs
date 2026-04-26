const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\n/);

let balance = 0;
for (let i = 3149; i < 6502; i++) {
    const l = lines[i];
    if (l.includes('split(/')) continue;
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance === 0) {
        console.log(`Balance hit 0 at line ${i+1}: ${l}`);
    }
}
