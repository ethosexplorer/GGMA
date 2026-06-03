import fs from 'fs';

const logPath = 'C:\\Users\\shans\\.gemini\\antigravity-ide\\brain\\60929a3c-87ab-4862-99fe-e76b9537c00f\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n').filter(Boolean);

let userMsgIdx = 1;
for (const line of lines) {
  const step = JSON.parse(line);
  if (step.type === 'USER_INPUT') {
    const content = step.content || '';
    if (content.includes('http') || content.includes('drive.google') || content.includes('docs.google') || content.includes('wikipedia')) {
      console.log(`\n--- USER MESSAGE ${userMsgIdx++} ---`);
      console.log(content);
    }
  }
}
