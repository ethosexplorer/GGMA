// ═══════════════════════════════════════════════════════════════════════════
// AZ LEAD IMPORTER — Uses Firebase writeBatch for instant bulk import
// ═══════════════════════════════════════════════════════════════════════════

import { collection, writeBatch, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AZ_LEADS } from './load_az_leads';

export async function loadArizonaLeads(): Promise<{ success: number; failed: number; skipped: number; total: number }> {
  console.log(`🌵 Loading ${AZ_LEADS.length} Arizona leads via batch write...`);
  let success = 0;
  let failed = 0;
  let skipped = 0;

  // Check for existing AZ leads to skip duplicates
  const existingNames = new Set<string>();
  try {
    const snap = await getDocs(query(collection(db, 'crm_deals'), where('jurisdiction', '==', 'AZ')));
    snap.docs.forEach(d => existingNames.add((d.data().name || '').toLowerCase()));
    // Also check executive collection
    const snap2 = await getDocs(query(collection(db, 'executive_crm_deals'), where('jurisdiction', '==', 'AZ')));
    snap2.docs.forEach(d => existingNames.add((d.data().name || '').toLowerCase()));
  } catch (e) {
    console.warn('Dedup check failed, importing all:', e);
  }

  // Filter out duplicates
  const newLeads = AZ_LEADS.filter(lead => {
    const checkName = (lead.businessName || lead.name || '').toLowerCase();
    if (existingNames.has(checkName)) { skipped++; return false; }
    return true;
  });

  // Firebase batch supports up to 500 writes per batch
  for (let i = 0; i < newLeads.length; i += 450) {
    const chunk = newLeads.slice(i, i + 450);
    const batch = writeBatch(db);

    for (const lead of chunk) {
      const ref = doc(collection(db, 'crm_deals'));
      batch.set(ref, {
        name: lead.businessName || lead.name,
        businessName: lead.businessName || '',
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
    }

    try {
      await batch.commit();
      success += chunk.length;
      console.log(`Batch ${Math.floor(i/450)+1} committed: ${chunk.length} leads`);
    } catch (err) {
      console.error('Batch commit failed:', err);
      failed += chunk.length;
    }
  }

  console.log(`✅ AZ Import: ${success} new, ${skipped} dupes skipped, ${failed} failed`);
  return { success, failed, skipped, total: AZ_LEADS.length };
}
