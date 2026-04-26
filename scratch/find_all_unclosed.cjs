const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = [];
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Ignore contents of strings for brace counting
    let inString = false;
    let stringChar = '';
    for (let j = 0; j < l.length; j++) {
        const char = l[j];
        if (char === '"' || char === "'" || char === "`") {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (stringChar === char) {
                inString = false;
            }
        }
        if (!inString) {
            if (char === '{') {
                openBraces.push(i + 1);
            } else if (char === '}') {
                if (openBraces.length === 0) {
                    // console.log(`EXTRA closing brace at line ${i+1}: ${l}`);
                } else {
                    openBraces.pop();
                }
            }
        }
    }
}
console.log(`Unclosed braces started at lines: ${openBraces.join(', ')}`);
