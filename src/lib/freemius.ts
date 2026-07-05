// ============================================================
// GGMA — Freemius Client-Side Configuration & Integration
// 
// Maps platform plan IDs to Freemius numeric Plan IDs and 
// exposes helper functions to open the native Freemius overlay checkout.
// Uses the modern FS.Checkout constructor + open() API.
// ============================================================

export const FREEMIUS_PLUGIN_ID = import.meta.env.VITE_FREEMIUS_PLUGIN_ID || '31063';
export const FREEMIUS_PUBLIC_KEY = import.meta.env.VITE_FREEMIUS_PUBLIC_KEY || 'pk_dee2d9c1cae1d0c192ed4d277fc57';

// Map platform Plan IDs (defined in subscriptionPlans.ts) to Freemius numeric Plan IDs.
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

// Map platform Add-on IDs to their Freemius Product ID and Pricing ID
export const FREEMIUS_ADDON_MAP: Record<string, { productId: number; planId: number }> = {
  'addon_pt_provider': { productId: 55256, planId: 72873 },
  'addon_pt_legal': { productId: 55261, planId: 72877 },
};

// Reverse lookup: Freemius plan ID → platform plan key
export const FREEMIUS_PLAN_REVERSE: Record<number, string> = Object.fromEntries(
  Object.entries(FREEMIUS_PLAN_MAP).map(([key, val]) => [val, key])
);

// Plan ID → user role mapping for webhook processing
export const PLAN_TO_ROLE: Record<string, string> = {
  'b2c_basic': 'user', 'b2c_med': 'user', 'b2c_full': 'user',
  'cw_bronze': 'user', 'cw_silver': 'user', 'cw_gold': 'user', 'cw_platinum': 'user',
  'b2bc_starter': 'business', 'b2bc_pro': 'business', 'b2bc_enterprise': 'business',
  'b2bt_basic': 'business', 'b2bt_medium': 'business', 'b2bt_full': 'business',
  'cannabis_basic': 'business', 'cannabis_pro': 'business', 'cannabis_enterprise': 'business',
  'non_cannabis_basic': 'business', 'non_cannabis_pro': 'business', 'non_cannabis_enterprise': 'business',
  'prov_basic': 'provider', 'prov_med': 'provider', 'prov_full': 'provider',
  'cannabis_attorney': 'attorney', 'general_attorney': 'attorney',
  'ph_core': 'public_health', 'ph_professional': 'public_health', 'ph_enterprise': 'public_health',
  'enf_basic': 'regulator_state', 'enf_pro': 'regulator_state', 'enf_enterprise': 'regulator_state',
  'fin_basic': 'business', 'fin_pro': 'business', 'fin_enterprise': 'business',
  'combo_basic': 'regulator_state', 'combo_pro': 'regulator_state', 'combo_enterprise': 'regulator_state',
  'state_authority': 'regulator_state', 'federal_dashboard': 'regulator_federal',
  'gov_office': 'political_executive', 'advocate': 'advocate',
};

interface OpenFreemiusCheckoutOptions {
  planId: string;
  billing: 'monthly' | 'annual';
  licenses?: number;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userName?: string; // Legacy — will be split into first/last
  trial?: boolean;
  coupon?: string;
  onSuccess?: (response: FreemiusCheckoutResponse) => void;
  onCancel?: () => void;
  onTrack?: (event: string, data: any) => void;
}

export interface FreemiusCheckoutResponse {
  user: {
    id: string;
    email: string;
    first: string;
    last: string;
  };
  purchase: {
    plan_id: string;
    license_id: string;
    subscription_id?: string;
    billing_cycle?: string;
  };
  trial?: {
    license_id: string;
    trial_ends_at: string;
  };
}

/**
 * Opens the Freemius Checkout overlay using the modern FS.Checkout constructor API.
 * Falls back to hosted checkout URL if the JS SDK isn't loaded.
 */
