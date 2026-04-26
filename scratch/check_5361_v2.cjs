const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\n/);

let balance = 1;
for (let i = 3150; i < 5361; i++) {
    const l = lines[i];
    if (l.includes('split(/')) continue;
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance at line 5361: ${balance}`);
