// ============================================================
// GGMA — Freemius Client-Side Configuration & Integration
// 
// Maps platform plan IDs to Freemius numeric Plan IDs and 
// exposes helper functions to open the native Freemius overlay checkout.
// ============================================================

export const FREEMIUS_PLUGIN_ID = import.meta.env.VITE_FREEMIUS_PLUGIN_ID || '12345';
export const FREEMIUS_PUBLIC_KEY = import.meta.env.VITE_FREEMIUS_PUBLIC_KEY || 'pk_placeholder';

// Map platform Plan IDs (defined in subscriptionPlans.ts) to Freemius numeric Plan IDs.
// Replace these numeric placeholders with the exact Plan IDs from your Freemius Developer Dashboard.
export const FREEMIUS_PLAN_MAP: Record<string, number> = {
  // Patient (B2C) Plans
  'b2c_basic': 54990, // B2C Basic
  'b2c_med': 54991, // B2C Medium
  'b2c_full': 54992, // B2C Full AI

  // Care Wallet Plans
  'cw_bronze': 54993, // Care Wallet Bronze (free tier)
  'cw_silver': 54994, // Care Wallet Silver
  'cw_gold': 54995, // Care Wallet Gold
  'cw_platinum': 54996, // Care Wallet Platinum

  // Cannabis B2B Plans
  'b2bc_starter': 54997, // Cannabis B2B Starter
  'b2bc_pro': 54998, // Cannabis B2B Professional
  'b2bc_enterprise': 54999, // Cannabis B2B Enterprise

  // Traditional B2B Plans
  'b2bt_basic': 55000, // Traditional B2B Basic
  'b2bt_medium': 55001, // Traditional B2B Medium
  'b2bt_full': 55002, // Traditional B2B Full AI

  // Cannabis Backoffice Plans
  'cannabis_basic': 55003, // Cannabis Backoffice Basic
  'cannabis_pro': 55004, // Cannabis Backoffice Pro
  'cannabis_enterprise': 55005, // Cannabis Backoffice Enterprise

  // General Backoffice Plans
  'non_cannabis_basic': 55006, // General Backoffice Basic
  'non_cannabis_pro': 55007, // General Backoffice Pro
  'non_cannabis_enterprise': 55008, // General Backoffice Enterprise

  // Provider Plans
  'prov_basic': 55009, // Provider Basic
  'prov_med': 55010, // Provider Medium
  'prov_full': 55011, // Provider Full AI

  // Cannabis Attorney — single plan, multi-license tiers:
  //   1 license = Basic ($149/mo), 5 licenses = Medium ($349/mo), 25 licenses = Full AI ($699/mo)
  'cannabis_attorney': 55053,

  // General Attorney — single plan, multi-license tiers:
  //   1 license = Basic ($149/mo), 5 licenses = Medium ($349/mo), 25 licenses = Full AI ($699/mo)
  'general_attorney': 55054,

  // Public Health / Lab Plans
  'ph_core': 55018, // Lab Essentials
  'ph_professional': 55019, // Lab Intelligence
  'ph_enterprise': 55020, // Lab Command Center

  // Enforcement Plans
  'enf_basic': 55021, // Enforcement Basic
  'enf_pro': 55022, // Enforcement Pro
  'enf_enterprise': 55023, // Enforcement Enterprise

  // Finance AI Plans
  'fin_basic': 55024, // Finance AI Basic
  'fin_pro': 55025, // Finance AI Pro
  'fin_enterprise': 55026, // Finance AI Enterprise

  // Combined Enforcement + Finance Plans
  'combo_basic': 55027, // Combined Basic
  'combo_pro': 55028, // Combined Pro
  'combo_enterprise': 55029, // Combined Enterprise

  // State Authority — single plan, multi-license tiers:
  //   1 license = Basic ($4,999/mo), 5 licenses = Pro ($12,999/mo), 25 licenses = Enterprise ($24,999/mo)
  'state_authority': 55049,

  // Federal Dashboard — single plan, multi-license tiers:
  //   1 license = Basic ($9,999/mo), 5 licenses = Pro ($24,999/mo), 25 licenses = Enterprise ($49,999/mo)
  'federal_dashboard': 55050,

  // Gov Office — single plan, multi-license tiers:
  //   1 license = Basic ($299/mo), 5 licenses = Pro ($799/mo), 25 licenses = Enterprise ($1,999/mo)
  'gov_office': 55055,

  // Advocate — single plan, multi-license tiers:
  //   1 license = Basic ($79/mo), 5 licenses = Pro ($199/mo), 25 licenses = Enterprise ($499/mo)
  'advocate': 55056,

  // ─── NOT in Freemius (direct invoicing) ─────────────────────
  // Core Admin Dashboard — Freemius plan limit, use Found Invoice
  // Partner plans (Ambassador/Reseller/Strategic) — removed
};

interface OpenFreemiusCheckoutOptions {
  planId: string;
  billing: 'monthly' | 'annual';
  userEmail?: string;
  userName?: string;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}

/**
 * Dynamically opens the Freemius Checkout modal overlay.
 * Falls back to direct hosted checkout URL if the script fails to load.
 */
export const openFreemiusCheckout = ({
  planId,
  billing,
  userEmail = '',
  userName = '',
  onSuccess,
  onCancel
}: OpenFreemiusCheckoutOptions) => {
  const freemiusPlanId = FREEMIUS_PLAN_MAP[planId];
  if (!freemiusPlanId) {
    console.error(`Unknown Freemius plan mapping for platform ID: "${planId}"`);
    alert(`Checkout error: Freemius plan mapping not found for "${planId}".`);
    return;
  }

  const pluginId = import.meta.env.VITE_FREEMIUS_PLUGIN_ID || FREEMIUS_PLUGIN_ID;
  const publicKey = import.meta.env.VITE_FREEMIUS_PUBLIC_KEY || FREEMIUS_PUBLIC_KEY;

  if ((window as any).FS) {
    try {
      const handler = (window as any).FS.Checkout.configure({
        plugin_id: pluginId,
        public_key: publicKey,
        plan_id: freemiusPlanId,
        billing_cycle: billing === 'annual' ? 'annual' : 'monthly',
      });

      handler.open({
        email: userEmail,
        name: userName,
        success: function (response: any) {
          console.log('Freemius checkout success:', response);
          if (onSuccess) {
            onSuccess(response);
          } else {
            alert('Checkout complete! Your subscription is active.');
            window.location.reload();
          }
        },
        cancel: function () {
          console.log('Freemius checkout cancelled');
          if (onCancel) onCancel();
        }
      });
    } catch (err) {
      console.error('Error opening Freemius Native Checkout:', err);
      // Fallback
      window.open(`https://checkout.freemius.com/plugins/${pluginId}/checkout.html?plan_id=${freemiusPlanId}&billing_cycle=${billing}`, '_blank');
    }
  } else {
    // If the external script is blocked or failed to load, open in a new tab
    console.warn('Freemius JS SDK not found on window. Opening direct checkout page...');
    window.open(`https://checkout.freemius.com/plugins/${pluginId}/checkout.html?plan_id=${freemiusPlanId}&billing_cycle=${billing}`, '_blank');
  }
};
