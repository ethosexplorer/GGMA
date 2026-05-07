const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Inject Helper Function `getBriefSummary` right before `const getGreeting`
const helperFunc = `
  const getBriefSummary = (v: string) => {
    switch (v) {
      case 'ggma-patient':
      case 'patient':
        return 'You have selected the **Patient Intake** sector. This process helps individuals register for their state-approved medical cannabis cards, verify eligibility, and book telehealth appointments seamlessly.';
      case 'sinc':
      case 'business':
        return 'You have selected the **Business Intake** sector. This process helps commercial entities establish their regulatory profile, apply for state-approved commercial licenses, and access compliance tools.';
      case 'provider':
        return 'You have selected the **Provider Intake** sector. This path is for physicians and clinicians looking to join our verified telehealth network and register with the state board.';
      case 'rip':
      case 'law-enforcement':
        return 'You have selected the **Regulatory/Law Enforcement** portal. This is a restricted gateway for state inspectors, regulators, and enforcement agencies to verify compliance and run reports.';
      case 'legal':
        return 'You have selected the **Legal Representation** sector. This connects you with attorneys for compliance defense, corporate counsel, or patient advocacy matters.';
      case 'government':
        return 'You have selected the **Government Office** sector. This portal provides municipalities and elected officials with economic impact data and regulatory policy tools.';
      case 'advocate':
        return 'You have selected the **Advocacy & Non-Profit** sector. This portal connects social equity applicants and researchers with community polling and resources.';
      default:
        return 'You have selected a specialized intake sector. Let\\'s proceed to set up your profile.';
    }
  };
`;
if (!content.includes('const getBriefSummary = (v: string) => {')) {
  content = content.replace('const getGreeting = (v: string) => {', helperFunc + '\n  const getGreeting = (v: string) => {');
}

// 2. Change language click to -0.5
// Look for where languages are handled.
// Wait, the language click is usually in handleSend when step is -1?
// Let's check handleLanguageSelect if it exists.
// We can just find `setSignupStep(0);` after `setSignupData(prev => ({ ...prev, preferredLanguage: text }));`
content = content.replace(
  /setSignupData\(prev => \(\{ \.\.\.prev, preferredLanguage: text \}\)\);\s*setSignupStep\(0\);/g,
  `setSignupData(prev => ({ ...prev, preferredLanguage: text }));\n      setSignupStep(-0.5);`
);

// 3. Step -0.5
const stepMinus05 = `    if (signupStep === -0.5) {
      if (lower === 'yes' || lower === 'y' || lower.includes('proceed') || lower.includes('understand')) {
        setSignupStep(0);
        response = getGreeting(variant);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: getGreetingChoices(variant) } as any]);
      } else if (lower === 'no' || lower === 'n' || lower.includes('back')) {
        response = 'No problem! Let\\'s return to the main selection. How can I assist you today?';
        setSignupStep(-1);
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Patient', 'Business', 'Provider', 'Legal', 'Government', 'Advocacy'] } as any]);
      } else {
        response = getBriefSummary(variant) + '\\n\\n**Do you understand and would you like to proceed?** (Yes/No)';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
      }
      setIsTyping(false);
      return;
    }

    if (signupStep === 0) {`;
if (!content.includes('if (signupStep === -0.5) {')) {
  content = content.replace('    if (signupStep === 0) {', stepMinus05);
}

// 4. Step 990
const step990 = `    // Registration Classification
    else if (signupStep === 990) {
      setBusinessData(prev => ({ ...prev, registrationType: text }));
      const response = \`Got it. Let's proceed with your **\${text}**.\\n\\n**Section 1: First-Time Registration**\\n\\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.\`;
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setSignupStep(100);
      setIsTyping(false);
      return;
    }
    // Section 1: First-Time Registration
    else if (signupStep === 100) {`;
