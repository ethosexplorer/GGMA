const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 3450; i < 5365; i++) { // handleSend
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance of handleSend: ${balance}`);
