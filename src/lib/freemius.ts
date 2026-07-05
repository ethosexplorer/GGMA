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
  'addon_pt_ai': { productId: 55263, planId: 72879 },
  'addon_pt_insights': { productId: 55264, planId: 72881 },
  'addon_pt_disposable_card': { productId: 55265, planId: 72882 },
  'addon_pt_physical_card': { productId: 55266, planId: 72883 },
  'addon_pt_ai_agent': { productId: 55269, planId: 72886 },
  
  // Backoffice - Virtual Attendant
  'addon_attendant': { productId: 55273, planId: 72890 },
  'bo_add_virtual': { productId: 55273, planId: 72890 },
  
  // Backoffice - Success Manager
  'addon_success_mgr': { productId: 55274, planId: 72891 },
  'bo_add_manager': { productId: 55329, planId: 72948 },
  
  // Backoffice - Integrations
  'addon_integrations': { productId: 55275, planId: 72892 },
  'bo_add_integrations': { productId: 55330, planId: 72949 },
  
  // Backoffice - Support
  'addon_phone_support': { productId: 55276, planId: 72893 },
  'bo_add_support': { productId: 55276, planId: 72893 },
  
  // Backoffice - Multi-state
  'addon_multi_state': { productId: 55277, planId: 72894 },
  'bo_add_multistate': { productId: 55277, planId: 72894 },
  
  'addon_whitelabel_pos': { productId: 55278, planId: 72895 },
  'addon_care_wallet': { productId: 55279, planId: 72896 },
  'addon_onsite_training': { productId: 55280, planId: 72897 },
  'addon_analytics_pro': { productId: 55281, planId: 72898 },
  'addon_delivery': { productId: 55282, planId: 72899 },
  'addon_loyalty': { productId: 55283, planId: 72900 },
  
  // Attorney Backoffice
  'addon_att_basic': { productId: 55284, planId: 72901 },
  'addon_att_pro': { productId: 55286, planId: 72902 },
  'addon_att_ent': { productId: 55287, planId: 72903 },
  
  // Provider Backoffice
  'addon_prov_bo_basic': { productId: 55288, planId: 72905 },
  'addon_prov_bo_pro': { productId: 55289, planId: 72906 },
  'addon_prov_bo_ent': { productId: 52290, planId: 72907 },

  // Remaining Shared Backoffice Add-ons
  'bo_add_callcenter': { productId: 55291, planId: 72908 },
  'bo_add_scheduling': { productId: 55292, planId: 72909 },
  'bo_add_it': { productId: 55295, planId: 72914 },
  'bo_add_crm': { productId: 55296, planId: 72915 },
  'bo_add_reporting': { productId: 55297, planId: 72916 },

  // Federal Add-ons
  'addon_fed_interstate': { productId: 52298, planId: 72918 },
  'addon_fed_research': { productId: 55299, planId: 72919 },
  'addon_fed_enforcement': { productId: 55300, planId: 72920 },
  'addon_fed_economic': { productId: 55301, planId: 72921 },
  'addon_fed_policy': { productId: 55302, planId: 72922 },
  'addon_fed_sylara': { productId: 55303, planId: 72923 },
  'addon_fed_reporting': { productId: 55304, planId: 72924 },
  'addon_fed_state_sync': { productId: 55305, planId: 72925 },
  'addon_fed_samgov': { productId: 55306, planId: 72926 },

  // Public Health Add-ons
  'ph_add_inventory': { productId: 55307, planId: 72927 },
  'ph_add_health_data': { productId: 55308, planId: 72928 },
  'ph_add_risk_monitor': { productId: 55309, planId: 72929 },
  'ph_add_research': { productId: 55310, planId: 72930 },
  'ph_add_multi_lab': { productId: 55311, planId: 72931 },
  'ph_add_ai_safety': { productId: 55312, planId: 72932 },
  'ph_add_reporting': { productId: 55313, planId: 72933 },
  'ph_add_recency': { productId: 55314, planId: 72934 },
  'ph_add_outbreak': { productId: 55315, planId: 72935 },
  'ph_add_lims': { productId: 55316, planId: 72936 },

  // State Authority Add-ons
  'state_add_inventory': { productId: 55317, planId: 72937 },
  'state_add_patient': { productId: 55318, planId: 72938 },
  'state_add_risk': { productId: 55319, planId: 72939 },
  'state_add_revenue': { productId: 55320, planId: 72940 },
  'state_add_multi': { productId: 55321, planId: 72941 },
  'state_add_ai': { productId: 55322, planId: 72942 },
  'state_add_reports': { productId: 55324, planId: 72943 },
  'state_add_interstate': { productId: 55325, planId: 72944 },
  'state_add_fed_sync': { productId: 55326, planId: 72945 },
  'state_add_lab': { productId: 55327, planId: 72946 },
  'state_add_training': { productId: 55328, planId: 72947 },
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
