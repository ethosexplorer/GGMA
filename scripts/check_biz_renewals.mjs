import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'email-audit');
const db = getFirestore(app);
const auth = getAuth(app);
await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

const snap = await getDocs(collection(db, 'crm_deals'));
const bizTypes = new Set(['dispensary', 'grower', 'processor', 'distribution', 'other', 'backoffice', 'business', 'business_owner']);

let verified = 0;
let unverified = 0;
let fabricated = 0;
let noEmail = 0;
let totalBiz = 0;

// Fabricated email detection (same patterns as MarketingHub)
const isFabricated = (email, name) => {
  if (!email) return false;
  const em = email.toLowerCase();
  const prefix = em.split('@')[0];
  const domain = (em.split('@')[1] || '').replace(/\.(com|org|net|gov)$/, '');
  if (['contact', 'appointments', 'info'].includes(prefix)) {
    const nameSlug = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
    if (nameSlug && domain && (domain.includes(nameSlug.substring(0, 8)) || nameSlug.includes(domain.substring(0, 8)))) return true;
  }
  return false;
};

const verifiedEmails = [];
const unverifiedSample = [];

snap.docs.forEach(d => {
  const data = d.data();
  if (!bizTypes.has(data.type)) return;
  totalBiz++;
  
  if (!data.email || !data.email.trim()) {
    noEmail++;
    return;
  }
  
  if (data.emailFabricated === true) {
    fabricated++;
    return;
  }
  
  if (isFabricated(data.email, data.businessName || data.name)) {
    fabricated++;
    return;
  }
  
  if (data.emailVerified === true) {
    verified++;
    verifiedEmails.push({ name: data.name, email: data.email, type: data.type, exp: data.licenseExpiration || 'none' });
  } else {
    unverified++;
    if (unverifiedSample.length < 15) {
      unverifiedSample.push({ name: data.name, email: data.email, type: data.type, exp: data.licenseExpiration || 'none' });
    }
  }
});

console.log('═══════════════════════════════════════════════════');
console.log('  BUSINESS EMAIL QUALITY AUDIT');
console.log('═══════════════════════════════════════════════════\n');
console.log(`Total business records:     ${totalBiz}`);
console.log(`No email at all:            ${noEmail} (${Math.round(100*noEmail/totalBiz)}%)`);
console.log(`Email flagged fabricated:    ${fabricated}`);
console.log(`Email VERIFIED (✓):         ${verified}`);
console.log(`Email unverified (no ✓):    ${unverified}`);
console.log(`\n═══ VERIFIED BUSINESS EMAILS (safe to send) ═══`);
verifiedEmails.slice(0, 20).forEach(e => {
  console.log(`  ✅ [${e.type}] ${e.name} → ${e.email} (exp: ${e.exp})`);
});
if (verifiedEmails.length > 20) console.log(`  ... and ${verifiedEmails.length - 20} more`);

// Check how many verified have expiration dates
const verifiedWithExp = verifiedEmails.filter(e => e.exp !== 'none');
console.log(`\nVerified + has licenseExpiration: ${verifiedWithExp.length}`);
const verifiedJuly2026 = verifiedWithExp.filter(e => e.exp.startsWith('2026-07'));
const verifiedJune2026 = verifiedWithExp.filter(e => e.exp.startsWith('2026-06'));
const verifiedAug2026 = verifiedWithExp.filter(e => e.exp.startsWith('2026-08'));
console.log(`  June 2026:  ${verifiedJune2026.length}`);
console.log(`  July 2026:  ${verifiedJuly2026.length}`);
console.log(`  Aug 2026:   ${verifiedAug2026.length}`);

console.log(`\n═══ SAMPLE UNVERIFIED EMAILS (risky to send) ═══`);
unverifiedSample.forEach(e => {
  console.log(`  ⚠️  [${e.type}] ${e.name} → ${e.email}`);
});

console.log('\n═══ BOTTOM LINE ═══');
console.log(`Only ${verified} verified business emails exist.`);
console.log(`${verifiedJuly2026.length} of those expire in July 2026.`);
console.log('The renewal audience needs email enrichment + verification before campaigns can run safely.');

process.exit(0);
