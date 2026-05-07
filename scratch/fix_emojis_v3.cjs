const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The string shown in the image is "dY? Let's begin your"
content = content.replace(/dY\? Let's begin your/g, "🏢 Let's begin your");
content = content.replace(/dY\? Let's begin your/g, "🏢 Let's begin your");

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed specific start business intake emojis!');
