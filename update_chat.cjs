const fs = require('fs');
let f = fs.readFileSync('src/App.tsx', 'utf8');

// Remove phone numbers and CC to Shantell
const CC_NOTE = `\n\n*(A copy of this ticket has been securely routed to Shantell\\'s priority queue — Flagged: 🟣 Purple)*`;

// We want to add the CC note to specific blocks.
// Let's replace the ending "Would you like to return to the Main Menu?" with the CC_NOTE + the menu question.
const TARGETS = [
  "will follow up with you promptly with a comprehensive update.",
  "will contact you promptly to review the findings.",
  "will reach out to you promptly to discuss the next steps.",
  "will contact you promptly to confirm the details.",
  "will reach out to you promptly to assist you further.",
  "will follow up with you promptly to finalize the deployment.",
  "will contact you promptly with a full report.",
  "will reach out to you promptly with the results.",
  "will contact you promptly to restore your access.",
  "will follow up with you promptly to provide a status update.",
  "will reach out to you promptly to ensure everything is correct.",
  "will contact you promptly to walk you through your personalized strategy."
];

for (const target of TARGETS) {
  const replacer = target + CC_NOTE;
  f = f.replace(target, replacer);
}

// Speak with Shantell replacement:
f = f.replace(
  "They have been notified of the urgency and will reach out to you promptly. You can also call us directly at **405-492-7297**.",
  "I have priority-routed this directly to Shantell's personal queue (Flagged: 🟣 Priority Purple). She has been notified of the urgency and will reach out to you promptly."
);

// Remove phone numbers globally
f = f.replace(/\n*📞.*405[-\d]+/g, '');
f = f.replace(/\n*Support: 1-405[-\d]+/g, '');
f = f.replace(/\n*You can also call us directly at \*\*405[-\d]+\*\*\./g, '');
f = f.replace(/ or call 405[-\d]+/g, '');
f = f.replace(/ or call us at \*\*405[-\d]+\*\*/g, '');
f = f.replace(/ or call us directly at \*\*405[-\d]+\*\*/g, '');
f = f.replace(/🏢 \*\*Global Green\*\*: 405[-\d]+/g, '');
f = f.replace(/For immediate assistance, you can call our administration line at \*\*405[-\d]+\*\*\. /g, '');

fs.writeFileSync('src/App.tsx', f);
