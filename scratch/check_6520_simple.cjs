const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);
const line = lines[6519]; // 0-indexed line 6520
console.log(`Line 6520 content: "${line}"`);
let b = 0;
for (let c of line) {
    if (c === '{') b++;
    if (c === '}') b--;
}
console.log(`Brace balance of line 6520: ${b}`);
