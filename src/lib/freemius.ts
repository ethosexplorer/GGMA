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

  // Cannabis Attorney Plans
  'cann_att_basic': 55012, // Cannabis Attorney Basic
  'cann_att_med': 55013, // Cannabis Attorney Medium
  'cann_att_full': 55014, // Cannabis Attorney Full AI

  // General Attorney Plans
  'gen_att_basic': 55015, // General Attorney Basic
  'gen_att_med': 55016, // General Attorney Medium
  'gen_att_full': 55017, // General Attorney Full AI

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

  // State Authority Plans
  'state_basic': 55030, // State Authority Basic
  'state_pro': 55031, // State Authority Pro
  'state_enterprise': 55032, // State Authority Enterprise

  // Federal Plans
  'fed_basic': 55033, // Federal Dashboard Basic
  'fed_pro': 55034, // Federal Dashboard Pro
  'fed_enterprise': 55035, // Federal Dashboard Enterprise

  // External Admin
  'admin_core': 55036, // Core Admin Dashboard

  // Partner Plans
  'partner_affiliate': 55037, // Brand Ambassador
  'partner_reseller': 55038, // Authorized Reseller
  'partner_strategic': 55039, // Strategic Distribution Partner
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
