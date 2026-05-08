const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let changes = 0;

// FIX 1: Replace the non-existent `getGreetingChoices(variant)` with `getInitialChoices()`
// and `getGreeting(variant)` with `getGreeting()`
const broken = `        response = getGreeting(variant);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getGreetingChoices(variant) } as any]);`;

const fixed = `        response = getGreeting();
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getInitialChoices() } as any]);`;

if (content.includes(broken)) {
  content = content.replace(broken, fixed);
  changes++;
  console.log('FIX 1: Replaced getGreetingChoices(variant) with getInitialChoices()');
} else {
  console.log('FIX 1: Could not find broken block');
}

// FIX 2: Update Business Intake classification to show proper choices:
// "New Registration (GGHP)" and "New / Renewal (OMMA State Application)"
const oldBizIntake = `'🏢 Let\\'s begin your **Commercial License Application**.\\n\\nAre you a **New State Registration** or **Renewal** to determine your application needs?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration', 'Renewal'] } as any]);`;

const newBizIntake = `'🏢 Let\\'s begin your **Commercial License Application**.\\n\\nPlease select your registration type below:';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Registration (GGHP)', 'New / Renewal (OMMA State Application)'] } as any]);`;

// This pattern appears twice (lines 4298 and 4401), replace both
let count = 0;
while (content.includes(oldBizIntake)) {
  content = content.replace(oldBizIntake, newBizIntake);
  count++;
}
if (count > 0) {
  changes += count;
  console.log(`FIX 2: Updated ${count} Business Intake choice blocks`);
} else {
  console.log('FIX 2: Could not find oldBizIntake pattern');
}

if (changes > 0) {
  fs.writeFileSync('src/App.tsx', content);
  console.log(`\nDone! ${changes} fixes applied.`);
} else {
  console.log('\nNo changes made.');
}
