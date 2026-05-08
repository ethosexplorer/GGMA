const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let changes = 0;

// ═══════════════════════════════════════════════════════════════════════
// FIX 1: Update the Business greeting to explain the 3-step process
// ═══════════════════════════════════════════════════════════════════════

const oldGreeting = `if (isBusiness) return \`👋 Hello! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is now a **\${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and handle your initial onboarding. *(You will be creating a **FREE account** today, with options to upgrade to premium tiers later)*. Once we complete intake, your file routes to **L.A.R.R.Y** (Compliance Engine) for operational processing, and **Monica Green** (Compliance Director) for human review. \\n\\nHow can I assist your business today?\`;`;

const newGreeting = `if (isBusiness) return \`👋 Hello! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is now a **\${metrcStatus}**.\\n\\nHere's how the business onboarding process works:\\n\\n**Step 1:** Create your **FREE GGHP Business Account** (with options to upgrade later)\\n**Step 2:** Complete your **State MMA Application** (Medical Marijuana Authority license)\\n**Step 3:** Receive your **login credentials** and access your **Business Dashboard**\\n\\nOnce complete, your file routes to **L.A.R.R.Y** (Compliance Engine) for processing and **Monica Green** (Compliance Director) for human review.\\n\\nHow can I assist your business today?\`;`;

if (content.includes(oldGreeting)) {
  content = content.replace(oldGreeting, newGreeting);
  changes++;
  console.log('FIX 1: Updated business greeting with 3-step process');
} else {
  console.log('FIX 1: Could not find old greeting. Searching...');
  const idx = content.indexOf('if (isBusiness) return');
  if (idx > -1) console.log(content.substring(idx, idx + 200));
}

// ═══════════════════════════════════════════════════════════════════════
// FIX 2: Update step 133 (end of GGHP registration) to transition
//        into State MMA Application instead of ending the flow
// ═══════════════════════════════════════════════════════════════════════

const old133yes = `    } else if (signupStep === 133) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = '🎉 **Application Complete!**\\n\\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\\n\\nI want to thank you for allowing me to assist you in this process. If you have any questions feel free to login your portal and chat with me directly 24/7 by clicking the **\\"help/support\\"** tab. Thank you and Goodbye 👋';
        setSignupStep(0);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! Your progress has been saved. Type **start** when you\\'re ready to continue, for assistance.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to submit your application?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }`;

const new133yes = `    } else if (signupStep === 133) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        // GGHP Account created — now transition to State MMA Application
        response = '✅ **GGHP Account Registration Complete!**\\n\\n**Step 1 is done!** Your free GGHP Business Account has been created.\\n\\nNow let\\'s move to **Step 2: Your State MMA Application**. This is your official Medical Marijuana Authority license application that will be filed with your state.\\n\\nWhat **State** are you applying for your business license in?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Oklahoma', 'Kentucky', 'Missouri', 'Texas', 'Other State'] } as any]);
        setSignupStep(950);
        setIsTyping(false);
        return;
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! Your progress has been saved. Type **start** when you\\'re ready to continue.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to proceed?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }`;

if (content.includes(old133yes)) {
  content = content.replace(old133yes, new133yes);
  changes++;
  console.log('FIX 2: Updated step 133 to transition to State MMA Application');
} else {
  console.log('FIX 2: Could not find old step 133');
}

// ═══════════════════════════════════════════════════════════════════════
// FIX 3: Add State MMA Application steps (950-955) + login credentials
//        + redirect to sign-in page
// ═══════════════════════════════════════════════════════════════════════

