const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
// We start counting from the beginning of the file to be safe
for (let i = 0; i < 5359; i++) {
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance at line 5359 (after line 5359's closing brace): ${balance}`);
