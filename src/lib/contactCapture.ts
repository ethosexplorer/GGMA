// ═══════════════════════════════════════════════════════════════════════════════
//  UNIVERSAL CONTACT CAPTURE — Every Person/Entity Touching GGP-OS Gets Logged
//  This is the backbone of the GGP marketing CRM engine.
//  Goal: Build a monetizable CRM for blast emails, SMS, campaigns, etc.
// ═══════════════════════════════════════════════════════════════════════════════

import { collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Contact Types ──────────────────────────────────────────────────────────
export type ContactSource =
  | 'phone_intake_patient'
  | 'phone_intake_business'
  | 'business_registration'
  | 'patient_signup'
  | 'business_signup'
  | 'provider_signup'
  | 'attorney_signup'
  | 'regulator_signup'
  | 'support_chat'
  | 'support_form'
  | 'landing_page'
  | 'chat_widget'
  | 'pricing_page'
  | 'newsletter'
  | 'referral'
  | 'scraper_import'
  | 'api_integration'
  | 'manual_entry'
  | 'gov_advocate_import'
  | 'walk_in'
  | 'web_form'
  | 'cannacribs_application'
  | 'other';

export type ContactType =
  | 'patient'
  | 'business_owner'
  | 'dispensary'
  | 'grower'
  | 'processor'
  | 'provider'
  | 'attorney'
  | 'advocate'
  | 'regulator'
  | 'gov_official'
  | 'investor'
  | 'vendor'
  | 'media'
  | 'visitor'
  | 'lead'
  | 'prospect'
  | 'partner'
  | 'employee'
  | 'cannacribs'
  | 'other';

export interface UniversalContact {
  // Identity
  name: string;
  email?: string;
  phone?: string;
  // Location
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  // Classification
  contactType: ContactType;
  source: ContactSource;
  // Business fields (optional)
  businessName?: string;
  licenseType?: string;
  licenseNumber?: string;
  ein?: string;
  // CRM fields
  tags?: string[];
  notes?: string;
  // Marketing
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  marketingSegment?: string;
  // Metadata
  jurisdiction?: string;
  referredBy?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  pageVisited?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CAPTURE — Log a contact to both `contacts` AND `crm_deals`
// ═══════════════════════════════════════════════════════════════════════════════

export const captureContact = async (contact: UniversalContact): Promise<string | null> => {
  try {
    const now = new Date().toISOString();

    // 1. Check if contact already exists (by email or phone) — deduplicate
    let existingId: string | null = null;
    if (contact.email && contact.email.trim()) {
      try {
        const emailQuery = query(
          collection(db, 'contacts'),
          where('email', '==', contact.email.trim().toLowerCase())
        );
        const snap = await getDocs(emailQuery);
        if (!snap.empty) {
          existingId = snap.docs[0].id;
          // Update existing contact with new interaction
          await updateDoc(snap.docs[0].ref, {
            lastInteraction: now,
            interactionCount: (snap.docs[0].data().interactionCount || 0) + 1,
            lastSource: contact.source,
            updatedAt: now,
            ...(contact.phone && !snap.docs[0].data().phone ? { phone: contact.phone } : {}),
            ...(contact.address && !snap.docs[0].data().address ? { address: contact.address } : {}),
            ...(contact.businessName && !snap.docs[0].data().businessName ? { businessName: contact.businessName } : {}),
          });
          return existingId;
        }
      } catch (e) {
        // Query failed, proceed to create new
      }
    }

    // 2. Create new contact in `contacts` collection (company directory)
    const contactDoc = await addDoc(collection(db, 'contacts'), {
      name: contact.name || 'Unknown Visitor',
      email: (contact.email || '').trim().toLowerCase(),
      phone: contact.phone || '',
      address: contact.address || '',
      city: contact.city || '',
      state: contact.state || '',
      zip: contact.zip || '',
      contactType: contact.contactType,
      source: contact.source,
      businessName: contact.businessName || '',
      licenseType: contact.licenseType || '',
      licenseNumber: contact.licenseNumber || '',
      ein: contact.ein || '',
      tags: contact.tags || [contact.contactType, contact.source],
      notes: contact.notes || '',
      emailOptIn: contact.emailOptIn ?? true,
      smsOptIn: contact.smsOptIn ?? false,
      marketingSegment: contact.marketingSegment || 'general',
      jurisdiction: contact.jurisdiction || contact.state || '',
      referredBy: contact.referredBy || '',
      // Tracking
      firstInteraction: now,
      lastInteraction: now,
      interactionCount: 1,
      lastSource: contact.source,
      // Lifecycle
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    // 3. Also write to `crm_deals` for the pipeline/marketing dashboards
    try {
      await addDoc(collection(db, 'crm_deals'), {
        name: contact.name || 'Unknown Visitor',
        businessName: contact.businessName || '',
        contactName: contact.name || '',
        email: (contact.email || '').trim().toLowerCase(),
        phone: contact.phone || '',
        address: contact.address || '',
        city: contact.city || '',
        state: contact.state || '',
        jurisdiction: contact.jurisdiction || contact.state || '',
        type: contact.contactType,
        stage: 'lead',
        status: 'Lead',
        pipeline: 'new',
        value: 0,
        assignedTo: 'unassigned',
        licenseType: contact.licenseType || '',
        licenseStatus: 'New',
        source: contact.source,
        tags: contact.tags || [contact.contactType, contact.source],
        notes: contact.notes || '',
        contactId: contactDoc.id, // Link back to contacts collection
        createdAt: now,
        updatedAt: now,
      });
    } catch (crmErr) {
      console.error('[CRM Deal sync error]:', crmErr);
    }

    // 4. SYNC TO TURSO — Write to patients/businesses tables so Jurisdiction Performance Matrix auto-updates
    try {
      const { turso } = await import('./turso');
      const isPatientType = contact.contactType === 'patient' || contact.source === 'patient_signup' || contact.source === 'phone_intake_patient';
      const isBusinessType = contact.contactType === 'business_owner' || contact.contactType === 'dispensary' || contact.contactType === 'grower' || contact.contactType === 'processor' || contact.source === 'business_signup' || contact.source === 'phone_intake_business' || contact.source === 'business_registration';

      if (isPatientType && contact.name && contact.email) {
        // Insert into patients table (IGNORE on conflict to avoid duplicates)
        await turso.execute({
          sql: `INSERT INTO patients (name, email, phone, medical_condition, state, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(email) DO UPDATE SET
                  name = excluded.name,
                  phone = COALESCE(excluded.phone, patients.phone),
                  state = COALESCE(excluded.state, patients.state),
                  status = excluded.status`,
          args: [
            contact.name,
            (contact.email || '').trim().toLowerCase(),
            contact.phone || null,
            contact.notes || null,
            contact.state || contact.jurisdiction || null,
            'pending',
            now
          ]
        });
      } else if (isBusinessType && (contact.businessName || contact.name) && contact.email) {
        // Insert into businesses table
        await turso.execute({
          sql: `INSERT INTO businesses (business_name, license_type, state, status, created_at)
                SELECT ?, ?, ?, ?, ?
                WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE business_name = ?)`,
          args: [
            contact.businessName || contact.name,
            contact.licenseType || 'General',
            contact.state || contact.jurisdiction || null,
            'pending',
            now,
            contact.businessName || contact.name
          ]
        });
      }
    } catch (tursoErr) {
      console.error('[Turso sync error (non-blocking)]:', tursoErr);
    }

    return contactDoc.id;
  } catch (err) {
    console.error('[Contact Capture Error]:', err);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  QUICK CAPTURE — Lightweight version for anonymous/minimal interactions
//  Use this for: page visits, chat opens, pricing page views, etc.
// ═══════════════════════════════════════════════════════════════════════════════

export const quickCapture = async (
  source: ContactSource,
  contactType: ContactType = 'visitor',
  metadata?: { name?: string; email?: string; phone?: string; state?: string; page?: string; notes?: string }
): Promise<string | null> => {
  return captureContact({
    name: metadata?.name || 'Anonymous Visitor',
    email: metadata?.email,
    phone: metadata?.phone,
    state: metadata?.state,
    contactType,
    source,
    pageVisited: metadata?.page,
    notes: metadata?.notes,
    tags: [contactType, source, metadata?.state || 'unknown-state'].filter(Boolean) as string[],
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MARKETING SEGMENT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const MARKETING_SEGMENTS = {
  PATIENT_ACTIVE: 'patient_active',
  PATIENT_PROSPECT: 'patient_prospect',
  BUSINESS_ACTIVE: 'business_active',
  BUSINESS_PROSPECT: 'business_prospect',
  PROVIDER_NETWORK: 'provider_network',
  ATTORNEY_NETWORK: 'attorney_network',
  GOV_REGULATORY: 'gov_regulatory',
  INVESTOR_VIP: 'investor_vip',
  GENERAL_NEWSLETTER: 'general_newsletter',
  HIGH_VALUE: 'high_value',
  RE_ENGAGEMENT: 're_engagement',
};

// ═══════════════════════════════════════════════════════════════════════════════
//  BATCH OPERATIONS — For importing existing contacts into the new system
// ═══════════════════════════════════════════════════════════════════════════════

export const batchCaptureContacts = async (
  contacts: UniversalContact[],
  batchSize: number = 50,
  delayMs: number = 500
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(c => captureContact(c))
    );
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value) success++;
      else failed++;
    });
    // Throttle to avoid quota issues
    if (i + batchSize < contacts.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  return { success, failed };
};