export const openFreemiusCheckout = ({
  planId,
  billing,
  licenses = 1,
  userEmail = '',
  userFirstName = '',
  userLastName = '',
  userName = '',
  trial = false,
  coupon,
  onSuccess,
  onCancel,
  onTrack,
}: OpenFreemiusCheckoutOptions) => {
  let freemiusPlanId: number | undefined;
  let productId = import.meta.env.VITE_FREEMIUS_PLUGIN_ID || FREEMIUS_PLUGIN_ID;

  // Check if it's an add-on product first
  if (FREEMIUS_ADDON_MAP[planId]) {
    const mapping = FREEMIUS_ADDON_MAP[planId];
    productId = String(mapping.productId);
    freemiusPlanId = mapping.planId;
  } else {
    freemiusPlanId = FREEMIUS_PLAN_MAP[planId];
  }

  if (!freemiusPlanId) {
    console.error(`Unknown Freemius plan mapping for platform ID: "${planId}"`);
    alert(`Checkout error: Freemius plan mapping not found for "${planId}".`);
    return;
  }

  // Split legacy userName into first/last if separate names aren't provided
  let firstName = userFirstName;
  let lastName = userLastName;
  if (!firstName && userName) {
    const parts = userName.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  const hasUser = !!userEmail;

  // ── Modern FS.Checkout API ──
  if ((window as any).FS?.Checkout) {
    try {
      const checkout = new (window as any).FS.Checkout({
        product_id: productId,
        plan_id: freemiusPlanId,
        image: 'https://ggma-ggma.vercel.app/logo.png',
        billing_cycle: billing === 'annual' ? 'annual' : 'monthly',
        language: 'auto',
        show_refund_badge: true,
        show_reviews: true,
        annual_discount: true,
      });

      checkout.open({
        licenses,
        trial: trial ? 'free' : false,
        ...(coupon ? { coupon, hide_coupon: true } : {}),
        ...(userEmail ? { user_email: userEmail } : {}),
        ...(firstName ? { user_firstname: firstName } : {}),
        ...(lastName ? { user_lastname: lastName } : {}),
        ...(hasUser ? { readonly_user: true } : {}),

        // ── Callbacks ──
        purchaseCompleted: (data: FreemiusCheckoutResponse) => {
          console.log('✅ Freemius purchase completed:', data);

          if (onSuccess) {
            onSuccess(data);
          } else {
            // Default: show success and reload to pick up new subscription state
            alert(
              `🎉 Subscription activated!\n\n` +
              `Plan: ${planId}\n` +
              `Email: ${data.user?.email || userEmail}\n\n` +
              `Your dashboard is being updated...`
            );
            window.location.reload();
          }
        },

        cancel: () => {
          console.log('❌ Freemius checkout cancelled by user');
          if (onCancel) onCancel();
        },

        track: (event: string, data: any) => {
          console.log(`📊 Freemius checkout event: ${event}`, data);
          if (onTrack) onTrack(event, data);
        },
      });

      return; // Overlay opened successfully
    } catch (err) {
      console.error('Error opening Freemius Checkout overlay:', err);
      // Fall through to hosted checkout
    }
  }

  // ── Fallback: Legacy FS.Checkout.configure (pre-2025 SDK) ──
  if ((window as any).FS?.Checkout?.configure) {
    try {
      const handler = (window as any).FS.Checkout.configure({
        plugin_id: productId,
        public_key: FREEMIUS_PUBLIC_KEY,
        plan_id: freemiusPlanId,
        billing_cycle: billing === 'annual' ? 'annual' : 'monthly',
      });

      handler.open({
        email: userEmail,
        name: userName || `${firstName} ${lastName}`.trim(),
        success: (response: any) => {
          console.log('✅ Freemius checkout success (legacy):', response);
          if (onSuccess) {
            onSuccess(response);
          } else {
            alert('Checkout complete! Your subscription is active.');
            window.location.reload();
          }
        },
        cancel: () => {
          console.log('❌ Freemius checkout cancelled');
          if (onCancel) onCancel();
        }
      });

      return;
    } catch (err) {
      console.error('Error opening legacy Freemius Checkout:', err);
    }
  }

  // ── Final Fallback: Redirect to hosted checkout page ──
  console.warn('Freemius JS SDK not loaded. Opening hosted checkout...');
  const params = new URLSearchParams({
    plan_id: String(freemiusPlanId),
    billing_cycle: billing,
    ...(licenses > 1 ? { licenses: String(licenses) } : {}),
    ...(userEmail ? { user_email: userEmail } : {}),
    ...(firstName ? { user_firstname: firstName } : {}),
    ...(lastName ? { user_lastname: lastName } : {}),
    ...(coupon ? { coupon } : {}),
  });
  window.open(
    `https://checkout.freemius.com/mode/dialog/product/${productId}/plan/${freemiusPlanId}/?${params.toString()}`,
    '_blank'
  );
};
