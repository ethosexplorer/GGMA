// ═══════════════════════════════════════════════════════════════════════════════
// GGP-OS Nationwide State Cannabis Resources Database
// All 50 States + District of Columbia
// ═══════════════════════════════════════════════════════════════════════════════

export interface StateResource {
  program: string;
  patientPortal: string;
  businessPortal: string;
  guide: string;
  resources: string;
  status?: string;
  year?: string;
  conditions?: string[];
  abbreviation?: string;
  // Compliance & Regulatory fields
  adultUseStatus?: string;
  medicalStatus?: string;
  regulator?: string;
  compliancePage?: string;
  checklistItems?: string[];
  complianceSource?: string;
  biddingPortals?: {
    state: string;
    city: string;
  };
  // Intake Integration fields
  contactPhone?: string;
  contactEmail?: string;
  trackingSystem?: string;
  licenseCaps?: string;
  intakeForms?: { name: string; url: string }[];
  intakeFAQ?: { q: string; a: string }[];
  intakeNotes?: string[];
}

export const STATE_RESOURCES: Record<string, StateResource> = {
  "Alabama": {
    program: "Alabama Medical Cannabis Commission",
    patientPortal: "https://amcc.alabama.gov/patients/",
    businessPortal: "https://amcc.alabama.gov/cannabis-business-applicants-2/",
    guide: "",
    resources: "https://256today.com/north-alabama-physicians-among-first-certified-to-qualify-medical-cannabis-patients/",
    status: "Not Yet Operational", year: "2021", abbreviation: "AL",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "Alabama Medical Cannabis Commission",
    compliancePage: "https://amcc.alabama.gov/",
    checklistItems: ["Licensing","Seed-to-sale tracking","Testing","Packaging","Advertising"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Autism Spectrum Disorder (ASD)","Cancer-related cachexia, nausea or vomiting, weight loss, or chronic pain","Crohn's Disease","Depression","Epilepsy or a condition causing seizures","HIV/AIDS-related nausea or weight loss","Panic disorder","Parkinson's disease","Persistent nausea that is not significantly responsive to traditional treatment","Post Traumatic Stress Disorder (PTSD)","Sickle Cell Anemia","Spasticity associated with a motor neuron disease, including ALS","Spasticity associated with Multiple Sclerosis or a spinal cord injury","Terminal illness","Tourette's Syndrome","A condition causing chronic or intractable pain"],
    contactPhone: "334-585-3375",
    trackingSystem: "State-managed",
    licenseCaps: "Limited — AMCC controls license issuance",
    intakeNotes: [
      "Medical ONLY — NO smoking/vaping flower products allowed",
      "Products: tablets, capsules, tinctures, patches, suppositories, nebulizers, topicals",
      "33 registered certifying physicians statewide as of 5/13/2026",
      "Physicians must be AMCC-registered to certify patients",
      "All applications and exhibits become public record under Alabama law"
    ],
    intakeFAQ: [
      { q: "What products are available in Alabama?", a: "Tablets, capsules, tinctures, patches, suppositories, nebulizers, and topicals. NO smokable or vapeable flower products are permitted." },
      { q: "How do I find a certifying physician?", a: "Check the AMCC registered physician list at amcc.alabama.gov/patients/. There are 33 registered physicians across the state." },
      { q: "What license types are available for businesses?", a: "6 types: Integrated Facility, Cultivator, Processor, Dispensary, Secure Transporter, and State Testing Laboratory." },
      { q: "Can I redact information from my application?", a: "Yes — applicants may redact confidential/proprietary info but must cite statutory authority (§ 36-12-40 et seq., Code of Alabama 1975). AMCC reserves the right to revise redactions." }
    ]
  },
  "Alaska": {
    program: "https://www.commerce.alaska.gov/web/amco/home.aspx",
    patientPortal: "Marijuana Registry Application",
    businessPortal: "https://accis.elicense365.com/#",
    guide: "https://www.commerce.alaska.gov/web/Portals/9/pub/ABC/AlcoholFAQ/Accessing%20the%20Public%20Search%20on%20AK-ACCIS.pdf",
    resources: "https://www.mpp.org/states/alaska/?state=AK",
    status: "Operational", year: "1998", abbreviation: "AK",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Alaska Alcohol & Marijuana Control Office",
    compliancePage: "https://www.commerce.alaska.gov/web/amco/",
    checklistItems: ["License","Inventory tracking","Testing","Labeling","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cachexia","Cancer","Chronic Pain","Glaucoma","HIV or AIDS","Multiple Sclerosis","Nausea","Seizures"],
    contactPhone: "907-269-0350",
    contactEmail: "marijuana.licensing@alaska.gov",
    trackingSystem: "METRC (Franwell) — RFID/barcode seed-to-sale",
    licenseCaps: "No state cap — local govts can restrict",
    intakeNotes: [
      "Uses METRC tracking — all licensees must have internet access",
      "Residency required: all persons with financial interest must be AK residents (PFD eligible)",
      "Must secure premises BEFORE applying — need deed or lease",
      "500 ft buffer from schools, youth centers, religious buildings, correctional facilities",
      "NO delivery permitted under AS 17.38 or 3 AAC 306",
      "Alaska uses 'Retail Marijuana Store' — NOT 'dispensary'",
      "Plan for 4-6 month application process",
      "Communities can opt out by ordinance or petition election"
    ],
    intakeFAQ: [
      { q: "What tracking system does Alaska use?", a: "METRC (Marijuana Enforcement Tracking Reporting Compliance) — real-time RFID/barcode seed-to-sale tracking by Franwell. Internet access is mandatory." },
      { q: "Do I need to be an Alaska resident?", a: "Yes — ALL persons with financial interest in a marijuana business must be Alaska residents eligible for the Permanent Fund Dividend (PFD)." },
      { q: "Can I hold multiple license types?", a: "Yes — except testing facilities, which must be independent and cannot hold other license types." },
      { q: "What are Alaska's personal use rules?", a: "21+ can possess up to 1 oz. Home grow: 6 plants max (3 mature), 12 per dwelling. No cooperative grows." },
      { q: "Can communities opt out?", a: "Yes — local governments can opt out of allowing marijuana businesses by ordinance or petition election (3 AAC 306.200)." }
    ]
  },
  "Arizona": {
    program: "AZDHS | Public Health Licensing - Medical Marijuana",
    patientPortal: "https://individual-licensing.azdhs.gov/s/login/?ec=302&startURL=%2Fs%2F",
    businessPortal: "https://facility-licensing.azdhs.gov/",
    guide: "",
    resources: "https://www.mpp.org/states/arizona/?state=AZ",
    status: "Operational", year: "2011", abbreviation: "AZ",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Arizona Department of Health Services",
    compliancePage: "https://www.azdhs.gov/licensing/medical-marijuana/",
    checklistItems: ["Licensing","Testing","Product rules","Security","Records"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Alzheimer's Disease","Amyotrophic Lateral Sclerosis (Lou Gehrig's disease)","Cachexia or wasting syndrome","Cancer","Chronic pain","Crohn's Disease","Glaucoma","Hepatitis C","HIV or AIDS","Nausea","Persistent Muscle Spasms","PTSD","Seizures"],
    contactPhone: "602-542-1025",
    trackingSystem: "State-managed (AZDHS)",
    licenseCaps: "Dispensary allocation managed by AZDHS annually",
    intakeNotes: [
      "DUAL-USE: Both medical (Prop 203) AND recreational (Prop 207) programs operate simultaneously",
      "Patient card fee: $150 (reduced for SNAP recipients), valid 2 years",
      "Rec: 21+, up to 1 oz (max 5g concentrates). Home grow: 6 plants/person, 12/household",
      "Delivery legal since Nov 1, 2024",
      "Medical dispensaries must be Arizona nonprofit entities",
      "Electronic ID cards — no physical cards mailed",
      "Fingerprinting required for all agents and caregivers",
      "Tax: 5.6% sales + 16% excise = 21.6% total on recreational",
      "⚠️ 2026 BALLOT: Prohibitionist initiative filed to eliminate adult-use sales",
      "$1B+ in tax revenue generated since legalization"
    ],
    intakeForms: [
      { name: "Individual (Patient/Caregiver) Licensing Portal", url: "https://individual-licensing.azdhs.gov/" },
      { name: "Facility (Business) Licensing Portal", url: "https://facility-licensing.azdhs.gov/" },
      { name: "Electronic Card Portal Instructions", url: "https://www.azdhs.gov/documents/licensing/medical-marijuana/portal-instructions.pdf" },
      { name: "Training Resources (MLMS)", url: "https://www.azdhs.gov/licensing/marijuana/index.php#mlms" }
    ],
    intakeFAQ: [
      { q: "Do I still need a medical card if recreational is legal?", a: "Medical cards offer benefits: lower taxes, higher possession limits, cultivation rights within 25-mile boundary, and access to higher-potency products." },
      { q: "Can I grow at home?", a: "Recreational: Yes, up to 6 plants per person, 12 per household, in enclosed locked space. Medical: Only if your residence is 25+ miles from nearest dispensary." },
      { q: "What tracking system does Arizona use?", a: "Arizona uses its own state-managed tracking system through AZDHS (not METRC)." },
      { q: "Do physicians need special certification?", a: "No separate state cannabis certification. Any licensed AZ physician (MD/DO) can certify patients for qualifying conditions." },
      { q: "Can I get cannabis delivered?", a: "Yes, delivery has been legal since November 1, 2024 for both adult-use and medical products." },
      { q: "What are the taxes on recreational?", a: "5.6% state sales tax + 16% excise tax = 21.6% total." }
    ]
  },
  "Arkansas": {
    program: "Medical Marijuana Program",
    patientPortal: "https://mmj.adh.arkansas.gov/",
    businessPortal: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/applications-and-forms/",
    guide: "https://www.dfa.arkansas.gov/wp-content/uploads/00101_-_00118_Redacted.pdf",
    resources: "https://www.mpp.org/states/arkansas/?state=AR",
    status: "Operational", year: "2016", abbreviation: "AR",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Arkansas Medical Marijuana Commission",
    compliancePage: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/",
    checklistItems: ["Licensing","Labeling","Testing","Track-and-trace","Inspections"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["ALS","Alzheimer's disease","Cachexia or wasting syndrome","Cancer","Chronic or debilitating disease","Crohn's disease","Fibromyalgia","Glaucoma","Hepatitis C","HIV/AIDS","Intractable pain","Multiple sclerosis","Peripheral neuropathy","PTSD","Seizures","Severe arthritis","Severe nausea","Severe and persistent muscle spasms","Tourette's syndrome","Ulcerative colitis","Any medical condition approved by the Department of Health"],
    contactPhone: "501-682-4982",
    contactEmail: "mmj@dfa.arkansas.gov",
    trackingSystem: "State-managed (NIC Licensing System)",
    licenseCaps: "Cultivators: 8 CAPPED | Dispensaries: ~40 CAPPED | Processors: Uncapped",
    intakeNotes: [
      "MEDICAL ONLY — no recreational/adult-use program (Issue 4 failed 2022)",
      "NO home cultivation — all product must come from licensed dispensaries",
      "Cultivator + dispensary licenses CAPPED — only way in is Transfer of Ownership",
      "Processor + transporter licenses UNCAPPED — rolling applications via DFA",
      "8-zone system ensures statewide geographic dispensary coverage",
      "Possession: 2.5 oz per 14-day rolling period, tracked to the minute",
      "Payment processing deactivated Sundays 6pm-12am for system maintenance",
      "Allow up to 14 days for application processing",
      "⚠️ Hemp ban court decision affecting market — check DFA for updates"
    ],
    intakeForms: [
      { name: "Processor Application & Instructions", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Processor_ApplicationandInstructions.pdf" },
      { name: "Transporter Application & Instructions", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Transporter_ApplicationandInstructions.pdf" },
      { name: "Transfer of Ownership Application", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Transfer_of_Ownership_Application.pdf" },
      { name: "Transfer of Location Application", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Transfer_of_Location_Application_Cultivation.pdf" },
      { name: "Performance Bond — Cultivation", url: "https://www.dfa.arkansas.gov/wp-content/uploads/PerformanceBondCultivationFacility1.pdf" },
      { name: "Performance Bond — Dispensary", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Performance_Bond_Dispensary.pdf" },
      { name: "AR State Police Background Check Instructions", url: "https://www.dfa.arkansas.gov/wp-content/uploads/MMC_ASP_InstructionSheet.docx" },
      { name: "AR State Police Background Application", url: "https://www.dfa.arkansas.gov/wp-content/uploads/MMC_ASP_BackgroundApplication.pdf" },
      { name: "Change in Information Form", url: "https://www.dfa.arkansas.gov/wp-content/uploads/Change_in_Information.pdf" },
      { name: "Eight Zone Map for Dispensaries", url: "https://www.dfa.arkansas.gov/wp-content/uploads/8Zonemap.pdf" },
      { name: "Patient Registration Forms (ADH)", url: "https://mmj.adh.arkansas.gov/?action=index&subaction=forms" }
    ],
    intakeFAQ: [
      { q: "Can I open a new dispensary?", a: "No — dispensary licenses are capped at ~40 and not accepting new applications. You can pursue a Transfer of Ownership of an existing license." },
      { q: "Can I become a processor?", a: "YES — processor licenses have no cap. Download the application from the DFA website." },
      { q: "How do I apply for a medical card?", a: "Online at mmj.adh.arkansas.gov — click Patient Registration, complete the form, submit physician certification and payment." },
      { q: "How long does processing take?", a: "Up to 14 days from the day after application and payment are received." },
      { q: "Can I grow marijuana at home?", a: "NO. Home cultivation is NOT permitted under Amendment 98. All marijuana must be purchased from licensed dispensaries." },
      { q: "How much can I purchase?", a: "2.5 ounces per 14-day rolling period, tracked to the minute of each purchase." },
      { q: "What if I forget my password?", a: "Use the Reset Password button on the login page. If renewing with a new email, call 501-682-4982 first." },
      { q: "I'm having trouble uploading documents", a: "Max file size 25MB. No ZIP files. No special characters in filenames. Scan at 200 dpi. If still failing, open a support request at cannabislicensing.zendesk.com" },
      { q: "Where do I check application status?", a: "Login to the NIC Licensing System at ar-dfa-public.nls.egov.com — click Applications in the left menu." }
    ]
  },
  "California": {
    program: "https://www.cannabis.ca.gov/",
    patientPortal: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP.aspx",
    businessPortal: "https://www.cannabis.ca.gov/applicants/",
    guide: "",
    resources: "https://www.mpp.org/states/california/?state=CA",
    status: "Operational", year: "1996", abbreviation: "CA",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "California Department of Cannabis Control",
    compliancePage: "https://www.cannabis.ca.gov/",
    checklistItems: ["Cultivator self-inspection","Testing","Packaging","Labor compliance","Track-and-trace"],
    complianceSource: "https://www.cannabis.ca.gov/posts/cannabis-cultivator-self-inspection-checklist/",
    conditions: ["Anorexia","Arthritis","Cachexia","Cancer","Chronic Pain","HIV or AIDS","Glaucoma","Migraine","Persistent Muscle Spasms","Severe Nausea","Seizures","Any debilitating illness deemed appropriate"],
    contactPhone: "1-844-61-CA-DCC",
    contactEmail: "info@cannabis.ca.gov",
    trackingSystem: "METRC (CCTT)",
    licenseCaps: "Varies strictly by local municipality ordinance",
    intakeNotes: [
      "⚠️ DUAL LICENSING: Must secure city/county permit BEFORE applying for state DCC license",
      "Over 60% of CA's 482 cities currently ban retail sales — local ordinance check is CRITICAL",
      "Provisional licenses phased out — all applicants must meet CEQA (environmental) requirements",
      "Labor Peace Agreement (LPA) required for 20+ employees",
      "Patient cards (MMIC) are processed in-person at County Health Departments, NOT at state level",
      "Delivery is permitted statewide, even in cities that ban retail storefronts"
    ],
    intakeForms: [
      { name: "CDPH 9042 (Patient App)", url: "https://www.cdph.ca.gov/Programs/CHSI/CDPH%20Document%20Library/CDPH9042.pdf" },
      { name: "CDPH 9044 (Physician Rec)", url: "https://www.cdph.ca.gov/Programs/CHSI/CDPH%20Document%20Library/CDPH9044.pdf" },
      { name: "DCC License Forms", url: "https://cannabis.ca.gov/resources/forms/" },
      { name: "DCC Accela Portal", url: "https://aca6.accela.com/DCC/Welcome.aspx" }
    ],
    intakeFAQ: [
      { q: "Can I get a DCC license without local approval?", a: "NO. You must have explicit local authorization before DCC will issue a state license." },
      { q: "Where do I apply for a medical card?", a: "California does not process patient cards online. You must apply in person through your local County Health Department." },
      { q: "What tracking system does California use?", a: "METRC for the California Cannabis Track-and-Trace (CCTT) system." },
      { q: "What are the benefits of a state MMIC?", a: "Exempts you from the 15% state cannabis excise tax and standard sales tax. Also allows possession of up to 8 oz of dried flower." }
    ]
  },
  "Colorado": {
    program: "https://cdphe.colorado.gov/",
    patientPortal: "https://cdphe.colorado.gov/medical-marijuana-registry-patients",
    businessPortal: "https://sbg.colorado.gov/med-online-services",
    guide: "",
    resources: "https://www.mpp.org/states/colorado/?state=CO",
    status: "Operational", year: "2000", abbreviation: "CO",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Marijuana Enforcement Division (MED)",
    compliancePage: "https://sbg.colorado.gov/med",
    checklistItems: ["MED rule compliance","Inventory tracking","Security requirements","Packaging","Testing regulations"],
    complianceSource: "https://sbg.colorado.gov/med/laws-and-rules",
    conditions: ["Cancer","Glaucoma","HIV or AIDS","Cachexia","Persistent Muscle Spasms","Seizures","Severe Nausea","Severe Pain","PTSD","Autism Spectrum Disorder","Any condition prescribed an opioid"],
    contactPhone: "303-692-2184 (Patient) / MED Online",
    contactEmail: "medical.marijuana@state.co.us",
    trackingSystem: "METRC",
    licenseCaps: "Local municipality limits apply (No strict state cap)",
    intakeNotes: [
      "⚠️ DUAL LICENSING: Must secure city/county approval alongside MED state license",
      "Finding of Suitability: Extremely strict background and financial review required for all owners before applying",
      "Hospitality Licenses: CO now offers consumption lounge/hospitality licenses, subject to strict local zoning",
      "Patient processing is done entirely online directly through the CDPHE state portal (no county visit required like CA)",
      "State medical card exempts patient from the 15% retail marijuana sales tax"
    ],
    intakeForms: [
      { name: "CDPHE Patient Portal", url: "https://cdphe.colorado.gov/medical-marijuana-registry-patients" },
      { name: "MED Business Applications", url: "https://sbg.colorado.gov/med-regulated-business-applications" },
      { name: "MED Owner Suitability", url: "https://sbg.colorado.gov/med-finding-of-suitability-and-owner-license-applications" }
    ],
    intakeFAQ: [
      { q: "Can I get a MED license without local approval?", a: "No, you must have both state and local approval to operate." },
      { q: "How much can a medical patient purchase?", a: "Up to 2 ounces of flower, 20,000mg of THC in infused products, and 8 grams of concentrate per day." },
      { q: "What are the fees for a medical card?", a: "$29.50 state fee (waivers available for indigent patients). Must be submitted online." },
      { q: "Who can provide a medical certification?", a: "Only a licensed MD or DO in Colorado. Not a PA or nurse practitioner." }
    ]
  },
  "Connecticut": {
    program: "https://portal.ct.gov/cannabis/medical-marijuana-program?language=en_US",
    patientPortal: "https://biznet.ct.gov/AccountMaint/Login.aspx",
    businessPortal: "https://portal.ct.gov/cannabis/knowledge-base/articles/licensing/licensing-home-page?language=en_US",
    guide: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/register-for-a-medical-marijuana-card?language=en_US",
    resources: "https://www.mpp.org/states/connecticut/?state=CT",
    abbreviation: "CT",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Connecticut Department of Consumer Protection",
    compliancePage: "https://portal.ct.gov/cannabis/",
    checklistItems: ["Licensing","Track-and-trace","Testing","Labeling","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Delaware": {
    program: "https://omc.delaware.gov/medical/index.shtml?dc=appProc",
    patientPortal: "https://patients.de.biotr.ac/registration",
    businessPortal: "https://omc.delaware.gov/adult/licensing/contentFolder/pdfs/matrix.pdf?cache=1773361497392",
    guide: "https://omc.delaware.gov/adult/licensing/contentFolder/pdfs/matrix.pdf?cache=1773361497392",
    resources: "https://www.mpp.org/states/delaware/?state=DE",
    abbreviation: "DE",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Delaware Cannabis Control Office",
    compliancePage: "https://omc.delaware.gov/",
    checklistItems: ["Licensing","Testing","Packaging","Records","Security"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "District Of Columbia": {
    program: "https://abca.dc.gov/page/patients%E2%80%94dc-residents",
    patientPortal: "https://octo.quickbase.com/db/bscn22va8?a=dbpage&pageid=23",
    businessPortal: "https://abca.dc.gov/page/medical-cannabis-program#gsc.tab=0",
    guide: "",
    resources: "https://www.mpp.org/states/district-of-columbia/?state=DC",
    abbreviation: "DC",
    adultUseStatus: "Yes/limited",
    medicalStatus: "Yes",
    regulator: "DC Alcoholic Beverage and Cannabis Administration",
    compliancePage: "https://abca.dc.gov/",
    checklistItems: ["Medical authorization","Dispensing rules","Records","Testing"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Florida": {
    program: "https://mmuregistry.flhealth.gov/spa/",
    patientPortal: "https://mmuregistry.flhealth.gov/spa/login",
    businessPortal: "https://knowthefactsmmj.com/wp-content/uploads/_documents/form-dh8013-ommu-042018-application-for-medical-marijuana-treatment-center-registration.pdf",
    guide: "",
    resources: "https://www.mpp.org/states/florida/?state=FL",
    abbreviation: "FL",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Florida Department of Health OMMU",
    compliancePage: "https://knowthefactsmmj.com/",
    checklistItems: ["Medical authorization","Product rules","Testing","Dispensing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Georgia": {
    program: "https://www.gmcc.ga.gov/home",
    patientPortal: "https://dph.georgia.gov/low-thc-oil-registry/patients-and-caregivers",
    businessPortal: "https://www.gmcc.ga.gov/licensing/dispensing-license",
    guide: "https://drive.google.com/file/d/1fE7ssVack5s48xVXcI_yLKZyPoqoIunm/view",
    resources: "https://www.mpp.org/states/georgia/?state=GA",
    abbreviation: "GA",
    adultUseStatus: "No/limited",
    medicalStatus: "Limited",
    regulator: "Georgia Access to Medical Cannabis Commission",
    compliancePage: "https://www.gmcc.ga.gov/",
    checklistItems: ["License","Low-THC limits","Dispensing rules","Records"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Hawaii": {
    program: "https://medmj.ehawaii.gov/medmj/welcome",
    patientPortal: "https://id.hawaii.gov/am/XUI/?realm=/alpha&authIndexType=service&authIndexValue=myHawaii%20Secure%20Login",
    businessPortal: "https://health.hawaii.gov/medicalcannabis/",
    guide: "",
    resources: "https://www.mpp.org/states/hawaii/?state=HI",
    abbreviation: "HI",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Hawaii Department of Health",
    compliancePage: "https://health.hawaii.gov/medicalcannabis/",
    checklistItems: ["Medical licensing","Lab testing","Packaging","Dispensary rules"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Idaho": {
    program: "https://idahocannabis.org/medical",
    patientPortal: "https://idahocannabis.org/medical",
    businessPortal: "https://agri.idaho.gov/",
    guide: "https://agri.idaho.gov/",
    resources: "https://www.mpp.org/states/idaho/?state=ID",
    abbreviation: "ID",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Illinois": {
    program: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html",
    patientPortal: "https://ilogin.illinois.gov/",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/illinois/?state=IL",
    abbreviation: "IL",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Illinois cannabis regulator (IDFPR)",
    compliancePage: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html",
    checklistItems: ["Adult-use licensing","Testing","Labeling","Equity programs","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Indiana": {
    program: "https://indianacannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/indiana/?state=IN",
    abbreviation: "IN",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Iowa": {
    program: "https://hhs.iowa.gov/health-prevention/medical-cannabis/patients-caregivers",
    patientPortal: "https://idph.my.salesforce-sites.com/IowaReg",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/iowa/?state=IA",
    abbreviation: "IA",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "Iowa DHHS",
    compliancePage: "https://hhs.iowa.gov/health-prevention/medical-cannabis/",
    checklistItems: ["Medical product limits","Testing","Labeling","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Kansas": {
    program: "https://kansasstatecannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/kansas/?state=KS",
    abbreviation: "KS",
    adultUseStatus: "Just legalized Feb/Mar 2026",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework yet"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Kentucky": {
    program: "https://kymedcan.ky.gov/Pages/index.aspx",
    patientPortal: "https://kymedcan.ky.gov/patients-and-caregivers/Pages/default.aspx",
    businessPortal: "https://kymedcan.ky.gov/businesses/Pages/default.aspx",
    guide: "",
    resources: "https://www.mpp.org/states/kentucky/?state=KY",
    abbreviation: "KY",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "Kentucky Cabinet for Health and Family Services",
    compliancePage: "https://kymedcan.ky.gov/",
    checklistItems: ["Licensing","Testing","Packaging","Seed-to-sale","Dispensing"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Louisiana": {
    program: "https://ldh.la.gov/page/medical-marijuana",
    patientPortal: "Requires prescription from regular doctor",
    businessPortal: "https://ldh.la.gov/assets/oph/Center-EH/sanitarian/fooddrug/marijuana/Marijuana-Retailer-Plans-Review-Questionnaire---1-26.Fillable.pdf",
    guide: "",
    resources: "https://www.mpp.org/states/louisiana/?state=LA",
    abbreviation: "LA",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Louisiana Department of Health",
    compliancePage: "https://ldh.la.gov/page/medical-marijuana",
    checklistItems: ["Medical cultivation/processing","Testing","Product rules","Retailer permits"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Maine": {
    program: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions",
    patientPortal: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421",
    businessPortal: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421",
    guide: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions",
    resources: "https://www.mpp.org/states/maine/?state=ME",
    abbreviation: "ME",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Maine Office of Cannabis Policy",
    compliancePage: "https://www.maine.gov/dafs/ocp/",
    checklistItems: ["License","Testing","Packaging","Labeling","Labor","Tax"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Maryland": {
    program: "https://cannabis.maryland.gov/Pages/Medical_Cannabis.aspx",
    patientPortal: "https://cannabis.maryland.gov/Pages/patients.aspx",
    businessPortal: "https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx",
    guide: "https://cannabis.maryland.gov/Documents/Infographics/DesignateCaregiver_Patient_Process.pdf",
    resources: "https://www.mpp.org/states/maryland/?state=MD",
    abbreviation: "MD",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Maryland Cannabis Administration",
    compliancePage: "https://cannabis.maryland.gov/",
    checklistItems: ["Licensing","Testing","Advertising","Track-and-trace","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Massachusetts": {
    program: "https://masscannabiscontrol.com/new-patients/register-as-a-new-patient/",
    patientPortal: "https://patient.massciportal.com/mmj-patient/login",
    businessPortal: "https://masscannabiscontrol.com/license-types/",
    guide: "",
    resources: "https://www.mpp.org/states/massachusetts/?state=MA",
    abbreviation: "MA",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Massachusetts Cannabis Control Commission",
    compliancePage: "https://masscannabiscontrol.com/",
    checklistItems: ["License","Testing","Security","Recalls","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Michigan": {
    program: "https://www.michigan.gov/cra/sections/mmp",
    patientPortal: "https://aca-prod.accela.com/MIMM/Default.aspx",
    businessPortal: "https://www.michigan.gov/cra/sections/mmp",
    guide: "",
    resources: "https://www.mpp.org/states/michigan/?state=MI",
    abbreviation: "MI",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Michigan Cannabis Regulatory Agency",
    compliancePage: "https://www.michigan.gov/cra/",
    checklistItems: ["License","Testing","METRC","Packaging","Advertising"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Minnesota": {
    program: "https://mn.gov/ocm/businesses/licensing/license-types/",
    patientPortal: "https://cannabis.web.health.state.mn.us/",
    businessPortal: "https://mn.gov/ocm/businesses/licensing/license-types/",
    guide: "https://www.mda.state.mn.us/plants/hemp/firsttimeapplicants",
    resources: "https://www.mpp.org/states/minnesota/?state=MN",
    abbreviation: "MN",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Minnesota Office of Cannabis Management",
    compliancePage: "https://mn.gov/ocm/",
    checklistItems: ["Licensing","Testing","Packaging","Local approvals"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Mississippi": {
    program: "https://ms-doh-public.nls.egov.com/login",
    patientPortal: "https://www.mmcp.ms.gov/patients-caregivers",
    businessPortal: "https://www.mmcp.ms.gov/businesses",
    guide: "https://msdh.ms.gov/page/30,0,425.html",
    resources: "https://www.mpp.org/states/mississippi/?state=MS",
    abbreviation: "MS",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "Mississippi Medical Cannabis Program",
    compliancePage: "https://www.mmcp.ms.gov/",
    checklistItems: ["Medical licensing","Testing","Labeling","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Missouri": {
    program: "https://mo-public.mycomplia.com/login",
    patientPortal: "https://mo-public.mycomplia.com/register",
    businessPortal: "https://mo-public.mycomplia.com/register",
    guide: "",
    resources: "https://www.mpp.org/states/missouri/?state=MO",
    abbreviation: "MO",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Missouri Division of Cannabis Regulation",
    compliancePage: "https://health.mo.gov/safety/cannabis/",
    checklistItems: ["License","Testing","Packaging","Track-and-trace","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Montana": {
    program: "https://revenue.mt.gov/",
    patientPortal: "https://tap.dor.mt.gov/_/",
    businessPortal: "https://tap.dor.mt.gov/",
    guide: "",
    resources: "https://www.mpp.org/states/montana/?state=MT",
    abbreviation: "MT",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Montana Cannabis Control Division",
    compliancePage: "https://revenue.mt.gov/",
    checklistItems: ["License","Testing","Labeling","Inventory","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Nebraska": {
    program: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply",
    patientPortal: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply",
    businessPortal: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply",
    guide: "",
    resources: "https://www.mpp.org/states/nebraska/?state=NE",
    abbreviation: "NE",
    adultUseStatus: "Just legalized Mar/Apr 2026",
    medicalStatus: "No comprehensive program",
    regulator: "Nebraska Medical Cannabis Commission",
    compliancePage: "https://lcc.nebraska.gov/medical-cannabis/",
    checklistItems: ["Cultivator licensing priority","Residency requirements","Background checks"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Nevada": {
    program: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin",
    patientPortal: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/nevada/?state=NV",
    abbreviation: "NV",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Nevada Cannabis Compliance Board",
    compliancePage: "https://ccb.nv.gov/",
    checklistItems: ["License","Testing","Packaging","Security","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "New Hampshire": {
    program: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/therapeutic-cannabis-applications-and",
    patientPortal: "https://www.dhhs.nh.gov/sites/g/files/ehbemt476/files/documents/2021-11/tcp-applicationpatient.pdf",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/new-hampshire/?state=NH",
    abbreviation: "NH",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "New Hampshire DHHS",
    compliancePage: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/",
    checklistItems: ["Medical cultivation/dispensary rules","Testing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "New Jersey": {
    program: "https://www.nj.gov/cannabis/medicinalcannabis/patient-registration/",
    patientPortal: "https://njmcp.crc.nj.gov/web/#/home/createAdultPatientUser",
    businessPortal: "https://www.nj.gov/cannabis/businesses/recreational/license-application-process/",
    guide: "",
    resources: "https://www.mpp.org/states/new-jersey/?state=NJ",
    abbreviation: "NJ",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "New Jersey Cannabis Regulatory Commission",
    compliancePage: "https://www.nj.gov/cannabis/",
    checklistItems: ["License","Testing","Labeling","Labor","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "New Mexico": {
    program: "https://www.rld.nm.gov/cannabis/licensing/new-applications/apply-for-license/",
    patientPortal: "https://www.rld.nm.gov/cannabis/licensing/new-applications/",
    businessPortal: "https://www.rld.nm.gov/cannabis/licensing/apply-renew-a-cannabis-license/",
    guide: "",
    resources: "https://www.mpp.org/states/new-mexico/?state=NM",
    abbreviation: "NM",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "New Mexico Cannabis Control Division",
    compliancePage: "https://www.rld.nm.gov/cannabis/",
    checklistItems: ["License","Testing","Packaging","Track-and-trace"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "New York": {
    program: "https://cannabis.ny.gov/medical-cannabis-program-applications",
    patientPortal: "https://cannabis.ny.gov/patients",
    businessPortal: "https://cannabis.ny.gov/licensing",
    guide: "",
    resources: "https://www.mpp.org/states/new-york/?state=NY",
    abbreviation: "NY",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "New York Office of Cannabis Management",
    compliancePage: "https://cannabis.ny.gov/",
    checklistItems: ["License","Testing","Labeling","Marketing","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "North Carolina": {
    program: "https://northcarolinastatecannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/north-carolina/?state=NC",
    abbreviation: "NC",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "North Dakota": {
    program: "https://mmregistration.health.nd.gov/",
    patientPortal: "https://mmregistration.health.nd.gov/",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/north-dakota/?state=ND",
    abbreviation: "ND",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "North Dakota DHHS",
    compliancePage: "https://mmregistration.health.nd.gov/",
    checklistItems: ["Medical licensing","Testing","Dispensing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Ohio": {
    program: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana",
    patientPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/patient-and-caregiver-registry",
    businessPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control",
    guide: "",
    resources: "https://www.mpp.org/states/ohio/?state=OH",
    abbreviation: "OH",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Ohio Division of Cannabis Control",
    compliancePage: "https://com.ohio.gov/divisions-and-programs/cannabis-control",
    checklistItems: ["License","Testing","Packaging","Track-and-trace","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Oklahoma": {
    program: "https://oklahoma.gov/omma/apply.html",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/oklahoma/?state=OK",
    abbreviation: "OK",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Oklahoma Medical Marijuana Authority",
    compliancePage: "https://oklahoma.gov/omma/businesses/inspections-and-compliance.html",
    checklistItems: ["Post-approval checklist","OBNDD registration","METRC","Tax compliance","Fire/safety","Water compliance"],
    complianceSource: "https://oklahoma.gov/omma/businesses/inspections-and-compliance.html",
    biddingPortals: {
      state: "https://www.ok.gov/dcs/solicit/app/contractSearch.php",
      city: "https://www.okc.gov/Infrastructure-Development/Bids-Auctions-and-Sales/Bidding"
    }
  },
  "Oregon": {
    program: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx",
    patientPortal: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx#online",
    businessPortal: "https://ommpsystem.oregon.gov/",
    guide: "",
    resources: "https://www.mpp.org/states/oregon/?state=OR",
    abbreviation: "OR",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Oregon Liquor and Cannabis Commission",
    compliancePage: "https://www.oregon.gov/olcc/",
    checklistItems: ["License","Testing","Packaging","Labeling","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Pennsylvania": {
    program: "https://www.pa.gov/services/health/register-for-the-medical-marijuana-program",
    patientPortal: "https://padohmmp.custhelp.com/app/login",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/pennsylvania/?state=PA",
    abbreviation: "PA",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Pennsylvania Department of Health",
    compliancePage: "https://www.pa.gov/services/health/register-for-the-medical-marijuana-program",
    checklistItems: ["Medical licensing","Testing","Dispensing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Rhode Island": {
    program: "https://health.ri.gov/medical-marijuana/information/patients-caregivers",
    patientPortal: "https://cannabislicensing.ri.gov/ricannabis/s/login/",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/rhode-island/?state=RI",
    abbreviation: "RI",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Rhode Island Cannabis Control Commission",
    compliancePage: "https://dbr.ri.gov/cannabis/",
    checklistItems: ["License","Testing","Labeling","Tax","Inspections"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "South Carolina": {
    program: "https://southcarolinastatecannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/south-carolina/?state=SC",
    abbreviation: "SC",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "South Dakota": {
    program: "https://medcannabisapplication.sd.gov/",
    patientPortal: "https://medcannabis.sd.gov/",
    businessPortal: "https://medcannabis.sd.gov/Establishments/Forms.aspx",
    guide: "",
    resources: "https://www.mpp.org/states/south-dakota/?state=SD",
    abbreviation: "SD",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "South Dakota Department of Health",
    compliancePage: "https://medcannabis.sd.gov/",
    checklistItems: ["Medical licensing","Testing","Dispensing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Tennessee": {
    program: "https://www.tn.gov/agriculture/businesses/hemp/hemp-derived-cannabinoids/hemp-derived-cannabinoids-licensing.html",
    patientPortal: "",
    businessPortal: "https://www.tn.gov/abc.html",
    guide: "",
    resources: "https://www.mpp.org/states/tennessee/?state=TN",
    abbreviation: "TN",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Texas": {
    program: "https://www.texas.gov/health-services/texas-medical-marijuana/",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/texas/?state=TX",
    abbreviation: "TX",
    adultUseStatus: "No/limited",
    medicalStatus: "Limited",
    regulator: "Texas Department of Public Safety",
    compliancePage: "https://www.texas.gov/health-services/texas-medical-marijuana/",
    checklistItems: ["Low-THC product rules","Licensing","Testing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Utah": {
    program: "https://medicalcannabis.utah.gov/patients/apply-for-patient-card/",
    patientPortal: "https://id.utah.gov/login",
    businessPortal: "https://medicalcannabis.utah.gov/patients/apply-for-patient-card/",
    guide: "",
    resources: "https://www.mpp.org/states/utah/?state=UT",
    abbreviation: "UT",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "Utah Department of Health and Human Services",
    compliancePage: "https://medicalcannabis.utah.gov/",
    checklistItems: ["Medical licensing","Testing","Labeling","Dispensing"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Vermont": {
    program: "https://ccb.vermont.gov/med-forms",
    patientPortal: "https://ccb.vermont.gov/forms",
    businessPortal: "https://ccb.vermont.gov/applications",
    guide: "",
    resources: "https://www.mpp.org/states/vermont/?state=VT",
    abbreviation: "VT",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Vermont Cannabis Control Board",
    compliancePage: "https://ccb.vermont.gov/",
    checklistItems: ["License","Testing","Packaging","Labeling","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Virginia": {
    program: "https://cca.virginia.gov/medicalcannabis",
    patientPortal: "https://cca.virginia.gov/medicalcannabis/patients",
    businessPortal: "https://cca.virginia.gov/medicalcannabis/patients",
    guide: "",
    resources: "https://www.mpp.org/states/virginia/?state=VA",
    abbreviation: "VA",
    adultUseStatus: "Yes/limited retail",
    medicalStatus: "Yes",
    regulator: "Virginia Cannabis Control Authority",
    compliancePage: "https://cca.virginia.gov/",
    checklistItems: ["License framework","Retail status","Labeling","Records"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "Washington": {
    program: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis/patient-information",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/washington/?state=WA",
    abbreviation: "WA",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Washington State Liquor and Cannabis Board",
    compliancePage: "https://lcb.wa.gov/",
    checklistItems: ["License","Testing","Packaging","Traceability","Taxes"],
    complianceSource: "https://www.nsc.org/cannabis-regulations"
  },
  "West Virginia": {
    program: "https://omc.wv.gov/patient-application/Pages/default.aspx",
    patientPortal: "https://omc.wv.gov/patients/Pages/default.aspx",
    businessPortal: "https://omc.wv.gov/industry/application/Pages/default.aspx",
    guide: "",
    resources: "https://www.mpp.org/states/west-virginia/?state=WV",
    abbreviation: "WV",
    adultUseStatus: "No/limited",
    medicalStatus: "Yes",
    regulator: "West Virginia Office of Medical Cannabis",
    compliancePage: "https://omc.wv.gov/",
    checklistItems: ["Medical licensing","Testing","Dispensing","Records"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws"
  },
  "Wisconsin": {
    program: "https://docs.legis.wisconsin.gov/2025/related/proposals/sb534",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/wisconsin/?state=WI",
    abbreviation: "WI",
    adultUseStatus: "Just legalized March 2026",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework yet"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  },
  "Wyoming": {
    program: "https://wyomingcannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/wyoming/?state=WY",
    abbreviation: "WY",
    adultUseStatus: "No",
    medicalStatus: "No comprehensive program",
    regulator: "State law only",
    compliancePage: "",
    checklistItems: ["No operational cannabis business framework"],
    complianceSource: "https://en.wikipedia.org/wiki/Legality_of_cannabis_by_U.S._jurisdiction"
  }
};

// Helper: find state by name or abbreviation
export const findState = (query: string): string | null => {
  const lower = query.toLowerCase();
  for (const [name, data] of Object.entries(STATE_RESOURCES)) {
    if (lower.includes(name.toLowerCase())) return name;
    if (data.abbreviation && lower === data.abbreviation.toLowerCase()) return name;
  }
  return null;
};

// Helper: get all state names
export const getStateNames = (): string[] => Object.keys(STATE_RESOURCES);

// Helper: count states with active patient portals
export const getActiveStates = (): string[] =>
  Object.entries(STATE_RESOURCES)
    .filter(([, d]) => d.patientPortal && !d.patientPortal.includes('Login Required') && !d.patientPortal.includes('Requires'))
    .map(([name]) => name);
