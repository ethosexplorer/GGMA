// ═══════════════════════════════════════════════════════════════════════════
// AZ LEAD IMPORTER — Writes directly to executive_crm_deals for Ryan's CRM
// Sends leads one at a time to avoid Firebase quota/timeout issues
// ═══════════════════════════════════════════════════════════════════════════

import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AZ_LEADS } from './load_az_leads';

export async function loadArizonaLeads(): Promise<{ success: number; failed: number; skipped: number; total: number }> {
  console.log(`🌵 Loading ${AZ_LEADS.length} Arizona leads into Executive CRM...`);
  let success = 0;
  let failed = 0;
  let skipped = 0;

  // Get existing AZ leads to avoid duplicates
  const existingNames = new Set<string>();
  try {
    const snap = await getDocs(query(collection(db, 'executive_crm_deals'), where('jurisdiction', '==', 'AZ')));
    snap.docs.forEach(d => {
      const name = (d.data().name || '').toLowerCase();
      if (name) existingNames.add(name);
    });
    console.log(`Found ${existingNames.size} existing AZ leads, will skip duplicates`);
  } catch (e) {
    console.warn('Could not check for duplicates, importing all:', e);
  }

  for (const lead of AZ_LEADS) {
    const checkName = (lead.businessName || lead.name || '').toLowerCase();
    if (existingNames.has(checkName)) {
      skipped++;
      continue;
    }

    try {
      await addDoc(collection(db, 'executive_crm_deals'), {
        name: lead.businessName || lead.name,
        contactName: lead.name,
        type: lead.contactType === 'dispensary' ? 'dispensary' :
              lead.contactType === 'grower' ? 'grower' :
              lead.contactType === 'processor' ? 'processor' :
              lead.contactType === 'provider' ? 'provider' :
              lead.contactType === 'attorney' ? 'attorney' :
              lead.contactType === 'regulator' ? 'agency' : 'other',
        stage: 'lead',
        value: 0,
        assignedTo: 'president',
        phone: lead.phone || '',
        email: lead.email || '',
        licenseNumber: '',
        licenseType: lead.licenseType || '',
        licenseStatus: 'Active',
        jurisdiction: 'AZ',
        notes: lead.notes || '',
        address: lead.address || '',
        city: lead.city || '',
        state: 'AZ',
        tags: lead.tags || [],
        source: 'scraper_import',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      success++;
    } catch (err) {
      console.error(`Failed to import ${lead.name}:`, err);
      failed++;
    }

    // Small delay between each write to avoid quota
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`✅ AZ Import: ${success} new, ${skipped} skipped (duplicates), ${failed} failed`);
  return { success, failed, skipped, total: AZ_LEADS.length };
}
