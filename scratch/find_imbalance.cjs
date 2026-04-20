const fs = require('fs');

function findImbalance(filename) {
    const lines = fs.readFileSync(filename, 'utf8').split('\n');
    let balance = 0;
    for (let i = 0; i < lines.length; i++) {
        const opens = (lines[i].match(/<div/g) || []).length;
        const closes = (lines[i].match(/<\/div>/g) || []).length;
        balance += opens - closes;
        if (opens !== 0 || closes !== 0) {
            console.log(`L${i+1}: Balance: ${balance} (${lines[i].trim()})`);
        }
    }
}

console.log('--- Attorney ---');
findImbalance('src/pages/AttorneyDashboard.tsx');
console.log('--- Provider ---');
findImbalance('src/pages/ProviderDashboard.tsx');
