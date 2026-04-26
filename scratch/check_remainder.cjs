const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 5365; i < lines.length; i++) {
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance from line 5366 to end: ${balance}`);
