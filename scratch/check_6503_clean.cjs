const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\n/);

let balance = 0;
for (let i = 0; i < 6503; i++) {
    const l = lines[i];
    // Ignore strings and regex as much as possible
    let cleaned = l.replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""').replace(/`[^`]*`/g, '``');
    // Simplified regex cleaner
    cleaned = cleaned.replace(/\/[^/]+\//g, '//');
    
    for (let char of cleaned) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance at line 6503: ${balance}`);
