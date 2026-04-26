const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\n/);

let balance = 1;
for (let i = 3150; i < 5498; i++) {
    const l = lines[i];
    if (l.includes('split(/')) continue;
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance <= 0) {
        console.log(`Balance hit 0/neg BEFORE 5498 at line ${i+1}: ${l}`);
        balance = 1; 
    }
}
