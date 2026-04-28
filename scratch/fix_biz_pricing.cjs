const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
const lines = c.split('\n');

const newLine = "        response = '\u2b50 **GGHP Business Subscriptions (Cannabis)**\\n\\n\u2022 **Starter** ($199/mo): Full SINC POS + Metrc sync + Basic Larry compliance\\n\u2022 **Professional** ($249/mo): Multi-location + Advanced POS + Larry real-time enforcement\\n\u2022 **Enterprise** ($499/mo): Unlimited locations + White-label POS + Full Sylara automation\\n\\n_All tiers include a 7-Day Free Trial._\\n\\n**Benefit**: Stay 100% compliant and avoid costly fines with automated reporting.';\r";

lines[3748] = newLine;
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed business pricing on line 3749');
