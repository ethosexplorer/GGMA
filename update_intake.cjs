const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Fix step 10.1, 11.1, 14, 15
const targetStepLogic = `    } else if (signupStep === 10.1) {
      if (lower.includes('yes')) {
        setSignupStep(11.1);
        response = \`Please enter the **Name** and **Phone Number** of your primary physician.\`;
      } else {
        setSignupStep(12);
        response = \`Understood. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have? \\n\\n*(I will provide a list for you to choose from)*\`;
      }
    } else if (signupStep === 11.1) {
      setSignupData(prev => ({ ...prev, primaryPhysician: text }));
      setSignupStep(12);
      response = \`Got it. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have? \\n\\n*(I will provide a list for you to choose from)*\`;
    } else if (signupStep === 12) {
      setSignupData(prev => ({ ...prev, qualifyingCondition: text }));
      setSignupStep(13);
      response = \`Do you have any **Allergies**?\`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 13) {
      setSignupData(prev => ({ ...prev, allergies: text }));
      setSignupStep(14);
      response = \`When was the last time you spoke with a doctor about these complaints?\`;
    } else if (signupStep === 14) {
      setSignupData(prev => ({ ...prev, lastDoctorVisit: text }));
      setSignupStep(15);
      response = \`📋 **Document Upload Center**\\n\\nI need a few documents to complete your file. Please follow the prompts in the **Upload Panel** below.\\n\\nYou must upload all required documents before we can proceed to the final step.\\n\\nAre you ready to begin uploads?\`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Ready to Upload', 'Skip for Now'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 15) {
      if (lower.includes('ready')) {
        setSignupStep(16);
        response = \`Please use the **Patient Document Upload Center** below. Once all documents are uploaded, the continue button will activate.\`;
      } else {
        setSignupStep(19);
        response = \`Understood. You can upload them later in your portal. \\n\\nFinal step: Would you like to **Opt-In** to subscribe for 2-way messaging for renewal alerts and status updates?\`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }`;

const replacementStepLogic = `    } else if (signupStep === 10.1) {
      if (lower.includes('yes')) {
        setSignupStep(11.1);
        response = \`Please enter the **Name** and **Phone Number** of your primary physician.\`;
      } else {
        setSignupStep(12);
        response = \`Understood. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have?\`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Chronic Pain', 'Depression', 'Anxiety', 'Insomnia', 'PTSD', 'Autism', 'Cancer', 'Glaucoma', 'Seizures', 'Crohns Disease', 'Sickle Cell', 'Other']
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 11.1) {
      setSignupData(prev => ({ ...prev, primaryPhysician: text }));
      setSignupStep(12);
      response = \`Got it. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have?\`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Chronic Pain', 'Depression', 'Anxiety', 'Insomnia', 'PTSD', 'Autism', 'Cancer', 'Glaucoma', 'Seizures', 'Crohns Disease', 'Sickle Cell', 'Other']
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 12) {
      setSignupData(prev => ({ ...prev, qualifyingCondition: text }));
      setSignupStep(13);
      response = \`Do you have any **Allergies**?\`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 13) {
      setSignupData(prev => ({ ...prev, allergies: text }));
      setSignupStep(14);
      response = \`When was the last time you spoke with a doctor about these complaints?\`;
    } else if (signupStep === 14) {
      setSignupData(prev => ({ ...prev, lastDoctorVisit: text }));
      setSignupStep(15);
      response = \`📋 **Document Upload Center**\\n\\nI need a few documents to complete your file.\\n\\n📷 **Photo Instructions:** Please take a picture with all 4 corners of the document clearly visible, or scan it.\\n\\n⚠️ **Trouble Uploading?** If you cannot upload in this chat, you can:\\n📱 **Text** your documents to **1-405-492-7487** (Include your Name & D.O.B)\\n✉️ **Email** to **asstsupport@gmail.com**\\n\\nAre you ready to begin uploads?\`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Ready to Upload', 'Skip for Now', 'I Will Email/Text Them'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 15) {
      if (lower.includes('ready')) {
        setSignupStep(16);
        response = \`Please use the **Patient Document Upload Center** below. Once all documents are uploaded, the continue button will activate.\`;
      } else {
        setSignupStep(19);
        response = \`Understood. You can upload them later in your portal or via email/text. \\n\\nFinal step: Would you like to **Opt-In** to subscribe for 2-way messaging for renewal alerts and status updates?\`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }`;

