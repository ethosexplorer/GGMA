const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetLine = "      } else if (lower.includes('yes, i have my documents') || lower.includes('upload them later') || lower.includes('yes, start') || lower.includes('start')) {";
const replacementLine = "      } else if (lower.includes('yes, i have my documents') || lower.includes('upload them later') || lower.includes('start patient intake') || lower === 'start' || lower === 'yes, start') {";

if (content.includes(targetLine)) {
  content = content.replace(targetLine, replacementLine);
  fs.writeFileSync(path, content);
  console.log('Fixed overly broad start intercept in signupStep 0!');
} else {
  console.log('Could not find the target line. Searching for partial match...');
  const partial = "lower.includes('yes, start') || lower.includes('start')";
  if (content.includes(partial)) {
      content = content.replace(partial, "lower.includes('start patient intake') || lower === 'start' || lower === 'yes, start'");
      fs.writeFileSync(path, content);
      console.log('Fixed partial match!');
  } else {
      console.log('Failed to find anything to replace.');
  }
}
