// ═══════════════════════════════════════════════════════════════════════════════
// GGP-OS Medical Cannabis Reciprocity Knowledge Base
// ═══════════════════════════════════════════════════════════════════════════════

export interface ReciprocityInfo {
  state: string;
  acceptsOutofState: boolean;
  conditions: string;
  possessionLimit?: string;
  purchasingAllowed: boolean;
  notes?: string;
  applicationLink?: string;
}

export const RECIPROCITY_DATA: Record<string, ReciprocityInfo> = {
  "Arkansas": {
    state: "Arkansas",
    acceptsOutofState: true,
    conditions: "Patients visiting this state must obtain a medical cannabis visitor card from their health department. Visiting patient cards are valid for up to 90 days.",
    purchasingAllowed: true,
    applicationLink: "https://mmj.adh.arkansas.gov/"
  },
  "Georgia": {
    state: "Georgia",
    acceptsOutofState: true,
    conditions: "Patients visiting this state with a valid medical cannabis card can ONLY POSSESS up to 20 ounces of low THC oil.",
    possessionLimit: "20 ounces of low THC oil",
    purchasingAllowed: false
  },
  "Hawaii": {
    state: "Hawaii",
    acceptsOutofState: true,
    conditions: "Patients visiting this state must obtain a medical cannabis visitor card from the Hawaii State Department of Health. Cards expire after 21 days. Visitors can obtain two cards each year. Only grants visitor cards to patients with specific conditions.",
    purchasingAllowed: true,
    applicationLink: "https://medmj.ehawaii.gov/medmj/welcome"
  },
  "Iowa": {
    state: "Iowa",
    acceptsOutofState: true,
    conditions: "Patients visiting this state that have a valid medical cannabis card can ONLY POSSESS up to 4.5 grams of THC.",
    possessionLimit: "4.5 grams of THC",
    purchasingAllowed: false
  },
  "Maine": {
    state: "Maine",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "Michigan": {
    state: "Michigan",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "Missouri": {
    state: "Missouri",
    acceptsOutofState: true,
    conditions: "Patients with a valid medical cannabis card from other states can possess cannabis in Missouri.",
    purchasingAllowed: true // Adult use is legal in MO anyway
  },
  "Nevada": {
    state: "Nevada",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "New Hampshire": {
    state: "New Hampshire",
    acceptsOutofState: true,
    conditions: "Patients visiting this state that have a valid medical cannabis card can possess up to 2 grams of cannabis. This protection only extends to patients issued cards for certain conditions.",
    possessionLimit: "2 grams",
    purchasingAllowed: false
  },
  "New Jersey": {
    state: "New Jersey",
    acceptsOutofState: true,
    conditions: "NOT YET KNOWN (Adult use is now legal).",
    purchasingAllowed: true
  },
  "New Mexico": {
    state: "New Mexico",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "Oklahoma": {
    state: "Oklahoma",
    acceptsOutofState: true,
    conditions: "Visiting patients must obtain a visitors card from the Oklahoma Medical Marijuana Authority.",
    purchasingAllowed: true,
    applicationLink: "https://oklahoma.gov/omma/patients-caregivers/patient-licenses.html"
  },
  "Puerto Rico": {
    state: "Puerto Rico",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "Utah": {
    state: "Utah",
    acceptsOutofState: true,
    conditions: "Visiting patient must obtain a medical cannabis visitor's card from the Utah Department of Health. Visitor card expires after 21 days. Visitors can obtain two cards each year. Only grants visitor cards to patients with specific conditions.",
    purchasingAllowed: true,
    applicationLink: "https://medicalcannabis.utah.gov/"
  },
  "District of Columbia": {
    state: "District of Columbia",
    acceptsOutofState: true,
    conditions: "Full dispensary access to any patient in possession of a valid medical cannabis card.",
    purchasingAllowed: true
  },
  "Illinois": {
    state: "Illinois",
    acceptsOutofState: false,
    conditions: "Illinois does not accept out-of-state medical cards. (However, adult-use is legal).",
    purchasingAllowed: false // For medical specific purchases
  }
};

export const checkReciprocity = (stateName: string): ReciprocityInfo | null => {
  const normalized = stateName.toLowerCase();
  for (const [key, value] of Object.entries(RECIPROCITY_DATA)) {
    if (key.toLowerCase() === normalized) {
      return value;
    }
  }
  return null;
};
