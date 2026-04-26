const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < 5441; i++) { // 1-indexed lines 1 to 5441
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance at line 5441: ${balance}`);
