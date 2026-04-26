const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
const lines = c.split('\n');

// Find line 1540 (index 1539) and add the missing closing </div> for the grid
// Currently: line 1540 = </div> (closes sidebar)  then line 1541 = </section>
// Need to add: </div> (closes grid container) between them

for (let i = 1538; i <= 1542; i++) {
  console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}

// Insert the missing </div> after line 1540 (index 1539)
lines.splice(1540, 0, '        </div>');
c = lines.join('\n');
fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('✅ Added missing closing </div> for grid container');
