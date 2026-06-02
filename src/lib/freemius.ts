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
  'b2c_basic': 30101,
  'b2c_med': 30102,
  'b2c_full': 30103,

  // Cannabis B2B Plans
  'b2bc_starter': 30201,
  'b2bc_pro': 30202,
  'b2bc_enterprise': 30203,

  // Traditional B2B Plans
  'b2bt_basic': 30301,
  'b2bt_medium': 30302,
  'b2bt_full': 30303,

  // Providers Plans
  'prov_basic': 30401,
  'prov_med': 30402,
  'prov_full': 30403,

  // Attorneys Plans
  'cann_att_basic': 30501,
  'cann_att_med': 30502,
  'cann_att_full': 30503,
  'gen_att_basic': 30504,
  'gen_att_med': 30505,
  'gen_att_full': 30506,

  // Back Office Plans
  'cannabis_basic': 30601,
  'cannabis_pro': 30602,
  'cannabis_enterprise': 30603,
  'non_cannabis_basic': 30604,
  'non_cannabis_pro': 30605,
  'non_cannabis_enterprise': 30606,

  // Care Wallet Plans
  'cw_bronze': 30701,
  'cw_silver': 30702,
  'cw_gold': 30703,
  'cw_platinum': 30704,

  // State Authority Plans
  'state_basic': 30801,
  'state_pro': 30802,
  'state_enterprise': 30803,

  // Federal Plans
  'fed_basic': 30901,
  'fed_pro': 30902,
  'fed_enterprise': 30903,

  // Partners Plans
  'partner_affiliate': 31001,
  'partner_reseller': 31002,
  'partner_strategic': 31003,
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
