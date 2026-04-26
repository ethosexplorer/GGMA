const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let balance = 0;
let inString = null;
let inRegex = false;
let escape = false;
let line = 1;
let hits = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    if (char === '\n') line++;
    if (escape) { escape = false; continue; }
    if (char === '\\') { escape = true; continue; }
    if (inString) { if (char === inString) inString = null; continue; }
    if (inRegex) { if (char === '/') inRegex = false; continue; }
    if (char === '"' || char === "'" || char === '`') { inString = char; continue; }
    if (char === '/' && nextChar !== '/' && nextChar !== '*') {
        let j = i - 1;
        while (j >= 0 && /\s/.test(content[j])) j--;
        if (j < 0 || /[(=,?:!&|]/.test(content[j])) { inRegex = true; continue; }
    }
    if (char === '{') balance++;
    if (char === '}') {
        balance--;
        if (balance < 0 && hits < 10) {
            console.log(`FIRST NEGATIVE at line ${line}: balance=${balance}`);
            hits++;
        }
    }
}
console.log(`Final balance: ${balance}`);