if (!content.includes('else if (signupStep === 990) {')) {
  content = content.replace(/    \/\/ Section 1: First-Time Registration\s*else if \(signupStep === 100\) \{/, step990);
}

// 5. Step 133.5
const step133_5 = `    // 📝 Step 133.5: Document Upload Prompt
    else if (signupStep === 133.5) {
      const response = \`📋 **Business Document Upload Center**\\n\\nI need a few documents to complete your commercial file.\\n\\n📷 **Photo Instructions:** Please take a picture with all 4 corners of the document clearly visible, or scan it.\\n\\n⚠️ **Trouble Uploading?** If you cannot upload in this chat, you can:\\n✉️ **Email** Sylara Administrative Support at **asstsupport@gmail.com**\\n\\nAre you ready to begin uploads?\`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Ready to Upload', 'Skip for Now', 'I Will Email Them'] } as any]);
      setIsTyping(false);
      return;
    }
    else if (signupStep === 133.6) {
      if (lower.includes('ready')) {
        const response = \`Please use the **Business Document Upload Center** below.\\n\\n*(Note: Once uploaded, click **"Continue"** below the documents to proceed to review)*\`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Continue'] } as any]);
        setSignupStep(133.7);
        setIsTyping(false);
        return;
      } else {
        const response = \`Understood. You can upload them later in your portal or via email. Let's proceed to your application review.\`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Review Application'] } as any]);
        setSignupStep(133.8);
        setIsTyping(false);
        return;
      }
    }
    else if (signupStep === 133.7 || signupStep === 133.8) {
      if (lower === 'continue' || lower.includes('review') || lower === 'done') {
        const response = \`Great. Now, let's review your application.\`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['View Application'] } as any]);
        setSignupStep(134);
        setIsTyping(false);
        return;
      }
    }
    // 📝 Step 134: Application Review 📝
    else if (signupStep === 134) {`;
if (!content.includes('else if (signupStep === 133.5) {')) {
  // Try to find Step 134
  const target134 = /    \/\/\s*📝*\s*Step 134: Application Review\s*📝*\s*else if \(signupStep === 134\) \{/i;
  if (target134.test(content)) {
    content = content.replace(target134, step133_5);
  } else {
    // If we can't find it with emojis, find without
    content = content.replace(/    \/\/ Step 134: Application Review\s*else if \(signupStep === 134\) \{/i, step133_5);
  }
}

// 6. Replace setSignupStep(134) with setSignupStep(133.5) inside the business block
// Find the index of "Step 100" and "Cost & Fees Flow"
const idx100 = content.indexOf('signupStep === 100');
const idxCost = content.indexOf('Cost & Fees Flow');
if (idx100 !== -1 && idxCost !== -1) {
  let before = content.substring(0, idx100);
  let middle = content.substring(idx100, idxCost);
  let after = content.substring(idxCost);
  
  middle = middle.replace(/setSignupStep\(134\);/g, 'setSignupStep(133.5);');
  content = before + middle + after;
}

// 7. Inject Business Widget
const businessWidget = `          {/* 📝 Business Document Upload Panel - shown during step 133.7 📝 */}
          {signupStep === 133.7 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-5">
                <p className="text-sm font-bold text-slate-800 mb-1">🏢 Business Document Upload</p>
                <p className="text-xs text-slate-500 mb-4">Click on each document to upload. All documents must be verified before proceeding.</p>
                <div className="space-y-2 mb-5">
                  {['Government-Issued Photo ID', 'Proof of State Residency', 'Certificate of Good Standing', 'Affidavit of Lawful Presence'].map((docName) => {
                    const isUploaded = !!uploadedDocuments[docName];
                    return (
                      <div key={docName} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-2">
                          {isUploaded ? <CheckCircle size={16} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
                          <p className={\`text-xs font-medium \${isUploaded ? 'text-slate-800' : 'text-slate-600'}\`}>{docName}</p>
                        </div>
                        <button onClick={() => triggerUpload(docName)} disabled={isUploaded} className={\`px-3 py-1 rounded-md text-xs font-bold \${isUploaded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-[#1a4731] text-[#1a4731] hover:bg-[#1a4731] hover:text-white transition-colors'}\`}>
                          {isUploaded ? 'Uploaded' : 'Upload'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

`;

if (!content.includes('Business Document Upload Panel')) {
  // Find where the patient widget is
  const targetWidget = /{signupStep === 16 && \(/;
  content = content.replace(targetWidget, businessWidget + '          {signupStep === 16 && (');
}

fs.writeFileSync('src/App.tsx', content);
console.log('Successfully injected all missing logic!');
