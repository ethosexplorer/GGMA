const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  'className="filter blur-md grayscale opacity-40 pointer-events-none select-none h-screen overflow-hidden"',
  'className="pointer-events-none select-none h-screen overflow-hidden"'
);

// We should also change the text "explore the dashboard below in Shadow Mode" to "explore the dashboard below in Preview Mode"
c = c.replace('Shadow Mode', 'Preview Mode');
c = c.replace('Shadow Mode Overlay', 'Preview Mode Overlay');

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx updated for preview mode.');
