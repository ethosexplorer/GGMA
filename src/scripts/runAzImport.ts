// ═══════════════════════════════════════════════════════════════════════════
// AZ LEAD IMPORTER — Writes directly to executive_crm_deals for Ryan's CRM
// ═══════════════════════════════════════════════════════════════════════════

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AZ_LEADS } from './load_az_leads';

export async function loadArizonaLeads(): Promise<{ success: number; failed: number; total: number }> {
  console.log(`🌵 Loading ${AZ_LEADS.length} Arizona leads into Executive CRM...`);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < AZ_LEADS.length; i += 10) {
    const batch = AZ_LEADS.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map(lead =>
        addDoc(collection(db, 'executive_crm_deals'), {
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
        })
      )
    );
    results.forEach(r => {
      if (r.status === 'fulfilled') success++;
      else failed++;
    });
    // Throttle
    if (i + 10 < AZ_LEADS.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`✅ AZ Import complete: ${success} loaded, ${failed} failed`);
  return { success, failed, total: AZ_LEADS.length };
}
