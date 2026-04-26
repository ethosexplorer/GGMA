const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let balance = 0;
let inString = null;
let inRegex = false;
let escape = false;
let line = 1;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    if (escape) { escape = false; }
    else if (char === '\\') { escape = true; }
    else if (inString) { if (char === inString) inString = null; }
    else if (inRegex) { if (char === '/') inRegex = false; }
    else if (char === '"' || char === "'" || char === '`') { inString = char; }
    else if (char === '/' && nextChar !== '/' && nextChar !== '*') {
        let j = i - 1;
        while (j >= 0 && /\s/.test(content[j])) j--;
        if (j < 0 || /[(=,?:!&|]/.test(content[j])) inRegex = true;
    }
    else if (char === '{') balance++;
    else if (char === '}') balance--;

    if (char === '\n') {
        if (line >= 6609 && line <= 7170) {
            console.log(`Line ${line}: balance=${balance}`);
        }
        line++;
    }
}
