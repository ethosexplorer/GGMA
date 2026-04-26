const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let balance = 0;
let line = 1;
let inString = null;
let inRegex = false;
let escape = false;

const lines = content.split(/\n/);
for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const trimmed = l.trim();
    
    // Simple way to ignore lines that are mostly comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        continue;
    }

    for (let j = 0; j < l.length; j++) {
        const char = l[j];
        if (escape) { escape = false; continue; }
        if (char === '\\') { escape = true; continue; }
        if (inString) { if (char === inString) inString = null; continue; }
        if (char === '"' || char === "'" || char === '`') { inString = char; continue; }
        
        if (char === '{') balance++;
        if (char === '}') {
            balance--;
            if (balance < 0) {
                console.log(`NEGATIVE at line ${i+1}: ${l}`);
            }
        }
    }
}
console.log(`Final balance: ${balance}`);
