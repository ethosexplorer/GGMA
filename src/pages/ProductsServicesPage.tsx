import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Cpu, CheckCircle, Stethoscope, Wallet, Building2, ArrowLeft, Smartphone, GraduationCap, BookOpen, ChevronLeft, ChevronRight, X, FileText, Copy, Check } from 'lucide-react';

/* ── Paid Subscription Confirmation & Service Agreement Modal ── */
const SubscriptionLetterModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState('patient');
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const plans: Record<string, {
    title: string; tier: string; price: string; annual: string; savings: string;
    billing: string; trialTerms: string; setup: string; training: string; goLive: string;
    features: string[]; sla: string; supportTier: string; dedicatedRep: string;
    disclosures: string[];
  }> = {
    patient: {
      title: 'Patient / Consumer Subscription', tier: 'Individual',
      price: '$49.99/mo', annual: '$479.88/yr', savings: '$119.88',
      billing: 'Monthly auto-renewal via ACH, debit card, or credit card (Visa/MC).',
      trialTerms: '30-day free trial. No charge until Day 31. Cancel anytime during trial at no cost.',
      setup: 'Instant — self-serve account creation, no approval wait',
      training: 'Self-serve tutorials, Sylara AI guided onboarding, in-app walkthroughs',
      goLive: 'Same day — immediate full platform access upon registration',
      features: ['Medical card application sync & state portal integration (all 50 states + tribal nations)', 'Telehealth physician scheduling & HIPAA-compliant video consultations', 'Care Wallet stored value account (Bronze tier included, upgradeable)', 'Sylara AI personal assistant — medication reminders, appointment scheduling, compliance alerts', 'Document vault — encrypted storage for medical records, prescriptions, and legal documents', 'Compliance tracker — license renewal alerts, state requirement changes, expiration notices', 'C3 Credit Scoring — cannabis-specific credit assessment and financial health tools', 'Legal & Attorney Marketplace — direct access to vetted cannabis attorneys', 'Prescription & recommendation management with provider-verified digital records', 'Community forums & advocacy tools access'],
      sla: '99.5% platform uptime. Standard support response within 24 business hours.',
      supportTier: 'Standard — Email & in-app chat support, Mon–Fri 8AM–8PM CT',
      dedicatedRep: 'No — AI-assisted support via Sylara + email escalation',
      disclosures: ['Telehealth services are facilitated through independently licensed, board-certified healthcare providers. GGE does not provide medical care directly. Telehealth consultations do not replace emergency medical services — if you are experiencing a medical emergency, call 911.', 'Care Wallet is a closed-loop stored value product for use within the GGP ecosystem only. It is NOT a bank account, savings account, or money market account. FDIC insurance does NOT apply to Care Wallet balances. Stored value may not be converted to cash or transferred outside the ecosystem.', 'Medical card application fees are set by individual state authorities (e.g., Oklahoma: $104.30 new / $22.50 renewal) and are collected separately from this subscription. GGE charges a $10 processing fee per application submission.', 'All patient health data is classified as Protected Health Information (PHI) under HIPAA and is encrypted using AES-256 encryption at rest and TLS 1.3 encryption in transit. GGE maintains a signed Business Associate Agreement (BAA) with all data processors.', 'C3 Credit Scoring is an internal assessment tool and is not reported to major credit bureaus (Equifax, Experian, TransUnion). C3 scores do not affect your traditional credit score.'],
    },
    business: {
      title: 'Business / Dispensary Subscription', tier: 'Commercial',
      price: '$199/mo', annual: '$1,910.40/yr', savings: '$477.60',
      billing: 'Monthly auto-renewal via ACH, credit card (Visa/MC), or invoice (Net 30 available for annual commitments).',
      trialTerms: '30-day free trial with full feature access. POS system configured during trial. No charge until Day 31.',
      setup: '1–2 weeks — includes Metrc API integration, SINC POS configuration, inventory import/migration, barcode system setup, and staff account creation',
      training: '3–5 business days — dedicated onboarding specialist assigned. Includes: POS training for all staff, Metrc compliance walkthrough, inventory management training, and reporting dashboard orientation.',
      goLive: '2–3 weeks — full operational readiness verified. Includes compliance checklist sign-off, test transactions, and Metrc sync validation.',
      features: ['SINC POS system — card-ready terminal with Metrc integration, real-time inventory deductions', 'Real-time Metrc seed-to-sale synchronization — automated manifest creation and transfer logging', 'Inventory management & barcode tracking — SKU management, low-stock alerts, batch tracking', 'Larry AI compliance monitoring — real-time violation detection, automated corrective action alerts', 'Automated state reporting — daily/weekly/monthly compliance reports generated and filed', 'Tax filing integration — automated sales tax calculation and reporting by jurisdiction', 'Employee management — role-based access control (Manager, Budtender, Inventory, Admin)', 'Revenue analytics & margin optimization — product performance, peak hours, customer trends', 'Customer loyalty program — points system, visit tracking, and retention tools', 'Multi-location support — additional locations at $99/mo each with centralized dashboard', 'Insurance-grade transaction records with 7-year retention'],
      sla: '99.7% platform uptime. POS system guaranteed 99.9% during business hours. Priority support response within 4 business hours.',
      supportTier: 'Priority — Phone, email & chat support. Dedicated onboarding specialist for first 60 days.',
      dedicatedRep: 'Yes — Assigned account manager for first 90 days, then on-demand',
      disclosures: ['Business subscribers must maintain an active state cannabis license in good standing for the duration of their subscription. License suspension or revocation may result in service restriction pending regulatory resolution.', 'Metrc integration requires valid API credentials issued by your state regulatory authority. GGE does not provide Metrc credentials — contact your state cannabis authority to obtain them.', 'POS transactions processed through Authorize.net. Standard processing fees: 2.9% + $0.30 per card transaction; 1.0% for ACH/bank transfers. These fees are charged by the payment processor and are separate from subscription costs.', 'Larry AI compliance monitoring is an advisory tool designed to flag potential violations. It does NOT constitute legal counsel, regulatory guidance, or a guarantee of compliance.', 'Inventory data is backed up every 6 hours with 90-day retention. Data export available in CSV, JSON, and PDF formats.', 'Multi-location pricing: Each additional location beyond the first is billed at $99/mo with shared dashboard access.'],
    },
    provider: {
      title: 'Provider / Physician Subscription', tier: 'Professional',
      price: '$99/mo', annual: '$950.40/yr', savings: '$237.60',
      billing: 'Monthly auto-renewal via ACH or credit card.',
      trialTerms: '30-day free trial. Credential verification begins during trial — no charge until verified and Day 31.',
      setup: '2–3 business days — includes credential verification (medical license, DEA registration), practice profile configuration, telehealth room setup',
      training: '1–2 business days — HIPAA compliance orientation, telehealth platform walkthrough, digital prescribing tools training',
      goLive: '1 week — upon successful credential verification and state licensing confirmation.',
      features: ['Patient roster management & intelligent scheduling with automated reminders', 'HIPAA-compliant telehealth video consultations — HD video, screen sharing, document review', 'Digital recommendation & prescription workflows with state-specific templates', 'Sylara AI clinical decision support — drug interactions, dosing guidance, contraindication alerts', 'Compliance & licensing tracker with 90/60/30-day renewal alerts', 'Secure messaging with patients — HIPAA-compliant, encrypted, audit-logged', 'DEA registration & prescribing integration', 'Revenue reporting & consultation analytics — billable hours, patient volume, revenue trends', 'E-signature capability for recommendations and consent forms', 'Multi-state practice support — manage licenses across jurisdictions'],
      sla: '99.7% platform uptime. Telehealth video guaranteed 99.9% during scheduled consultations. Support response within 4 business hours.',
      supportTier: 'Priority — Phone & email support. HIPAA officer available for compliance questions.',
      dedicatedRep: 'Yes — Dedicated practice success manager for first 60 days',
      disclosures: ['Providers must hold active, unrestricted medical licenses in their practicing state(s). GGE verifies credentials through primary source verification.', 'All telehealth consultations must comply with state-specific telemedicine regulations including informed consent, prescribing limitations, and documentation requirements.', 'Sylara AI clinical decision support is an advisory tool only. It does NOT replace clinical judgment, establish a standard of care, or create a physician-patient relationship.', 'A HIPAA Business Associate Agreement (BAA) is executed upon account activation. GGE maintains SOC 2 Type II compliance and undergoes annual HIPAA audits.', 'Telehealth consultation recordings (when enabled by patient consent) are stored encrypted for 7 years per HIPAA retention requirements.', 'Malpractice insurance is the provider\'s responsibility. GGE does not provide professional liability coverage.'],
    },
    attorney: {
      title: 'Attorney / Legal Professional Subscription', tier: 'Professional',
      price: '$149/mo', annual: '$1,430.40/yr', savings: '$357.60',
      billing: 'Monthly auto-renewal via ACH or credit card.',
      trialTerms: '30-day free trial. Bar membership verification begins during trial — no charge until verified and Day 31.',
      setup: '2–3 business days — includes bar admission verification, practice area configuration, marketplace listing setup',
      training: '1–2 business days — dashboard walkthrough, client intake pipeline setup, marketplace optimization, document portal training',
      goLive: '1 week — upon successful bar admission verification and profile approval',
      features: ['Legal marketplace listing & lead generation — profile visibility to 50,000+ platform users', 'Case management dashboard — matter tracking, deadlines, court dates, and task management', 'Regulatory intelligence feeds — federal & state cannabis law updates, scheduling changes, proposed legislation', 'Larry AI legal compliance monitoring — contract review assist, regulatory change alerts', 'Client billing & invoicing tools — hourly tracking, flat fee, retainer management, payment processing', 'Secure document portal & e-signatures — client-facing, encrypted, audit-logged', 'Multi-jurisdiction tracking — manage bar admissions, CLE requirements, and deadlines across states', 'CLE credit tracking & calendar integration', 'Client conflict checking tool', 'Template library — cannabis-specific contracts, licensing applications, compliance checklists'],
      sla: '99.7% platform uptime. Support response within 4 business hours.',
      supportTier: 'Priority — Phone & email support during business hours.',
      dedicatedRep: 'Yes — Practice development specialist for first 60 days',
      disclosures: ['Attorney subscribers must hold active bar membership in at least one U.S. jurisdiction. GGE verifies bar status.', 'Legal marketplace leads are distributed based on practice area, geographic location, client type match, and availability. GGE does NOT guarantee a minimum number of client referrals, leads, or revenue.', 'Larry AI legal tools are informational only. They do NOT constitute legal advice, create an attorney-client relationship, or establish attorney-client privilege.', 'Client communications through the platform\'s secure messaging are encrypted but may not be protected by attorney-client privilege in all jurisdictions.', 'GGE is not a law firm, does not practice law, and does not provide legal opinions. The marketplace is a technology platform only.', 'Fee splitting arrangements through the platform must comply with your state bar\'s rules of professional conduct (typically Rule 5.4).'],
    },
    advocacy: {
      title: 'Advocacy & Research Subscription', tier: 'Standard',
      price: '$79/mo', annual: '$758.40/yr', savings: '$189.60',
      billing: 'Monthly auto-renewal via ACH or credit card.',
      trialTerms: '30-day free trial with full data access. No charge until Day 31.',
      setup: 'Instant — self-serve account creation with immediate dashboard access',
      training: 'Self-serve tutorials, Sylara AI guided onboarding, data export walkthrough',
      goLive: 'Same day — immediate access to all dashboards, analytics, and data exports',
      features: ['Anonymized health demographic data access — population-level insights across 50 states', 'Safety & outcome reporting tools — adverse event tracking, product safety signals', 'Policy impact analysis dashboards — legislative tracker, economic impact modeling', 'Research data export (CSV, JSON, API) — bulk download with proper citation requirements', 'Community engagement analytics — public comment tracking, constituent sentiment', 'Legislative tracking & alerts — bill status, committee hearings, vote schedules', 'Public comment management — draft, submit, and track regulatory comments', 'Grant & funding opportunity feeds — federal, state, and foundation grant listings', 'Collaboration tools — share dashboards, co-author reports, peer review'],
      sla: '99.5% platform uptime. Standard support response within 24 business hours.',
      supportTier: 'Standard — Email & in-app chat support, Mon–Fri 8AM–8PM CT',
      dedicatedRep: 'No — AI-assisted support via Sylara + email escalation',
      disclosures: ['All research data provided through this subscription is anonymized and de-identified in compliance with HIPAA Safe Harbor method (45 CFR §164.514(b)(2)).', 'Data exports are subject to the GGP-OS Acceptable Use Policy. Research data may NOT be resold, sublicensed, or distributed commercially without express written consent from GGE.', 'Policy analysis tools are informational and do not represent official government positions, legal interpretations, or regulatory guidance.', 'API access is rate-limited to 1,000 requests/day (Standard tier). Enterprise API plans available for high-volume research needs.', 'Citation requirement: All publications using GGP-OS data must include: "Data provided by Global Green Platform Operating System (GGP-OS), Global Green Enterprise Inc."'],
    },
    lab: {
      title: 'Independent Lab Subscription', tier: 'Enterprise',
      price: '$499/mo', annual: '$4,790.40/yr', savings: '$1,197.60',
      billing: 'Monthly auto-renewal via ACH, credit card, or invoice. Net 30 terms available for annual commitments.',
      trialTerms: '30-day free trial with full feature access. Lab accreditation verified during trial. No charge until verified and Day 31.',
      setup: '2–4 weeks — includes lab accreditation verification (ISO 17025, DEA Schedule I), LIMS integration, COA template configuration',
      training: '1 week — dedicated lab onboarding specialist. Includes: COA processing workflows, accreditation tracking setup, contaminant alert configuration.',
      goLive: '4–6 weeks — includes test data migration, COA validation testing, contaminant alert calibration, and production-readiness verification',
      features: ['COA upload, validation & auto-scan engine — PDF, XML, and API ingest with automated limit checking', 'Accreditation tracking — ISO 17025, DEA Schedule I, state licenses with 90/60/30-day renewal alerts', 'Contaminant flagging — heavy metals, pesticide residue, microbial pathogens, mycotoxins, residual solvents', 'Automated recall alert system — triggered when COA results exceed state limits, notifies affected chain', 'Statewide pass rate analytics — benchmarking against state averages, trend analysis, seasonal patterns', 'Recency Index (RI) field test integration — dual-channel device pairing and cloud sync (when available)', 'Larry AI compliance monitoring — state regulation changes, testing methodology updates', 'Multi-state compliance matrix — track requirements across all jurisdictions where you operate', 'API access for LIMS integration — REST API with webhook notifications', 'Chain of custody documentation — digital chain from sample receipt to final report', 'Proficiency testing tracking and result management'],
      sla: '99.9% platform uptime with 4-hour maximum unscheduled downtime per month. Priority support response within 2 business hours. Critical issues (COA processing failures) within 1 hour.',
      supportTier: 'Premium — Phone, email & chat support. Dedicated lab success manager. After-hours emergency line for COA processing issues.',
      dedicatedRep: 'Yes — Named lab success manager for duration of subscription + technical integration engineer during setup',
      disclosures: ['Lab subscribers must maintain valid ISO 17025 accreditation OR active state laboratory license for the duration of the subscription.', 'COA auto-validation is an advisory quality assurance tool. It does NOT replace official laboratory certification, proficiency testing, or state regulatory oversight.', 'Contaminant thresholds are configured based on state-specific regulatory limits and are updated quarterly. It is the lab\'s responsibility to verify threshold accuracy.', 'Data retention: All COA records, test results, and chain of custody documentation are retained for a minimum of 3 years per federal requirements.', 'LIMS API integration: GGE provides RESTful API access. Integration development is the lab\'s responsibility unless Professional Services engagement is purchased separately ($150/hr).', 'Recency Index device integration is subject to device availability (Coming Soon). This subscription includes software readiness; hardware is priced separately when available.'],
    },
    government: {
      title: 'Government & Enterprise Subscription', tier: 'Enterprise / Custom',
      price: 'Custom — Starting from $999/mo', annual: 'Custom annual pricing with 20% discount', savings: 'Varies by contract',
      billing: 'Monthly, quarterly, or annual via ACH, wire transfer, or government purchase order. Net 30/60/90 terms available. GSA Schedule pricing available upon request.',
      trialTerms: '60-day pilot program with limited scope. Full security assessment and ATO (Authority to Operate) review during pilot.',
      setup: '4–20 weeks — varies by agency size and integration scope. Includes: security assessment (FISMA/FedRAMP review), data migration plan, legacy system integration',
      training: '2–10 weeks — role-based training for all staff levels. Includes: executive briefings, administrator training, end-user training, train-the-trainer certification.',
      goLive: '8–30 weeks — phased rollout. Phase 1: Core platform access. Phase 2: Data migration & integration. Phase 3: Staff training & UAT. Phase 4: Production launch.',
      features: ['Unified licensing & regulatory portal — single-pane-of-glass for all licensee management', 'Metrc / state-system integration — bidirectional data sync with existing state tracking systems', 'Multi-agency compliance monitoring dashboards — customizable KPIs, alerts, and reporting', 'Larry AI enforcement intelligence — pattern detection, anomaly flagging, risk scoring', 'Public transparency & reporting tools — citizen-facing compliance data, FOIA-ready exports', 'Inter-agency coordination suite — secure messaging, shared dashboards, joint investigations', 'SAM.gov & federal procurement compliance — CAGE code integration, contract tracking', 'Custom SLA — tailored uptime, support, and response time guarantees', 'Dedicated account management — named team including project manager, technical lead, and executive sponsor', 'White-glove implementation — GGE project team on-site or virtual for full deployment lifecycle', 'Custom reporting & data warehouse integration', 'Role-based access control with agency-specific permission hierarchies', 'Audit logging & compliance reporting (FISMA, SOC 2, FedRAMP)'],
      sla: '99.9% guaranteed uptime with custom SLA penalties. 1-hour response for critical issues. Dedicated support pod assigned to agency.',
      supportTier: 'Enterprise — 24/7 phone, email & chat support. Named support pod. Executive escalation path. On-site support available.',
      dedicatedRep: 'Yes — Full account team: Executive Sponsor, Project Manager, Technical Lead, Training Coordinator.',
      disclosures: ['Government contracts are subject to individual agency procurement requirements including competitive bidding, sole source justification, and approval workflows.', 'GGE is a registered federal supplier — CAGE Code: 9KXZ2 | SAM.gov: Active Registration | DUNS: Registered.', 'Security & compliance: SOC 2 Type II certified (current). FedRAMP authorization in process. Annual HIPAA audits conducted by independent third party.', 'Data sovereignty: Government data is stored in US-based data centers only. Agency-specific data isolation available upon request.', 'Custom SLAs include 99.9% uptime guarantee with financial service credits for unscheduled downtime exceeding SLA thresholds.', 'Government pricing is available through GSA Schedule, direct contract, or cooperative purchasing agreements (NASPO, OMNIA, Sourcewell).', 'All government deployments include a formal Authority to Operate (ATO) package preparation assistance and security documentation.'],
    },
  };

  const plan = plans[selectedPlan];
  const sep = '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501';

  const letterText = [
    '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
    '\u2551     GLOBAL GREEN ENTERPRISE INC.                           \u2551',
    '\u2551     SUBSCRIPTION CONFIRMATION & SERVICE AGREEMENT          \u2551',
    '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
    '', `Date Issued: ${today}`, `Subscription ID: GGE-SUB-${Date.now().toString(36).toUpperCase()}`, `Plan: ${plan.title}`, `Tier: ${plan.tier}`,
    '', 'Dear Valued Subscriber,', '',
    `Thank you for subscribing to the ${plan.title} on the Global Green Hybrid Platform (GGP-OS). This document serves as your official subscription confirmation and service agreement. Please retain this letter for your records.`,
    '', '', sep, 'SECTION 1: SUBSCRIPTION & PRICING', sep, '',
    `Plan Name:       ${plan.title}`, `Subscription Tier: ${plan.tier}`, `Monthly Rate:    ${plan.price}`, `Annual Rate:     ${plan.annual}`, `Annual Savings:  ${plan.savings}`, '', `Billing Terms: ${plan.billing}`, '', `Free Trial: ${plan.trialTerms}`,
    '', '', sep, 'SECTION 2: IMPLEMENTATION TIMELINE & MILESTONES', sep, '',
    `Setup & Build:   ${plan.setup}`, '', `Training:        ${plan.training}`, '', `Go-Live:         ${plan.goLive}`,
    '', '', sep, 'SECTION 3: INCLUDED FEATURES & SERVICES', sep, '',
    ...plan.features.map((f, i) => `  ${i + 1}. ${f}`),
    '', '', sep, 'SECTION 4: SERVICE LEVEL AGREEMENT (SLA)', sep, '',
    `Uptime & Response: ${plan.sla}`, '', `Support Level:     ${plan.supportTier}`, '', `Dedicated Rep:     ${plan.dedicatedRep}`,
    '', '', sep, 'SECTION 5: ACCOUNT ACCESS', sep, '',
    'Platform URL:   https://ggp-os.com', 'Login Email:    [Your registered email address]', 'Password:       [Set during registration \u2014 change upon first login]', '',
    'SECURITY REQUIREMENTS:', '  \u2022 Change your password upon first login', '  \u2022 Enable two-factor authentication (2FA)', '  \u2022 Do not share login credentials with unauthorized personnel', '  \u2022 Report any suspected unauthorized access immediately to security@ggp-os.com',
    '', '', sep, 'SECTION 6: BILLING, RENEWAL & CANCELLATION POLICY', sep, '',
    'AUTO-RENEWAL:', '  Your subscription automatically renews at the end of each billing', '  cycle (monthly, quarterly, or annual) at the then-current rate.', '  You will receive an email reminder 7 days before each renewal.', '',
    'BILLING CYCLES & DISCOUNTS:', '  \u2022 Monthly \u2014 Standard rate, billed on the same date each month', '  \u2022 Quarterly \u2014 10% discount applied, billed every 3 months', '  \u2022 Annual \u2014 20% discount applied, billed once per year', '',
    'CANCELLATION:', '  \u2022 You may cancel at any time through your account settings or by', '    calling 1-888-963-4447.', '  \u2022 Cancellation takes effect at the end of the current billing period.', '  \u2022 You retain access to all features until the end of your paid period.', '  \u2022 A 30-day written notice is required for annual plan cancellations.', '',
    'REFUND POLICY:', '  \u2022 30-day free trial: No charge if cancelled within the trial period.', '  \u2022 Monthly plans: No partial-month refunds.', '  \u2022 Annual plans: Prorated refund available within first 90 days of', '    paid service. After 90 days, no refund \u2014 access continues through', '    the end of the annual period.', '  \u2022 Government contracts: Refund terms per individual contract agreement.', '',
    'FAILED PAYMENTS:', '  \u2022 If payment fails, you will receive email notification immediately.', '  \u2022 A 7-day grace period is provided to update payment information.', '  \u2022 After 7 days, account access is suspended (not deleted).', '  \u2022 After 30 days of non-payment, account is deactivated. Data is', '    retained for 90 days per our data retention policy.', '',
    'PRICE CHANGES:', '  \u2022 GGE reserves the right to modify subscription pricing.', '  \u2022 You will receive 60 days advance written notice of any price change.', '  \u2022 Price changes do not affect current annual commitments until renewal.',
    '', '', sep, 'SECTION 7: DATA PRIVACY, SECURITY & COMPLIANCE', sep, '',
    'DATA ENCRYPTION:', '  \u2022 At Rest: AES-256 encryption for all stored data', '  \u2022 In Transit: TLS 1.3 for all data transmission', '  \u2022 Backups: Encrypted, geographically redundant, tested monthly', '',
    'HIPAA COMPLIANCE:', '  \u2022 GGE maintains full HIPAA compliance for all health-related data', '  \u2022 Business Associate Agreements (BAA) executed with all data processors', '  \u2022 Annual third-party HIPAA audit conducted', '  \u2022 Breach notification within 60 days per HITECH Act requirements', '',
    'CERTIFICATIONS & STANDARDS:', '  \u2022 SOC 2 Type II \u2014 Current certification', '  \u2022 FedRAMP \u2014 Authorization in progress', '  \u2022 ISO 27001 \u2014 Aligned security controls', '  \u2022 FISMA \u2014 Compliance documentation available for government subscribers', '',
    'DATA RETENTION:', '  \u2022 Active accounts: Data retained for duration of subscription', '  \u2022 After cancellation: Data retained for 90 days, then permanently deleted', '  \u2022 Health records: Minimum 7-year retention per HIPAA requirements', '  \u2022 COA/Lab records: Minimum 3-year retention per federal requirements', '  \u2022 You may request data export at any time (CSV, JSON, or PDF formats)', '',
    'DATA OWNERSHIP:', '  \u2022 You retain full ownership of all data you submit to the platform', '  \u2022 GGE does not sell, share, or monetize your personal or business data', '  \u2022 Anonymized, aggregated data may be used for platform improvement and', '    public health research (with identifying information removed)',
    '', '', sep, 'SECTION 8: PLAN-SPECIFIC DISCLOSURES', sep, '',
    ...plan.disclosures.map((d, i) => `  ${i + 1}. ${d}`),
    '', '', sep, 'SECTION 9: ACCEPTABLE USE POLICY', sep, '',
    'As a subscriber, you agree NOT to:', '  \u2022 Use the platform for any illegal activity under federal or state law', '  \u2022 Attempt to access other users\' accounts or data', '  \u2022 Reverse engineer, decompile, or disassemble any platform software', '  \u2022 Resell, sublicense, or redistribute platform access or data', '  \u2022 Use automated bots or scripts to scrape platform data', '  \u2022 Transmit malware, viruses, or other harmful code', '  \u2022 Misrepresent your identity, credentials, or licensing status', '', 'Violation of this Acceptable Use Policy may result in immediate', 'account suspension or termination without refund.',
    '', '', sep, 'SECTION 10: LIMITATION OF LIABILITY', sep, '',
    'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:', '', '  \u2022 GGE\'s total liability for any claims arising from this subscription', '    shall not exceed the total fees paid by subscriber in the 12 months', '    preceding the claim.', '  \u2022 GGE is not liable for indirect, incidental, special, consequential,', '    or punitive damages, including lost profits, lost data, or business', '    interruption.', '  \u2022 GGE is not liable for actions of third-party service providers', '    (payment processors, telehealth providers, state regulatory systems).', '  \u2022 GGE does not guarantee specific business outcomes, revenue increases,', '    client acquisition, or regulatory approval.',
    '', '', sep, 'SECTION 11: GOVERNING LAW & DISPUTE RESOLUTION', sep, '',
    '  \u2022 This agreement is governed by the laws of the State of Oklahoma.', '  \u2022 Any disputes shall first be addressed through good-faith negotiation.', '  \u2022 If negotiation fails, disputes shall be resolved through binding', '    arbitration in Oklahoma City, Oklahoma under AAA Commercial Rules.', '  \u2022 Class action waiver: All disputes must be brought individually.', '  \u2022 Sovereign immunity: Tribal government subscribers retain all', '    sovereign immunity rights. Tribal disputes addressed through', '    tribal court or mutually agreed alternative dispute resolution.',
    '', '', sep, 'SECTION 12: AMENDMENTS & MODIFICATIONS', sep, '',
    '  \u2022 GGE may update these terms with 30 days advance written notice.', '  \u2022 Material changes require affirmative consent (click-through acceptance).', '  \u2022 Continued use after notification constitutes acceptance of updated terms.', '  \u2022 You may reject material changes by cancelling your subscription within', '    30 days of notification at no penalty.',
    '', '', sep, 'SECTION 13: SUPPORT & CONTACT INFORMATION', sep, '',
    '  \uD83D\uDCDE Toll-Free:     1-888-963-4447', '  \uD83D\uDCF1 Direct Line:   645-246-8277', '  \uD83D\uDCE7 Support Email:  asstsupport@gmail.com', '  \uD83C\uDF10 Platform:      https://ggp-os.com', '  \uD83D\uDD50 Support Hours:  Mon\u2013Fri 8:00 AM \u2013 8:00 PM CT', '                     Sat 10:00 AM \u2013 4:00 PM CT', '                     Enterprise: 24/7', '',
    'ESCALATION PATH:', '  Level 1: Support Team (email/chat) \u2014 Response within 24 hours', '  Level 2: Account Manager (phone) \u2014 Response within 4 hours', '  Level 3: VP of Operations \u2014 Response within 2 hours', '  Level 4: CEO (Shantell Robinson) \u2014 Critical issues only',
    '', '', sep, 'COMPANY INFORMATION', sep, '',
    '  Company:     Global Green Enterprise Inc.', '  Entity Type: Registered Oklahoma Corporation', '  CAGE Code:   9KXZ2', '  DUNS:        Registered', '  SAM.gov:     Active Registration', '  EIN:         On File', '  Tribal Affiliation: Recognized tribal partner organization',
    '', '', sep, '', 'By subscribing to this plan, you acknowledge that you have read,', 'understood, and agree to all terms, disclosures, and policies', 'outlined in this Subscription Confirmation & Service Agreement.', '', '',
    'Warm regards,', '', 'Shantell Robinson', 'Founder & CEO', 'Global Green Enterprise Inc.', '"Bridging Indigenous and Federal \u2014 On Equal Ground"',
    '', sep, `Document generated: ${today}`, '\u00A9 2024\u20132026 Global Green Enterprise Inc. All rights reserved.', sep,
  ].join('\n');

  const handleCopy = () => { navigator.clipboard.writeText(letterText); setCopied(true); setTimeout(() => setCopied(false), 3000); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 flex items-center justify-between shrink-0 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center"><FileText size={22} className="text-white" /></div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Subscription Confirmation & Service Agreement</h2>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Paid Subscription — Complete Terms, Disclosures & SLA</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"><X size={18} /></button>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-wrap shrink-0">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">Select Plan:</span>
          {[{id:'patient',label:'\uD83C\uDFE5 Patient',price:'$49.99'},{id:'business',label:'\uD83C\uDFE2 Business',price:'$199'},{id:'provider',label:'\uD83E\uDE7A Provider',price:'$99'},{id:'attorney',label:'\u2696\uFE0F Attorney',price:'$149'},{id:'advocacy',label:'\uD83D\uDCCA Advocacy',price:'$79'},{id:'lab',label:'\uD83E\uDDEA Lab',price:'$499'},{id:'government',label:'\uD83C\uDFDB\uFE0F Gov/Enterprise',price:'Custom'}].map(p => (
            <button key={p.id} onClick={() => setSelectedPlan(p.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlan === p.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'}`}>{p.label} <span className="text-[9px] opacity-70">{p.price}/mo</span></button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-[1.7] selection:bg-indigo-200">{letterText}</div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 font-bold">This is a preview template. Personalized upon subscriber enrollment from Account Lookup.</p>
            <p className="text-[9px] text-slate-400">13 sections &bull; Billing, SLA, HIPAA, Disclosures, Liability, Governing Law & more</p>
          </div>
          <button onClick={handleCopy} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {copied ? <><Check size={14} /> Copied to Clipboard!</> : <><Copy size={14} /> Copy Full Agreement</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const SECTIONS = [
  { id: 'platform', label: 'Platform Subscriptions', icon: '⚙️' },
  { id: 'professional', label: 'Professional Services', icon: '🩺' },
  { id: 'lab_health', label: 'Lab & Public Health', icon: '🔬' },
  { id: 'health_addons', label: 'Health Add-Ons', icon: '🏥' },
  { id: 'rapid_testing', label: 'Rapid Testing', icon: '📱' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'care_wallet', label: 'Care Wallet', icon: '💳' },
  { id: 'government', label: 'Government', icon: '🏛️' },
];

/* ── comprehensive plan details table ────────────── */
const PlanDetailsTable = ({ tiers }: { tiers: { name: string; setup: string; training: string; goLive: string; monthly: string; quarterly: string; annual: string; savings?: string }[] }) => (
  <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-left px-4 py-3 font-black text-slate-700 uppercase tracking-widest text-[10px] sticky left-0 bg-slate-50 z-10">Plan</th>
          <th className="text-center px-3 py-3 font-black text-blue-700 uppercase tracking-widest text-[10px] border-l border-slate-200" colSpan={3}>
            ⏱️ Implementation Timeline
          </th>
          <th className="text-center px-3 py-3 font-black text-emerald-700 uppercase tracking-widest text-[10px] border-l border-slate-200" colSpan={3}>
            💰 Billing Cycles
          </th>
        </tr>
        <tr className="bg-slate-100/60 border-b border-slate-200">
          <th className="text-left px-4 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest sticky left-0 bg-slate-100/60 z-10"></th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest border-l border-slate-200">Setup & Build</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Training</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Go-Live</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest border-l border-slate-200">Monthly</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Quarterly</th>
          <th className="text-center px-3 py-2 font-bold text-emerald-600 text-[9px] uppercase tracking-widest">Annual ✨</th>
        </tr>
      </thead>
      <tbody>
        {tiers.map((t, i) => (
          <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors`}>
            <td className="px-4 py-3 font-bold text-slate-800 sticky left-0 bg-inherit z-10 whitespace-nowrap">{t.name}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-600 border-l border-slate-100">{t.setup}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-600">{t.training}</td>
            <td className="px-3 py-3 text-center">
              <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">{t.goLive}</span>
            </td>
            <td className="px-3 py-3 text-center font-bold text-slate-600 border-l border-slate-100">{t.monthly}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-700">{t.quarterly}</td>
            <td className="px-3 py-3 text-center">
              <span className="font-black text-emerald-700">{t.annual}</span>
              {t.savings && <span className="ml-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">Save {t.savings}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ProductsServicesPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [activeSection, setActiveSection] = useState('platform');
  const [showSubLetter, setShowSubLetter] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* ── drag-to-scroll for section nav ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (navRef.current?.offsetLeft || 0);
    scrollLeft.current = navRef.current?.scrollLeft || 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (navRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (navRef.current) navRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => { isDragging.current = false; };

  const scrollNav = (dir: 'left' | 'right') => {
    if (navRef.current) navRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  /* ── intersection observer for active section highlighting ── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 });
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/gghp-logo.png" alt="GGHP" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="w-px h-6 bg-slate-300" />
          <span className="text-slate-800 font-black text-sm tracking-wide">Products & Services</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('landing')} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={14} className="inline mr-1" /> Back to Portal
          </button>
        </div>
      </nav>

      {/* ── STICKY SECTION NAV BAR ── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-1 px-2">
          <button onClick={() => scrollNav('left')} className="shrink-0 p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div
            ref={navRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSection === s.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => scrollNav('right')} className="shrink-0 p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Subscription Letter Modal */}
      {showSubLetter && <SubscriptionLetterModal onClose={() => setShowSubLetter(false)} />}

      {/* Main Content */}
      <section className="py-16 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <ShoppingCart size={12} /> Our Products & Services
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products &amp; Services</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Global Green Enterprise Inc provides SaaS compliance technology, telehealth coordination, AI-powered operational tools, public health monitoring, and payment processing for the legal cannabis industry across all 50 U.S. states and tribal nations.</p>
          </div>

          {/* FREE Account Banner */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20 border border-emerald-400/30 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <span className="text-white text-xs font-black uppercase tracking-widest">No Cost to Get Started</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Create Your Account for <span className="text-yellow-300">FREE</span>
              </h2>
              <p className="text-emerald-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4">
                Self-serve your <span className="font-bold text-white">medical card applications</span>, <span className="font-bold text-white">business license applications</span>, 
                and <span className="font-bold text-white">state portal registrations</span> — all at no charge. 
                Your account gives you direct access to do it yourself.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xl mx-auto border border-white/20">
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                  <span className="font-black text-yellow-300">Subscriptions are optional</span> — only needed if you want our 
                  providers, agents, or assistants to handle the process for you, or to unlock premium benefits 
                  like telehealth, compliance tools, and dedicated support.
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Agreement Preview Button */}
          <div className="mb-16 text-center">
            <button
              onClick={() => setShowSubLetter(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-[1.02] transition-all border border-slate-700 group"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <FileText size={20} />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-wider">Subscription Confirmation & Service Agreement</p>
                <p className="text-slate-400 text-[10px] font-bold">13-Section Paid Subscriber Agreement — Pricing, SLA, HIPAA, Billing, Disclosures, Legal Terms & More</p>
              </div>
            </button>
          </div>

          {/* ─── CORE PLATFORM SUBSCRIPTIONS ─── */}
          <div id="platform" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700"><Cpu size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">GGP-OS Platform Subscriptions</h3>
                <p className="text-sm text-slate-500">Monthly, quarterly & annual SaaS subscriptions for compliance, licensing, and AI-powered operations</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Patient / Consumer', icon: '🏥', price: '$49.99', period: '/mo', desc: 'Telehealth coordination, medical card management, Care Wallet, AI guidance via Sylara', features: ['Medical card application sync', 'Telehealth scheduling', 'Care Wallet stored value', 'Sylara AI personal assistant', 'Document vault & compliance tracker'], color: 'emerald' },
                { title: 'Business / Dispensary', icon: '🏢', price: '$199', period: '/mo', desc: 'Full compliance OS with POS, Metrc sync, inventory, and Larry enforcement AI', features: ['SINC POS system (card-ready)', 'Real-time Metrc seed-to-sale sync', 'Inventory & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting'], color: 'blue' },
                { title: 'Provider / Physician', icon: '🩺', price: '$99', period: '/mo', desc: 'Patient management, telehealth consultations, recommendation workflows, and AI tools', features: ['Patient roster management', 'Telehealth consultation tools', 'Recommendation workflow', 'Sylara AI clinical guidance', 'Compliance & licensing tracker'], color: 'violet' },
                { title: 'Attorney / Legal', icon: '⚖️', price: '$149', period: '/mo', desc: 'Cannabis & general legal case management, client leads, regulatory AI, and Larry enforcement', features: ['Legal marketplace & lead access', 'Case management dashboard', 'Regulatory intelligence feeds', 'Larry AI legal compliance', 'Client billing & invoicing'], color: 'amber' },
                { title: 'Advocacy & Research', icon: '📊', price: '$79', period: '/mo', desc: 'Health demographic trends, safety reporting, anonymized research data, and policy analysis tools', features: ['Anonymized health demographic data', 'Safety & outcome reporting tools', 'Policy impact analysis dashboards', 'Research data export (CSV/API)', 'Community engagement analytics'], color: 'rose' },
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="text-3xl mb-3">{product.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{product.title}</h4>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black text-emerald-700">{product.price}</span>
                    <span className="text-xs font-bold text-slate-400">{product.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{product.desc}</p>
                  <ul className="space-y-2 text-xs text-slate-600 flex-1">
                    {product.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2"><CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => onNavigate('larry-chatbot')} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors uppercase tracking-wider">Get Started</button>
                    <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-colors uppercase tracking-wider">Book Demo</button>
                  </div>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Patient / Consumer', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$49.99/mo', quarterly: '$134.97/qtr', annual: '$479.88/yr', savings: '20%' },
              { name: 'Business / Dispensary', setup: '1–2 Weeks', training: '3–5 Days', goLive: '2–3 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
              { name: 'Provider / Physician', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
              { name: 'Attorney / Legal', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
              { name: 'Advocacy & Research', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$79/mo', quarterly: '$213.30/qtr', annual: '$758.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── PROFESSIONAL SERVICES ─── */}
          <div id="professional" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700"><Stethoscope size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Professional Services</h3>
                <p className="text-sm text-slate-500">One-time and recurring services we facilitate and collect payment for</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Telehealth Physician Evaluation', price: 'Varies by state', type: 'Per Visit', desc: 'Virtual physician consultation for medical cannabis recommendation. Pricing varies by provider and state jurisdiction. Includes physician evaluation and GGE processing & sync fee. Recommendation valid for state application.', icon: '📋' },
                { title: 'AI Virtual Attendant (Sylara)', price: '$149/mo', type: 'Monthly Add-on', desc: 'Branded @TheBackOffice.com virtual receptionist powered by Sylara AI. Handles inbound calls, appointment scheduling, intake routing, and customer service across your business.', icon: '🤖' },
                { title: 'State Application Processing', price: 'Varies by state', type: 'Per Application', desc: 'We facilitate state cannabis license and medical card applications. State fees (e.g. $22.50–$104.30 in Oklahoma) are collected separately by the state authority. GGE charges a $10 processing fee.', icon: '📄' },
              ].map((svc, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{svc.icon}</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">{svc.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{svc.title}</h4>
                  <p className="text-xl font-black text-emerald-700 mb-3">{svc.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Telehealth Evaluation', setup: 'N/A', training: 'N/A', goLive: 'Per Visit', monthly: 'Per Visit', quarterly: 'N/A', annual: 'N/A' },
              { name: 'AI Virtual Attendant', setup: '3–5 Days', training: '2–3 Days', goLive: '1–2 Weeks', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
              { name: 'State App Processing', setup: 'N/A', training: 'N/A', goLive: 'Per App', monthly: '$10/app', quarterly: 'N/A', annual: 'N/A' },
            ]} />
          </div>

          {/* ─── LAB & PUBLIC HEALTH SUBSCRIPTIONS ─── */}
          <div id="lab_health" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700">🔬</div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Lab & Public Health Subscriptions</h3>
                <p className="text-sm text-slate-500">COA management, contamination monitoring, accreditation tracking, and compliance dashboards</p>
              </div>
            </div>
            <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 rounded-xl p-4">
              <p className="text-xs text-teal-800 leading-relaxed">
                <span className="font-black">NEW:</span> Purpose-built for cannabis testing laboratories, state health departments, tribal health authorities, and hospital systems.
                Includes real-time contamination zone mapping, patient outcome analytics, recall management, and Recency Index field testing integration.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Independent Lab', icon: '🧪', price: '$499', period: '/mo', tag: 'MOST POPULAR', tagColor: 'emerald', desc: 'Full COA management, accreditation tracking, contaminant monitoring, and multi-state compliance for licensed testing labs', features: ['COA upload, validation & auto-scan', 'Accreditation tracking (ISO 17025, DEA)', 'Contaminant flagging & recall alerts', 'Statewide pass rate analytics', 'Recency Index field test integration', 'Larry AI compliance monitoring'], color: 'teal' },
                { title: 'Regional Lab Network', icon: '🏗️', price: '$1,499', period: '/mo', tag: 'MULTI-SITE', tagColor: 'blue', desc: 'Multi-location lab network management with centralized compliance oversight and cross-facility contamination tracking', features: ['Everything in Independent Lab', 'Multi-facility dashboard (up to 10 labs)', 'Cross-facility contamination correlation', 'Centralized accreditation management', 'Network-wide pass rate benchmarking', 'Priority API access & data exports'], color: 'blue' },
                { title: 'State Health Department', icon: '🏛️', price: '$4,999', period: '/mo', tag: 'GOVERNMENT', tagColor: 'purple', desc: 'Statewide contamination monitoring, patient outcome tracking, outbreak detection, and recall management for state health agencies', features: ['GIS contamination zone mapping', 'Patient exposure tracking & notifications', 'Statewide lab compliance scorecards', 'Automated recall broadcast system', 'Source chain tracing (seed-to-sale)', 'Sylara Public Health AI assistant'], color: 'purple' },
                { title: 'Tribal Health Authority', icon: '🪶', price: '$2,499', period: '/mo', tag: 'TRIBAL SOVEREIGNTY', tagColor: 'amber', desc: 'Dual-jurisdiction compliance for tribal nations with federal-tribal bridge protocols and culturally integrated health data', features: ['Tribal compact compliance tracking', 'Federal-tribal bridge protocols', 'Sovereign health data management', 'Community exposure monitoring', 'Cultural wellness integration', 'Tribal-federal reporting automation'], color: 'amber' },
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 hover:border-teal-300 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
                  {product.tag && (
                    <div className={`absolute -top-3 right-4 px-3 py-1 bg-${product.tagColor}-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                      {product.tag}
                    </div>
                  )}
                  <div className="text-3xl mb-3">{product.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{product.title}</h4>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black text-teal-700">{product.price}</span>
                    <span className="text-xs font-bold text-slate-400">{product.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{product.desc}</p>
                  <ul className="space-y-2 text-xs text-slate-600 flex-1">
                    {product.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2"><CheckCircle size={12} className="text-teal-500 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => onNavigate('larry-chatbot')} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-teal-50 hover:text-teal-700 transition-colors uppercase tracking-wider">Get Started</button>
                    <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="flex-1 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-500 transition-colors uppercase tracking-wider">Book Demo</button>
                  </div>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Independent Lab', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$499/mo', quarterly: '$1,347.30/qtr', annual: '$4,790.40/yr', savings: '20%' },
              { name: 'Regional Lab Network', setup: '4–6 Weeks', training: '2 Weeks', goLive: '6–8 Weeks', monthly: '$1,499/mo', quarterly: '$4,047.30/qtr', annual: '$14,390.40/yr', savings: '20%' },
              { name: 'State Health Dept', setup: '6–10 Weeks', training: '2–4 Weeks', goLive: '10–14 Weeks', monthly: '$4,999/mo', quarterly: '$13,497.30/qtr', annual: '$47,990.40/yr', savings: '20%' },
              { name: 'Tribal Health Authority', setup: '4–8 Weeks', training: '2–3 Weeks', goLive: '8–12 Weeks', monthly: '$2,499/mo', quarterly: '$6,747.30/qtr', annual: '$23,990.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── PUBLIC HEALTH PROFESSIONAL SERVICES ─── */}
          <div id="health_addons" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-700">🏥</div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Public Health Add-On Services</h3>
                <p className="text-sm text-slate-500">Specialized modules for hospitals, health networks, and research institutions</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'COA Validation & Auto-Scan Engine', price: '$299/mo', type: 'Add-On Module', desc: 'Upload COAs in PDF or XML format and Larry auto-validates against state limits for heavy metals, pesticide residue, microbial pathogens, and residual solvents. Includes dual-channel rapid testing device pairing for Recency Index field tests.', icon: '📊' },
                { title: 'Contamination Response System', price: '$799/mo', type: 'Add-On Module', desc: 'Real-time GIS exposure mapping, automated patient notification via Care Wallet, source chain analysis (cultivator → processor → lab → retailer), and coordinated recall broadcast to affected zones. Includes Sylara Public Health AI assistant.', icon: '🚨' },
                { title: 'Accreditation & Compliance Tracking', price: '$199/mo', type: 'Add-On Module', desc: 'Track ISO 17025, DEA Schedule I, state licenses, and tribal compacts across all facilities. Auto-renewal alerts 90 days before expiration. Compliance scorecard with trend analysis and facility benchmarking.', icon: '🏅' },
              ].map((svc, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{svc.icon}</span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100">{svc.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{svc.title}</h4>
                  <p className="text-xl font-black text-teal-700 mb-3">{svc.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'COA Validation Engine', setup: '1–2 Weeks', training: '2–3 Days', goLive: '2–3 Weeks', monthly: '$299/mo', quarterly: '$807.30/qtr', annual: '$2,870.40/yr', savings: '20%' },
              { name: 'Contamination Response', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$799/mo', quarterly: '$2,157.30/qtr', annual: '$7,670.40/yr', savings: '20%' },
              { name: 'Accreditation Tracking', setup: '1 Week', training: '1–2 Days', goLive: '1–2 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── RAPID TESTING & HARDWARE — COMING SOON ─── */}
          <div id="rapid_testing" className="mb-16 scroll-mt-36 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-blue-900/30 border border-blue-400/30 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Coming Soon — Seeking Investment Partners
            </div>
            <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 pt-12 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700"><Smartphone size={20} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Rapid Testing & Hardware Products</h3>
                  <p className="text-sm text-slate-500">Field-deployable impairment testing for law enforcement, employers, testing sites, and health agencies</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white border border-blue-800 relative overflow-hidden">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-500 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full">Coming Soon</div>
                  <div className="text-3xl mb-3">🔬</div>
                  <h4 className="text-lg font-black mb-1">Dual-Channel Rapid Testing Device</h4>
                  <p className="text-blue-300 text-xs font-bold mb-3">Recency Index (RI) Field Test</p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">Proprietary dual-channel breath analysis device that measures THC presence AND recency of consumption (0–9.99 RI scale) in real time. Differentiates active impairment from residual metabolites — the distinction traditional tests can't make. Instant results like an alcohol breathalyzer. Designed for law enforcement roadside stops, employer workplace safety programs, third-party testing sites, and clinical health screenings.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Recency Scale</p>
                      <p className="text-xs font-black text-emerald-400">0–9.99 RI</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Result Time</p>
                      <p className="text-xs font-black text-white">Instant (Breathalyzer)</p>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('larry-chatbot')} className="w-full py-2.5 bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl hover:bg-yellow-400 transition-colors uppercase tracking-wider">Join Waitlist</button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                  <div className="text-2xl mb-3">🧫</div>
                  <h4 className="font-black text-slate-900 mb-1">RI Test Strip Cartridges</h4>
                  <p className="text-lg font-black text-slate-400 mb-3">Price TBD <span className="text-xs font-bold">(per unit)</span></p>
                  <p className="text-xs text-slate-500 leading-relaxed">Replacement dual-channel cartridges for the Rapid Testing Device. Each cartridge performs one Recency Index field test. Bulk pricing available for law enforcement agencies, employers, testing facilities, and health departments.</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                  <div className="text-2xl mb-3">📱</div>
                  <h4 className="font-black text-slate-900 mb-1">Device Cloud Connectivity</h4>
                  <p className="text-lg font-black text-slate-400 mb-3">Price TBD <span className="text-xs font-bold">(per device/mo)</span></p>
                  <p className="text-xs text-slate-500 leading-relaxed">Bluetooth pairing, cloud sync, and auto-routing of RI test results to enforcement, lab, and patient dashboards. Firmware updates and device health monitoring included.</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 italic">Interested in partnering or investing in this technology? <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="text-blue-600 font-bold hover:underline">Schedule a meeting →</button></p>
              </div>
            </div>
          </div>

          {/* ─── EDUCATION & CERTIFICATION ─── */}
          <div id="education" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700"><GraduationCap size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Education & Certification</h3>
                <p className="text-sm text-slate-500">Training programs, compliance certifications, and continuing education for industry professionals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Compliance Officer Certification', price: '$299', type: 'One-Time', desc: 'Comprehensive training on state-by-state cannabis regulations, Metrc compliance, OMMA licensing requirements, and federal scheduling implications. Includes certificate of completion recognized by state agencies.', icon: '🎓' },
                { title: 'Budtender & Staff Training', price: '$49/seat', type: 'Per Employee', desc: 'Online course covering product knowledge, patient interaction protocols, seed-to-sale tracking, POS operation, and state-specific compliance requirements. Includes quiz-based certification.', icon: '📚' },
                { title: 'Continuing Education Portal', price: '$19/mo', type: 'Subscription', desc: 'Monthly updated courses on regulatory changes, DEA scheduling updates, new state legalization frameworks, and best practices. Required CE credits for compliance maintenance.', icon: '📖' },
              ].map((edu, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{edu.icon}</span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">{edu.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{edu.title}</h4>
                  <p className="text-xl font-black text-emerald-700 mb-3">{edu.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{edu.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Compliance Officer Cert', setup: 'Instant', training: '40 Hours', goLive: '1–2 Weeks', monthly: '$299 (one-time)', quarterly: 'N/A', annual: 'N/A' },
              { name: 'Budtender Training', setup: 'Instant', training: '8–12 Hours', goLive: '2–3 Days', monthly: '$49/seat', quarterly: 'N/A', annual: 'N/A' },
              { name: 'CE Portal', setup: 'Instant', training: 'Self-paced', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── CARE WALLET & PAYMENT PROCESSING ─── */}
          <div id="care_wallet" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700"><Wallet size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Care Wallet &amp; Payment Processing</h3>
                <p className="text-sm text-slate-500">Closed-loop stored value ecosystem for compliant cannabis transactions</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { tier: 'Bronze', price: 'Free', desc: 'Basic wallet, cash load, ecosystem spending, silent compliance checks' },
                { tier: 'Silver', price: '$19/mo', desc: 'Virtual card via NomadCash, spending limits, categorized tracking, insights' },
                { tier: 'Gold', price: '$49/mo', desc: 'AI-guided spending (Sylara), smart alerts, advanced analytics, auto-reload' },
                { tier: 'Platinum', price: '$99/mo', desc: 'Multiple virtual cards, role-based separation, full financial dashboard, real-time Larry enforcement' },
              ].map((w, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white border border-slate-700 hover:border-indigo-500 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{w.tier}</p>
                  <p className="text-xl font-black mb-2">{w.price}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Bronze', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: 'Free', quarterly: 'Free', annual: 'Free' },
              { name: 'Silver', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
              { name: 'Gold', setup: 'Instant', training: '1 Hour', goLive: 'Same Day', monthly: '$49/mo', quarterly: '$132.30/qtr', annual: '$470.40/yr', savings: '20%' },
              { name: 'Platinum', setup: '1–2 Days', training: '2–3 Hours', goLive: '1–3 Days', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── GOVERNMENT & ENTERPRISE ─── */}
          <div id="government" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700"><Building2 size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Government &amp; Enterprise</h3>
                <p className="text-sm text-slate-500">High-capacity platforms for state regulators, law enforcement, and federal agencies</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'State Authority', price: 'From $4,999/mo', desc: 'Unified licensing portal, Metrc integration, compliance monitoring, public transparency. Replaces Thentia + Metrc admin at lower cost.' },
                { title: 'Law Enforcement', price: 'From $999/mo', desc: 'Enforcement dashboards, rapid testing recency index, violation detection, inter-agency coordination, Larry AI intelligence.' },
                { title: 'Federal Agency', price: 'From $9,999/mo', desc: 'Nationwide oversight, multi-agency dashboards, interstate commerce monitoring, SAM.gov compliance, policy simulation.' },
              ].map((gov, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 p-6 shadow-sm hover:shadow-lg transition-all">
                  <h4 className="font-black text-slate-900 text-lg mb-1">{gov.title}</h4>
                  <p className="text-emerald-700 font-black mb-3">{gov.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{gov.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'State Authority', setup: '8–12 Weeks', training: '4–6 Weeks', goLive: '12–16 Weeks', monthly: 'From $4,999/mo', quarterly: 'From $13,497/qtr', annual: 'From $47,990/yr', savings: '20%' },
              { name: 'Law Enforcement', setup: '4–8 Weeks', training: '2–4 Weeks', goLive: '8–12 Weeks', monthly: 'From $999/mo', quarterly: 'From $2,697/qtr', annual: 'From $9,590/yr', savings: '20%' },
              { name: 'Federal Agency', setup: '12–20 Weeks', training: '6–10 Weeks', goLive: '20–30 Weeks', monthly: 'From $9,999/mo', quarterly: 'From $26,997/qtr', annual: 'From $95,990/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── ACCEPTED PAYMENT METHODS ─── */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 text-center">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4">Accepted Payment Methods</h4>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {['ACH Bank Transfer', 'Debit Card', 'Credit Card (Visa/MC)', 'Care Wallet', 'Wire Transfer', 'Invoice / Net 30'].map((method, i) => (
                <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">{method}</span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">Payment processing is facilitated by Authorize.net (credit/debit), Chime (Cash App/Venmo/Zelle), and ACH invoicing. All subscription billing is handled digitally. No cash payments are accepted online. Care Wallet is a closed-loop stored value system for in-ecosystem transactions only. Global Green Enterprise Inc (CAGE: 9KXZ2) is a registered federal supplier and Oklahoma state vendor.</p>
          </div>

          {/* ─── LEGAL DISCLOSURE ─── */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
              All products and services are provided by Global Green Enterprise Inc, a registered Oklahoma corporation. SaaS subscriptions auto-renew at the listed rate. All plans include a 30-day free trial; after trial, invoicing begins via ACH or card. Quarterly billing saves 10%; annual billing saves 20%. State application fees are set by individual state authorities and are separate from GGP-OS subscription costs. Telehealth services are facilitated through licensed healthcare providers. Lab & Public Health subscriptions require verified laboratory or health authority credentials. Care Wallet is a closed-loop stored value product, not a bank account. FDIC insurance does not apply to Care Wallet balances. Pricing is subject to change. For questions, contact us at 1-888-963-4447.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
