const fs = require('fs');
const path = 'src/components/telephony/CallCenterCommandTab.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("true // Mock FCM; alert", "true /* Mock FCM */; alert");

fs.writeFileSync(path, content);
console.log('Fixed JSX syntax error!');
