const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = [];
for (let i = 3469; i < 5359; i++) {
    const l = lines[i];
    for (let char of l) {
        if (char === '{') {
            openBraces.push(i + 1);
        } else if (char === '}') {
            if (openBraces.length === 0) {
                console.log(`EXTRA closing brace at line ${i+1}: ${l}`);
            } else {
                openBraces.pop();
            }
        }
    }
}
console.log(`Unclosed braces started at lines: ${openBraces.join(', ')}`);
