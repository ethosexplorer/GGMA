const fs = require('fs');

function findImbalance(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n');
    let balance = 0;
    for (let i = 0; i < lines.length; i++) {
        const opens = (lines[i].match(/<div/g) || []).length;
        const closes = (lines[i].match(/<\/div>/g) || []).length;
        balance += opens - closes;
        if (i > lines.length - 20) {
           console.log(`${filename} L${i+1}: Bal ${balance} | ${lines[i].trim()}`);
        }
    }
}

findImbalance('src/pages/AttorneyDashboard.tsx');
findImbalance('src/pages/ProviderDashboard.tsx');
