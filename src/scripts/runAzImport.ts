// ═══════════════════════════════════════════════════════════════════════════
// AZ LEAD IMPORTER — Callable from admin/dashboard to bulk load AZ leads
// ═══════════════════════════════════════════════════════════════════════════

import { batchCaptureContacts } from '../lib/contactCapture';
import { AZ_LEADS } from '../scripts/load_az_leads';

export async function loadArizonaLeads(): Promise<{ success: number; failed: number; total: number }> {
  console.log(`🌵 Loading ${AZ_LEADS.length} Arizona leads into CRM...`);
  const result = await batchCaptureContacts(AZ_LEADS, 10, 800);
  console.log(`✅ AZ Import complete: ${result.success} loaded, ${result.failed} failed out of ${AZ_LEADS.length} total`);
  return { ...result, total: AZ_LEADS.length };
}