app = app.split(targetStepLogic).join(replacementStepLogic);

// Fix handleFileUpload to include signupStep === 16 (Patient) and signupStep === 141 (Provider? wait, let's just make sure 16 is included)
// Actually let's search for "if (signupStep === 131)"
const targetFileUpload = `        } else if (signupStep === 131) {
          // If a pending doc label was set (user clicked a specific doc), mark it
          if (pendingDocLabel) {
            setUploadedDocuments(prev => ({ ...prev, [pendingDocLabel]: file.name }));
            setBusinessData(prev => ({
              ...prev,
              documentsUploadedCount: prev.documentsUploadedCount + 1,
            }));
            setMessages(prev => [...prev, { role: 'bot', text: \`✅ **\${pendingDocLabel}** — uploaded: **\${file.name}**\` }]);
            setPendingDocLabel('');
          } else {
            // Generic upload — ask which document it is
            setBusinessData(prev => ({
              ...prev,
              documentsUploadedCount: prev.documentsUploadedCount + 1,
            }));
            setMessages(prev => [...prev, { role: 'bot', text: \`✅ Document received: **\${file.name}**. Please select which document this is from the checklist above.\` }]);
          }
        }`;

const replacementFileUpload = `        } else if (signupStep === 131 || signupStep === 16) {
          // If a pending doc label was set (user clicked a specific doc), mark it
          if (pendingDocLabel) {
            setUploadedDocuments(prev => ({ ...prev, [pendingDocLabel]: file.name }));
            if (signupStep === 131) {
              setBusinessData(prev => ({
                ...prev,
                documentsUploadedCount: prev.documentsUploadedCount + 1,
              }));
            }
            setMessages(prev => [...prev, { role: 'bot', text: \`✅ **\${pendingDocLabel}** — uploaded: **\${file.name}**\` }]);
            setPendingDocLabel('');
          } else {
            // Generic upload — ask which document it is
            if (signupStep === 131) {
              setBusinessData(prev => ({
                ...prev,
                documentsUploadedCount: prev.documentsUploadedCount + 1,
              }));
            }
            setMessages(prev => [...prev, { role: 'bot', text: \`✅ Document received: **\${file.name}**. Please select which document this is from the checklist above.\` }]);
          }
        }`;

app = app.split(targetFileUpload).join(replacementFileUpload);

// Same for business upload instructions, the user asked: "Can you do it for business documents our upload is amazing. Tell them to take picks with all 4 corners visible in the pic or scan then upload and send."
// Let's find step 130
const targetBusinessUpload = `    } else if (signupStep === 130) {
      setBusinessData(prev => ({ ...prev, ein: text }));
      setSignupStep(131);
      response = \`📋 **Business Verification Documents**\\n\\nI need a few documents to verify your commercial entity. Please use the **Business Document Upload Center** below.\`;
    } else if (signupStep === 131) {`;

const replacementBusinessUpload = `    } else if (signupStep === 130) {
      setBusinessData(prev => ({ ...prev, ein: text }));
      setSignupStep(131);
      response = \`📋 **Business Verification Documents**\\n\\nI need a few documents to verify your commercial entity.\\n\\n📷 **Photo Instructions:** Please ensure all 4 corners of the document are visible in the picture or scan.\\n\\n⚠️ **Trouble Uploading?** If you cannot upload in this chat, you can:\\n📱 **Text** your documents to **1-405-492-7487** (Include Business Name & EIN)\\n✉️ **Email** to **asstsupport@gmail.com**\\n\\nPlease use the **Business Document Upload Center** below to begin.\`;
    } else if (signupStep === 131) {`;

app = app.split(targetBusinessUpload).join(replacementBusinessUpload);

fs.writeFileSync('src/App.tsx', app);
