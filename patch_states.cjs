const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AttorneyDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const stateOptions = '<option>Select State...</option>\n                  ' + states.map(s => `<option>${s}</option>`).join('\n                  ');

c = c.replace(
  /<option>Select State\.\.\.<\/option>[\s\S]*?<option>California<\/option>/,
  stateOptions
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched 50 states into AttorneyDashboard');
