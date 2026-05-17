import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);

const CLINIC_HOOK = `Subject: Double your patient intake without hiring more staff.

Hi [Name],
Most cannabis clinics in [State] are wasting 10+ hours a week on manual patient verifications, filing out state registry forms, and chasing down payments.

GGP-OS is the operating system built specifically to automate your clinic.
• Automated SMS Reminders: Patients get texted a link to their forms.
• State Registry Integration: Automatically match conditions to your state's active requirements.
• Integrated Billing: Collect consultation fees before the patient even hits your Telehealth waiting room.

We are onboarding our final batch of beta partners in [State]. Try GGP-OS free for 30 Days. If it doesn't save you time and increase your pipeline, walk away.

[Start Your Free Trial Now] | [Book a 10-Min Demo]`;

const DISPENSARY_HOOK = `Subject: Are you miscalculating state cannabis tax exemptions?

Hi [Name],
Depending on your state, miscalculating a medical patient's tax exemption at checkout can result in severe state penalties—or worse, a loss of your business license.

GGP-OS takes the risk out of compliance. Our platform connects directly with state resources to ensure that every patient walking through your door is instantly verified for medical status, ensuring exact compliance with local tax code.

• Instant Verification: Don't guess if an out-of-state card is valid. We track state reciprocity laws in real-time.
• Pipeline CRM: See exactly who your highest-value patients are.
• Compliance Built-In: From METRC reporting to local authority requirements.

We are helping dispensaries like yours automate compliance. Start a 30-Day Free Trial today and let our team handle your custom state configuration.

[Claim Your Free Trial]`;

const ATTORNEY_HOOK = `Subject: Manage your clients' cannabis licensing & compliance from one dashboard.

Hi [Name],
As an attorney navigating the complex regulations of [State]'s cannabis program, managing permit renewals and METRC compliance for multiple clients is a massive administrative burden.

GGP-OS gives your firm a centralized Command Center.
Monitor your clients' regulatory standing, track changes in state and federal law, and automate document collection for licensing renewals all in one place.

Let's schedule a 10-minute walk-through to show you how law firms are using GGP-OS to manage their cannabis portfolios.

[Book a Walk-Through]`;

const TASKS = [
  { title: 'Email Blast: Clinics (OK, OH, PA)', date: '2026-05-18', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: CLINIC_HOOK },
  { title: 'Email Blast: Dispensaries (All)', date: '2026-05-19', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: DISPENSARY_HOOK },
  { title: 'Email Blast: Attorneys (CA, WA, IL)', date: '2026-05-20', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: ATTORNEY_HOOK },
  { title: 'Monitor Initial 30-Day Signups (All)', date: '2026-05-21', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Track early conversions and identify which state segment is reacting best.' },
  { title: 'Follow-up: Unopened Emails Sweep', date: '2026-05-22', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Resend hooks to contacts who did not open the first email.' },
  { title: 'Strategy Sync: Analyze First Week', date: '2026-05-23', startTime: '10:00', endTime: '11:00', category: 'executive', color: 'bg-purple-500', description: 'Why: Executive review of which hooks generated the most trial signups.' },
  { title: 'Prep Video Demos', date: '2026-05-24', startTime: '13:00', endTime: '15:00', category: 'task', color: 'bg-blue-500', description: 'Why: Record personalized 2-minute Looms for VIP targets.' },
  { title: 'Video Demo: Med-Only (WV, VA, UT, OH)', date: '2026-05-25', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Visual proof of automated compliance for non-clickers.' },
  { title: 'Video Demo: Dual-Use (VT, WA, CA)', date: '2026-05-26', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Visual proof of automated tax logic for non-clickers.' },
  { title: 'Video Demo: Clinics (OK, OH, PA)', date: '2026-05-27', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Show the SMS intake workflow to non-clickers.' },
  { title: 'Video Demo: Attorneys (CA, WA, IL)', date: '2026-05-28', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Show the multi-client dashboard to non-clickers.' },
  { title: 'Follow Up: Active Free Trials', date: '2026-05-29', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: White-glove onboarding secures long-term retention.' },
  { title: 'Prepare VIP Telephony List', date: '2026-05-30', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Focus high-touch sales effort on the top 50 highest revenue potential leads.' },
  { title: 'Call VIP Med-Only (WV, VA, UT, OH)', date: '2026-06-01', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss the immediate financial risk of state fines and audits.' },
  { title: 'Call VIP Dual-Use (VT, WA, CA)', date: '2026-06-02', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss lost revenue from miscalculated tax exemptions.' },
  { title: 'Call VIP Clinics (OK, OH, PA)', date: '2026-06-03', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss increasing daily patient throughput without hiring more staff.' },
  { title: 'Call VIP Attorneys (CA, WA, IL)', date: '2026-06-04', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: "Why: Discuss scaling their firm's client capacity." },
  { title: 'Live Walk-through Demos (Block A)', date: '2026-06-05', startTime: '09:00', endTime: '11:00', category: 'task', color: 'bg-blue-500', description: "Why: Close the interested leads gathered from the week's calls." },
  { title: 'Live Walk-through Demos (Block B)', date: '2026-06-06', startTime: '09:00', endTime: '11:00', category: 'task', color: 'bg-blue-500', description: "Why: Close the interested leads gathered from the week's calls." },
  { title: 'Week 2 Trial Check-in', date: '2026-06-07', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Verify successful first usage of platform to prevent churn.' },
  { title: 'Review CRM Conversion Metrics', date: '2026-06-08', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Determine which state segment performed best to focus FOMO efforts.' },
  { title: 'Draft FOMO "Beta Pricing" Copy', date: '2026-06-09', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Create urgency before standard pricing starts.' },
  { title: 'FOMO Blast to Dispensaries (All)', date: '2026-06-10', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { title: 'FOMO Blast to Clinics (All)', date: '2026-06-11', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { title: 'FOMO Blast to Attorneys (All)', date: '2026-06-12', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { title: 'Call High-Intent FOMO Clickers', date: '2026-06-13', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: "Why: Secure leads who clicked but didn't buy." },
  { title: 'Final Telephony Sweep', date: '2026-06-14', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Last-minute follow ups before trial expirations.' },
  { title: 'Convert Trials to Paid', date: '2026-06-15', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Lock in recurring revenue and charge setup fees.' },
];

async function run() {
  const eventsRef = collection(db, 'calendar_events');
  
  // Clear any existing marketing events to avoid duplicates
  const q = query(eventsRef, where('assignedBy', '==', 'Founder'));
  const snap = await getDocs(q);
  console.log(`Found ${snap.size} existing events. Deleting...`);
  
  const deletions = snap.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletions);
  console.log('Cleared existing events.');

  console.log(`Inserting ${TASKS.length} realtime events...`);
  const insertions = TASKS.map(task => 
    addDoc(eventsRef, {
      ...task,
      assignedTo: 'Founder',
      assignedBy: 'Founder', // This makes it visible to all executives
      createdAt: serverTimestamp()
    })
  );
  
  await Promise.all(insertions);
  console.log('Successfully inserted all 30 days of tasks to Firebase Realtime Database!');
  process.exit(0);
}

run().catch(console.error);
