/**
 * Save Marketing Email Templates — Top Grossing Dispensaries + Patient Med Cards
 * 
 * Usage: node scripts/save_email_templates.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'templates');
const db = getFirestore(app);
const auth = getAuth(app);

await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

// ═══════════════════════════════════════════════════════
// TEMPLATE 1: Top Grossing Dispensaries (B2B)
// ═══════════════════════════════════════════════════════
const topGrossingTemplate = {
  name: '💰 Top Grossing Dispensary Pitch',
  subject: 'Cut your compliance costs by 40% — see how top dispensaries are switching to GGP-OS',
  body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">

  <!-- Header Banner -->
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 32px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: white; letter-spacing: -0.5px;">Global Green Enterprise</h1>
    <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500;">The Operating System Built for Cannabis</p>
  </div>

  <!-- Body -->
  <div style="padding: 32px;">
    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1; margin-top: 0;">Hi there,</p>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;">I noticed your dispensary is one of the <strong style="color: #a5b4fc;">top-performing operations</strong> in the country. Congratulations — that kind of growth takes serious execution.</p>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;">But with growth comes complexity: <strong style="color: white;">compliance tracking, patient intake, multi-state licensing, marketing automation, staff management.</strong> Most operators are juggling 5-10 different tools to keep up.</p>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;"><strong style="color: white;">GGP-OS replaces all of them.</strong></p>

    <!-- Feature Blocks -->
    <div style="margin: 24px 0;">
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">✅ <strong style="color: white;">Automated Compliance</strong> — Real-time state registry matching across all jurisdictions</p>
      </div>
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">✅ <strong style="color: white;">Integrated Billing</strong> — Collect consultation fees before the patient hits your waiting room</p>
      </div>
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">✅ <strong style="color: white;">CRM + Marketing Hub</strong> — 35,000+ contacts, automated campaigns, SMS & email blasts</p>
      </div>
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8;">✅ <strong style="color: white;">TeleHealth + Call Center</strong> — Built-in patient intake with AI-assisted scheduling</p>
      </div>
    </div>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;">We're onboarding our final batch of enterprise partners this quarter. <strong style="color: #a5b4fc;">Try GGP-OS free for 30 days.</strong> If it doesn't save you time and increase your pipeline, walk away.</p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://www.ggp-os.com" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; font-weight: 800; font-size: 16px; padding: 16px 40px; border-radius: 12px; text-decoration: none; letter-spacing: 0.5px;">Start Your Free Trial →</a>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 24px;">
      <p style="font-size: 14px; color: #64748b; margin: 0;">
        📞 <a href="tel:18889634447" style="color: #818cf8; text-decoration: none;">1-888-963-4447</a> &nbsp;|&nbsp;
        🌐 <a href="https://www.ggp-os.com" style="color: #818cf8; text-decoration: none;">ggp-os.com</a> &nbsp;|&nbsp;
        📅 <a href="https://calendly.com/globalgreenhpmeet/gghp-demo" style="color: #818cf8; text-decoration: none;">Book a 10-Min Demo</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: rgba(0,0,0,0.3); padding: 20px 32px; text-align: center;">
    <p style="margin: 0; font-size: 11px; color: #475569;">© 2026 Global Green Enterprise. All rights reserved.</p>
  </div>
</div>`,
  createdAt: serverTimestamp()
};

// ═══════════════════════════════════════════════════════
// TEMPLATE 2: Oklahoma Patient Med Cards
// ═══════════════════════════════════════════════════════
const patientMedCardTemplate = {
  name: '🩺 Patient Med Card Renewal',
  subject: 'Your Oklahoma medical card — renew in 5 minutes from your phone',
  body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">

  <!-- Header Banner -->
  <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 32px; text-align: center;">
    <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: white;">🩺 Oklahoma Medical Card</h1>
    <p style="margin: 8px 0 0; font-size: 15px; color: rgba(255,255,255,0.9); font-weight: 600;">Renew or Apply in Minutes — 100% Online</p>
  </div>

  <!-- Body -->
  <div style="padding: 32px;">
    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1; margin-top: 0;">Hi there,</p>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;">Whether your OMMA card is <strong style="color: #6ee7b7;">expiring soon</strong>, already expired, or you're applying for the first time — we make it effortless.</p>

    <!-- Steps -->
    <div style="margin: 24px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div style="min-width: 40px; height: 40px; background: rgba(16,185,129,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981; font-size: 18px; margin-right: 16px;">1</div>
        <p style="margin: 0; font-size: 15px; color: #cbd5e1;"><strong style="color: white;">Fill out a quick form</strong> — takes less than 5 minutes</p>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div style="min-width: 40px; height: 40px; background: rgba(16,185,129,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981; font-size: 18px; margin-right: 16px;">2</div>
        <p style="margin: 0; font-size: 15px; color: #cbd5e1;"><strong style="color: white;">Video consult with a licensed physician</strong> — from your phone or computer</p>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div style="min-width: 40px; height: 40px; background: rgba(16,185,129,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #10b981; font-size: 18px; margin-right: 16px;">3</div>
        <p style="margin: 0; font-size: 15px; color: #cbd5e1;"><strong style="color: white;">Get your recommendation same day</strong> — we handle the OMMA submission</p>
      </div>
    </div>

    <!-- Pricing Box -->
    <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1)); border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; font-size: 12px; color: #6ee7b7; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">Consultation Fee</p>
      <p style="margin: 0; font-size: 36px; font-weight: 900; color: white;">$75</p>
      <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">New patients & renewals • No hidden fees</p>
    </div>

    <p style="font-size: 16px; line-height: 1.7; color: #cbd5e1;">Don't let your card lapse — <strong style="color: #6ee7b7;">protect your access today.</strong></p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://www.ggp-os.com" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; font-weight: 800; font-size: 16px; padding: 16px 40px; border-radius: 12px; text-decoration: none; letter-spacing: 0.5px;">Start My Application →</a>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 24px;">
      <p style="font-size: 14px; color: #64748b; margin: 0;">
        📞 <a href="tel:18889634447" style="color: #6ee7b7; text-decoration: none;">1-888-963-4447</a> &nbsp;|&nbsp;
        🌐 <a href="https://www.ggp-os.com" style="color: #6ee7b7; text-decoration: none;">ggp-os.com</a> &nbsp;|&nbsp;
        📅 <a href="https://calendly.com/globalgreenhpmeet/gghp-demo" style="color: #6ee7b7; text-decoration: none;">Schedule a Call</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background: rgba(0,0,0,0.3); padding: 20px 32px; text-align: center;">
    <p style="margin: 0; font-size: 11px; color: #475569;">© 2026 Global Green Enterprise. All rights reserved.</p>
  </div>
</div>`,
  createdAt: serverTimestamp()
};

// Save both
console.log('💾 Saving email templates...\n');

const doc1 = await addDoc(collection(db, 'marketing_templates'), topGrossingTemplate);
console.log(`✅ Saved: "${topGrossingTemplate.name}" (${doc1.id})`);

const doc2 = await addDoc(collection(db, 'marketing_templates'), patientMedCardTemplate);
console.log(`✅ Saved: "${patientMedCardTemplate.name}" (${doc2.id})`);

console.log('\n🎉 Both templates ready in Marketing Hub → "Use Template"');
process.exit(0);
