const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// Regex to find all braced blocks, but skipping strings and regex
let balance = 0;
let inString = false;
let stringChar = '';
let inRegex = false;
let inComment = false;
let inBlockComment = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i+1];

    if (inBlockComment) {
        if (char === '*' && next === '/') {
            inBlockComment = false;
            i++;
        }
        continue;
    }
    if (inComment) {
        if (char === '\n') inComment = false;
        continue;
    }
    if (inString) {
        if (char === stringChar && content[i-1] !== '\\') inString = false;
        continue;
    }
    if (inRegex) {
        if (char === '/' && content[i-1] !== '\\') inRegex = false;
        continue;
    }

    if (char === '/' && next === '*') {
        inBlockComment = true;
        i++;
    } else if (char === '/' && next === '/') {
        inComment = true;
        i++;
    } else if (char === '"' || char === "'" || char === "`") {
        inString = true;
        stringChar = char;
    } else if (char === '/' && !/[a-zA-Z0-9_$)]/.test(content[i-1] || '')) {
        // Simple heuristic for regex vs division
        inRegex = true;
    } else if (char === '{') {
        balance++;
    } else if (char === '}') {
        balance--;
    }
}

console.log(`Final balance (smart): ${balance}`);