const stateMMApSteps = `
    // ── State MMA Application Steps (950-955) ──────────────────────────────
    else if (signupStep === 950) {
      setBusinessData(prev => ({ ...prev, mmaState: text }));
      response = \`📋 **\${text} Medical Marijuana Authority Application**\\n\\nWhat **type of commercial license** are you applying for?\`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Dispensary', 'Grower / Cultivator', 'Processor / Manufacturer', 'Transporter', 'Testing Laboratory', 'Other'] } as any]);
      setSignupStep(951);
      setIsTyping(false);
      return;
    }
    else if (signupStep === 951) {
      setBusinessData(prev => ({ ...prev, mmaLicenseType: text }));
      response = 'What is the **physical address of the business location** where this license will operate?';
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setSignupStep(952);
      setIsTyping(false);
      return;
    }
    else if (signupStep === 952) {
      setBusinessData(prev => ({ ...prev, mmaBusinessAddress: text }));
      response = 'Do you have an **existing State MMA License Number** from a previous registration? (If this is a renewal, enter it below. If new, type **"New Application"**)';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['New Application'] } as any]);
      setSignupStep(953);
      setIsTyping(false);
      return;
    }
    else if (signupStep === 953) {
      setBusinessData(prev => ({ ...prev, mmaExistingLicense: text }));
      const isRenewal = !lower.includes('new');
      const appType = isRenewal ? 'License Renewal' : 'New License Application';
      response = \`📝 **State MMA Application Summary**\\n\\n• **Application Type:** \${appType}\\n• **State:** \${businessData.mmaState || 'N/A'}\\n• **License Type:** \${businessData.mmaLicenseType || 'N/A'}\\n• **Business Location:** \${text === 'New Application' ? businessData.mmaBusinessAddress : text}\\n• **Existing License:** \${text}\\n\\nDoes everything look correct? Type **"Confirm"** to finalize your application.\`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Confirm', 'Edit'] } as any]);
      setSignupStep(954);
      setIsTyping(false);
      return;
    }
    else if (signupStep === 954) {
      if (lower === 'confirm' || lower === 'yes' || lower === 'proceed') {
        // Generate temp password
        const tempPassword = 'GGHP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const userEmail = businessData.email || 'your registered email';
        const userName = businessData.fullName || 'Business User';
        response = \`🎉 **All Steps Complete!**\\n\\nCongratulations, **\${userName}**! Your **GGHP Business Account** and **State MMA Application** have both been submitted successfully.\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━\\n🔐 **Your Login Credentials**\\n━━━━━━━━━━━━━━━━━━━━━━━━━\\n• **Email:** \${userEmail}\\n• **Temporary Password:** \${tempPassword}\\n\\n⚠️ *Please save these credentials. You will be prompted to change your password on first login.*\\n━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n**Next Steps:**\\n1. You will receive a callback to **REVIEW** your application for 1st-time approval accuracy\\n2. **PAY** your state fee\\n3. **SUBMIT** for state approval of your business license\\n\\nI want to thank you for allowing me to assist you. You can chat with me 24/7 from your dashboard by clicking **"Help/Support"**. \\n\\nRedirecting you to **Sign In** now...\`;
        setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
        setSignupStep(955);
        setIsTyping(false);
        // Redirect to login after 5 seconds
        setTimeout(() => onNavigate('login' as any), 5000);
        return;
      } else if (lower === 'edit' || lower === 'change') {
        response = 'No problem — let\\'s redo the State MMA section. What **State** are you applying for your business license in?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Oklahoma', 'Kentucky', 'Missouri', 'Texas', 'Other State'] } as any]);
        setSignupStep(950);
        setIsTyping(false);
        return;
      } else {
        response = 'Please type **"Confirm"** to finalize, or **"Edit"** to make changes.';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Confirm', 'Edit'] } as any]);
        setIsTyping(false);
        return;
      }
    }
    else if (signupStep === 955) {
      // Post-completion — user typed after redirect started
      response = '✅ Your application is complete! Redirecting you to the **Sign In** page now...';
      setMessages(prev => [...prev, { role: 'bot', text: response } as any]);
      setTimeout(() => onNavigate('login' as any), 2000);
      setIsTyping(false);
      return;
    }`;

// Insert the State MMA steps right after step 134
const insertAnchor = `    // ── Step 134: Application Review ──`;
if (content.includes(insertAnchor)) {
  content = content.replace(insertAnchor, stateMMApSteps + '\n    // ── Step 134: Application Review ──');
  changes++;
  console.log('FIX 3: Injected State MMA Application steps (950-955)');
} else {
  console.log('FIX 3: Could not find insertion anchor');
}

if (changes > 0) {
  fs.writeFileSync('src/App.tsx', content);
  console.log('\nDone! ' + changes + ' fixes applied.');
} else {
  console.log('\nNo changes made.');
}
