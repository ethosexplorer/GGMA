const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 3462; i < 5361; i++) { // Lines 3463 to 5361
    const l = lines[i];
    for (let char of l) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    // After 3463, balance should be at least 1 (for the try)
    if (balance < 1) {
        console.log(`Balance dropped below 1 at line ${i+1}: ${l}`);
        balance = 1;
    }
}
