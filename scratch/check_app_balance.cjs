const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 7340; i < lines.length; i++) { // 1-indexed lines 7341 to end
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance within App (7341-end): ${balance}`);
