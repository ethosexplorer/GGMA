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
    intakeForms: [
      { name: "AMCC Patient Registry Instructions", url: "https://amcc.alabama.gov/patients/" },
      { name: "Physician Certification Form", url: "https://amcc.alabama.gov/physicians/" },
      { name: "Business License Applications", url: "https://amcc.alabama.gov/cannabis-business-applicants-2/" }
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
    intakeForms: [
      { name: "AMCO New License Application", url: "https://www.commerce.alaska.gov/web/amco/MarijuanaLicenseApplications.aspx" },
      { name: "Patient Registry Form", url: "https://health.alaska.gov/dph/VitalStats/Pages/marijuana.aspx" },
      { name: "Fingerprint & Background Check", url: "https://www.commerce.alaska.gov/web/amco/FingerprintInformation.aspx" }
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
    program: "https://portal.ct.gov/cannabis/medical-marijuana-program",
    patientPortal: "https://biznet.ct.gov/dcp-mmrp",
    businessPortal: "https://www.elicense.ct.gov/",
    guide: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/register-for-a-medical-marijuana-card",
    resources: "https://www.mpp.org/states/connecticut/?state=CT",
    status: "Operational", year: "2012", abbreviation: "CT",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Department of Consumer Protection (DCP)",
    compliancePage: "https://portal.ct.gov/cannabis/",
    checklistItems: ["Licensing","Track-and-trace","Testing","Labeling","Taxes"],
    complianceSource: "https://portal.ct.gov/cannabis/",
    conditions: ["Cancer","Glaucoma","Parkinson's","MS","Epilepsy","Cachexia","Crohn's","PTSD","Sickle Cell","Tourette's"],
    contactPhone: "(860) 713-6066",
    contactEmail: "dcp.mmp@ct.gov",
    trackingSystem: "BioTrackTHC",
    licenseCaps: "Subject to lottery limitations for non-equity applicants",
    intakeNotes: [
      "⚠️ LOTTERY SYSTEM: Non-equity licenses are heavily restricted and distributed via lottery windows.",
      "Social Equity: Half of all new licenses are reserved for verified Social Equity applicants.",
      "Patients use the DAS BizNet portal; Businesses use the eLicense portal.",
      "Local zoning approval is NOT required to enter the lottery, but IS required before a final license is issued.",
      "As of July 2023, the state eliminated the $100 registration fee for medical patients."
    ],
    intakeForms: [
      { name: "BizNet Patient Portal", url: "https://biznet.ct.gov/dcp-mmrp" },
      { name: "eLicense Portal (Business)", url: "https://www.elicense.ct.gov/" }
    ],
    intakeFAQ: [
      { q: "How does a patient change their designated dispensary?", a: "Patients can log into their BizNet account and change their preferred dispensary facility once every 24 hours." },
      { q: "Does a business need local zoning approval before entering the lottery?", a: "No, applicants do not need local zoning approval to enter the CT lottery, but must obtain it before a final license is issued." },
      { q: "What tracking system does Connecticut use?", a: "Connecticut utilizes BioTrackTHC for its statewide seed-to-sale tracking." },
      { q: "Are there application fees for medical patients?", a: "No, Connecticut eliminated the $100 registration fee for medical patients starting July 1, 2023." }
    ]
  },
  "Delaware": {
    program: "https://omc.delaware.gov/medical/index.shtml",
    patientPortal: "https://dhss.delaware.gov/dhss/dph/hsp/medmarhome.html",
    businessPortal: "https://omb.delaware.gov/marijuana-commissioner/",
    guide: "https://dhss.delaware.gov/dhss/dph/hsp/files/mmpapp.pdf",
    resources: "https://www.mpp.org/states/delaware/?state=DE",
    status: "Operational", year: "2011", abbreviation: "DE",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Office of the Marijuana Commissioner (OMC) / OMM",
    compliancePage: "https://omb.delaware.gov/marijuana-commissioner/",
    checklistItems: ["Testing compliance","Inventory limits","Packaging","Security","Record keeping"],
    complianceSource: "https://omb.delaware.gov/marijuana-commissioner/",
    conditions: ["Any condition deemed appropriate by a physician"],
    contactPhone: "855-420-6797",
    contactEmail: "MedicalMarijuanaDPH@delaware.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "Strict statutory caps (e.g., 30 Retail, 60 Cultivation)",
    intakeNotes: [
      "⚠️ STRICT CAPS: Adult-use licenses are highly competitive with hard caps (30 retail total for the state).",
      "Qualifying Conditions: DE removed its condition list; any physician can recommend for any condition.",
      "Senior Self-Certification: Patients 65+ can self-certify for a medical card without a doctor's signature.",
      "Online Applications: If the physician is registered in the state system, patients can apply entirely online.",
      "No Reciprocity: Out-of-state patients must register with the DE system to purchase."
    ],
    intakeForms: [
      { name: "BioTrack Patient Registration", url: "https://patients.de.biotr.ac/registration" },
      { name: "Paper Application (PDF)", url: "https://dhss.delaware.gov/dhss/dph/hsp/files/mmpapp.pdf" },
      { name: "OMC Licensing Matrix (Business)", url: "https://omc.delaware.gov/adult/licensing/contentFolder/pdfs/matrix.pdf" }
    ],
    intakeFAQ: [
      { q: "Are there limits on how many business licenses will be issued?", a: "Yes, Delaware has strict, hard caps written into law (e.g., exactly 30 retail licenses, 60 cultivation licenses)." },
      { q: "Do seniors need a doctor's note for a medical card?", a: "No, Delaware residents aged 65 and older may self-certify and do not require a physician's signature." },
      { q: "How much is the patient application fee?", a: "$50 for a one-year card. Patients can also opt for 2-year ($75) or 3-year ($100) cards." },
      { q: "Does Delaware accept out-of-state medical cards?", a: "No, Delaware does not have formal reciprocity agreements." }
    ]
  },
  "District Of Columbia": {
    program: "https://abca.dc.gov/page/patients%E2%80%94dc-residents",
    patientPortal: "https://octo.quickbase.com/db/bscn22va8?a=dbpage&pageid=23",
    businessPortal: "https://abca.dc.gov/page/medical-cannabis-program#gsc.tab=0",
    guide: "",
    resources: "https://www.mpp.org/states/district-of-columbia/?state=DC",
    status: "Operational", year: "2010", abbreviation: "DC",
    adultUseStatus: "Yes/limited",
    medicalStatus: "Yes",
    regulator: "Alcoholic Beverage and Cannabis Administration (ABCA)",
    compliancePage: "https://abca.dc.gov/",
    checklistItems: ["Medical authorization","Dispensing rules","Records","Testing"],
    complianceSource: "https://abca.dc.gov/page/medical-cannabis-program",
    conditions: ["Any condition for which treatment with medical cannabis would be beneficial, as determined by the patient's authorized practitioner"],
    contactPhone: "202-442-4423",
    contactEmail: "medicalcannabis@dc.gov",
    trackingSystem: "METRC",
    licenseCaps: "Yes (Controlled by ABCA limits)",
    intakeNotes: [
      "⚠️ REGULATOR CHANGE: The program moved from DC Health to the Alcoholic Beverage and Cannabis Administration (ABCA).",
      "Self-Certification: Any adult 21+ can self-certify as a medical patient without a doctor's recommendation.",
      "Reciprocity: DC accepts medical cannabis cards from ALL U.S. states and territories.",
      "Gifting Economy: Recreational sales remain illegal due to congressional riders, leading to unregulated 'gifting shops'. ABCA is actively cracking down on unlicensed I-71 gifting shops."
    ],
    intakeForms: [
      { name: "ABCA Quickbase Portal (Patients/Businesses)", url: "https://octo.quickbase.com/db/bscn22va8?a=dbpage&pageid=23" },
      { name: "Patient Registration Form", url: "https://abca.dc.gov/page/patients%E2%80%94dc-residents" }
    ],
    intakeFAQ: [
      { q: "Can I self-certify without a doctor?", a: "Yes, anyone 21 or older can self-certify as a medical cannabis patient in DC." },
      { q: "Does DC accept out-of-state cards?", a: "Yes, DC has universal reciprocity and accepts valid medical cards from any state or US territory." },
      { q: "What tracking system does DC use?", a: "DC utilizes METRC for seed-to-sale tracking." },
      { q: "What is an I-71 shop?", a: "Initiative 71 allowed possession and gifting, but not sales. 'Gifting shops' emerged, but ABCA now strictly enforces against them, requiring transition to the regulated medical market." }
    ]
  },
  "Florida": {
    program: "https://mmuregistry.flhealth.gov/spa/",
    patientPortal: "https://mmuregistry.flhealth.gov/spa/login",
    businessPortal: "https://knowthefactsmmj.com/mmtc/",
    guide: "",
    resources: "https://www.mpp.org/states/florida/?state=FL",
    status: "Operational", year: "2016", abbreviation: "FL",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Office of Medical Marijuana Use (OMMU)",
    compliancePage: "https://knowthefactsmmj.com/",
    checklistItems: ["Medical authorization","Product rules","Testing","Dispensing","Records"],
    complianceSource: "https://knowthefactsmmj.com/",
    conditions: ["Cancer","Epilepsy","Glaucoma","HIV/AIDS","PTSD","ALS","Crohn's Disease","Parkinson's","Multiple Sclerosis","Conditions of same kind or class"],
    contactPhone: "800-808-9580",
    contactEmail: "MedicalMarijuanaUse@flhealth.gov",
    trackingSystem: "BioTrack / MMUR",
    licenseCaps: "Strict statutory limits based on active patient population",
    intakeNotes: [
      "⚠️ VERTICAL INTEGRATION: Florida requires full vertical integration. No standalone retail or grow licenses exist.",
      "⚠️ MEDICAL ONLY: Adult use failed in 2024. Market is strictly medical.",
      "Telemedicine is NOT allowed for initial physician exams. Must be in person.",
      "Seasonal residents (31+ consecutive days) are eligible for medical cards with proper documents.",
      "No reciprocity for out-of-state medical cards."
    ],
    intakeForms: [
      { name: "MMUR Patient Portal", url: "https://mmuregistry.flhealth.gov/" },
      { name: "Patient Guides & Forms", url: "https://knowthefactsmmj.com/patients/" },
      { name: "MMTC Business Info", url: "https://knowthefactsmmj.com/mmtc/" }
    ],
    intakeFAQ: [
      { q: "Can I apply for a standalone dispensary license in Florida?", a: "No. Florida requires full vertical integration. You must be licensed as an MMTC." },
      { q: "How much does a patient card cost?", a: "The state fee is $75 annually, plus the qualified physician's consultation fee." },
      { q: "Can seasonal residents get a medical card?", a: "Yes. A seasonal resident who lives in Florida for at least 31 consecutive days can apply." },
      { q: "Is there patient reciprocity in Florida?", a: "No. Florida does not accept out-of-state medical marijuana cards." }
    ]
  },
  "Georgia": {
    program: "https://www.gmcc.ga.gov/home",
    patientPortal: "https://dph.georgia.gov/low-thc-oil-registry/patients-and-caregivers",
    businessPortal: "https://www.gmcc.ga.gov/licensing/dispensing-license",
    guide: "https://drive.google.com/file/d/1fE7ssVack5s48xVXcI_yLKZyPoqoIunm/view",
    resources: "https://www.mpp.org/states/georgia/?state=GA",
    status: "Operational", year: "2015", abbreviation: "GA",
    adultUseStatus: "No",
    medicalStatus: "Limited (Low-THC Only)",
    regulator: "Georgia Access to Medical Cannabis Commission (GMCC)",
    compliancePage: "https://www.gmcc.ga.gov/",
    checklistItems: ["License","Low-THC limits","Dispensing rules","Records"],
    complianceSource: "https://www.gmcc.ga.gov/",
    conditions: ["Cancer","ALS","Seizure disorders","MS","Crohn's Disease","Mitochondrial Disease","Parkinson's","Sickle Cell","Tourette's","Autism","PTSD"],
    contactPhone: "(770) 909-2765",
    contactEmail: "THCRegistry@dph.ga.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "Extremely Limited (6 Producers Total, Dispensing restricted to them)",
    intakeNotes: [
      "⚠️ CLOSED MARKET: Dispensing licenses are restricted ONLY to the six companies that hold Class 1 and Class 2 production licenses. No new entrants.",
      "⚠️ LOW-THC ONLY: Only Low-THC oil (maximum 5% THC content) is permitted. Raw flower, edibles, and vapes are illegal.",
      "Patients cannot register themselves. The physician must submit the application on the patient's behalf.",
      "Requires a notarized Low THC Oil Waiver form.",
      "Patients pick up physical cards at a designated local Public Health Office."
    ],
    intakeForms: [
      { name: "DPH Registry Info", url: "https://dph.georgia.gov/low-thc-oil-registry" },
      { name: "GMCC Business Rules", url: "https://www.gmcc.ga.gov/" }
    ],
    intakeFAQ: [
      { q: "Can a client apply for a retail dispensary in Georgia?", a: "No. Dispensing licenses are restricted ONLY to the six companies that hold production licenses." },
      { q: "What forms of cannabis are legal in Georgia?", a: "Only Low-THC oil (maximum 5% THC content). Raw flower, edibles, and traditional high-THC products are illegal." },
      { q: "Does the GMCC issue the patient cards?", a: "No. The GMCC oversees the businesses. The Department of Public Health (DPH) oversees the patients." }
    ]
  },
  "Hawaii": {
    program: "https://health.hawaii.gov/medicalcannabisregistry/",
    patientPortal: "https://medmj.ehawaii.gov/",
    businessPortal: "https://health.hawaii.gov/medicalcannabis/",
    guide: "",
    resources: "https://www.mpp.org/states/hawaii/?state=HI",
    status: "Operational", year: "2000", abbreviation: "HI",
    adultUseStatus: "No",
    medicalStatus: "Yes",
    regulator: "Hawaii Department of Health (DOH)",
    compliancePage: "https://health.hawaii.gov/medicalcannabis/",
    checklistItems: ["Medical licensing","Lab testing","Packaging","Dispensary rules"],
    complianceSource: "https://health.hawaii.gov/medicalcannabis/",
    conditions: ["ALS","Cancer","Glaucoma","Lupus","MS","Rheumatoid Arthritis","HIV/AIDS","PTSD","Epilepsy","Cachexia","Severe Pain","Severe Nausea","Seizures"],
    contactPhone: "(808) 733-2177",
    contactEmail: "medicalcannabis@doh.hawaii.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "Strict statutory caps per county. Fully vertically integrated.",
    intakeNotes: [
      "⚠️ OSP RECIPROCITY: Out-of-state patients can apply for a temporary 60-day card ($49.50) before arriving. It is NOT automatic reciprocity.",
      "⚠️ DIGITAL CARDS: Hawaii no longer mails physical cards; patients download a digital 329 card to their phones.",
      "Condition requirements will be removed July 1, 2025.",
      "In-state application fee is $38.50 ($35 state fee + $3.50 portal fee).",
      "Market is heavily restricted and strictly vertically integrated."
    ],
    intakeForms: [
      { name: "Patient Portal (eHawaii)", url: "https://medmj.ehawaii.gov/" },
      { name: "DOH Registry Info", url: "https://health.hawaii.gov/medicalcannabisregistry/" },
      { name: "Dispensary Program Info", url: "https://health.hawaii.gov/medicalcannabis/" }
    ],
    intakeFAQ: [
      { q: "Can a tourist purchase medical cannabis in Hawaii?", a: "Yes, if they hold a valid out-of-state medical card and apply for a temporary Hawaii 329 OSP card." },
      { q: "How much does the registry card cost?", a: "$38.50 for in-state residents and $49.50 for out-of-state temporary cards." },
      { q: "Are there standalone grow operations in Hawaii?", a: "No, the market is strictly vertically integrated." },
      { q: "Is adult-use legal in Hawaii?", a: "No. Cannabis is for registered medical patients only." }
    ]
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
    businessPortal: "https://idfpr.illinois.gov/profs/cannabis.asp",
    guide: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html",
    resources: "https://www.mpp.org/states/illinois/?state=IL",
    abbreviation: "IL",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Illinois IDFPR (Dispensaries) / IDPH (Medical) / Dept of Agriculture (Cultivators)",
    compliancePage: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html",
    checklistItems: ["Adult-use licensing","Medical card","Testing","Labeling","Social equity programs","Taxes (6.25-25% by THC)"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Hepatitis C","ALS","Crohn's Disease","Alzheimer's","Cachexia","Muscular Dystrophy","Severe Fibromyalgia","Spinal Cord Injury","PTSD","Epilepsy","Chronic Pain","Migraines","Osteoarthritis","Autism"],
    contactPhone: "(217) 782-4977",
    contactEmail: "DPH.MedicalCannabis@illinois.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "Social equity prioritized. Craft grower caps. Dispensary lottery system.",
    intakeNotes: [
      "⚠️ DUAL-USE STATE: Adult-use + Medical. Patients still benefit from card (lower tax, higher limits).",
      "Medical tax: 1% vs adult-use 6.25-25% based on THC content.",
      "Social equity program — dedicated license category for disadvantaged communities.",
      "280+ dispensary locations statewide. Major MSO market (Cresco, GTI, Verano, Curaleaf).",
      "IDFPR regulates dispensaries. Dept of Agriculture regulates cultivators."
    ],
    intakeForms: [
      { name: "Patient Portal (iLogin)", url: "https://ilogin.illinois.gov/" },
      { name: "IDFPR Cannabis Business", url: "https://idfpr.illinois.gov/profs/cannabis.asp" },
      { name: "Medical Cannabis Info", url: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html" }
    ],
    intakeFAQ: [
      { q: "Do I need a medical card if adult-use is legal?", a: "Not required, but cardholders pay significantly less tax (1% vs up to 25%) and have higher possession limits." },
      { q: "How much does a medical card cost?", a: "$50 for 1 year, $100 for 2 years, $125 for 3 years. Veterans are free." },
      { q: "Can I grow at home?", a: "Medical patients can grow up to 5 plants. Adult-use home cultivation is NOT allowed." },
      { q: "What is the social equity program?", a: "Illinois prioritizes licenses for applicants from communities disproportionately impacted by the war on drugs." }
    ]
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
    businessPortal: "https://hhs.iowa.gov/health-prevention/medical-cannabis/",
    guide: "https://hhs.iowa.gov/health-prevention/medical-cannabis/patients-caregivers",
    resources: "https://www.mpp.org/states/iowa/?state=IA",
    abbreviation: "IA",
    adultUseStatus: "No",
    medicalStatus: "Yes (Very Restricted — Medical Cannabidiol)",
    regulator: "Iowa DHHS",
    compliancePage: "https://hhs.iowa.gov/health-prevention/medical-cannabis/",
    checklistItems: ["Medical product limits","Testing","Labeling","Records","No flower","No home grow"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Seizures","AIDS/HIV","Crohn's Disease","ALS","Parkinson's","MS","Chronic Pain","PTSD","Corticobasal Degeneration","Ulcerative Colitis"],
    contactPhone: "(515) 281-7689",
    contactEmail: "medcbd@idph.iowa.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "Only 2 licensed manufacturers (Bud & Mary's, Iowa Cannabis Company). 5 total dispensary locations.",
    intakeNotes: [
      "⚠️ VERY RESTRICTED: 'Medical Cannabidiol' program — NOT full medical marijuana.",
      "Only 5 dispensary locations statewide (2 companies: Bud & Mary's + Iowa Cannabis Company).",
      "NO flower/smoking allowed — oils, capsules, topicals only.",
      "NO home cultivation, even for patients.",
      "Registration card fee: $100. Renewal: $25."
    ],
    intakeForms: [
      { name: "Patient Registration Portal", url: "https://idph.my.salesforce-sites.com/IowaReg" },
      { name: "DHHS Medical Cannabidiol Info", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis/patients-caregivers" }
    ],
    intakeFAQ: [
      { q: "Can I smoke cannabis in Iowa?", a: "No. Iowa only allows cannabidiol products (oils, capsules, topicals). No flower or vape." },
      { q: "How many dispensaries are there?", a: "Only 5 statewide, operated by 2 companies." },
      { q: "Can I grow at home?", a: "No. Home cultivation is illegal even for registered patients." },
      { q: "What does a card cost?", a: "$100 initial registration, $25 renewal." }
    ]
  },
  "Kansas": {
    program: "https://kansasstatecannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "",
    resources: "https://www.mpp.org/states/kansas/?state=KS",
    abbreviation: "KS",
    adultUseStatus: "No (HB 2679 stalled 2026)",
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
    guide: "https://kymedcan.ky.gov/patients-and-caregivers/Pages/default.aspx",
    resources: "https://www.mpp.org/states/kentucky/?state=KY",
    abbreviation: "KY",
    adultUseStatus: "No",
    medicalStatus: "Yes (New program — operational 2025/2026)",
    regulator: "Kentucky Office of Medical Cannabis (OMC)",
    compliancePage: "https://kymedcan.ky.gov/",
    checklistItems: ["Licensing (lottery-based)","Testing","Packaging","Seed-to-sale tracking","Dispensing","No home grow"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Chronic Pain","Epilepsy","MS","Chronic Nausea","PTSD","Muscular Dystrophy"],
    contactPhone: "(502) 564-7430",
    contactEmail: "CHFS.OMCR@ky.gov",
    trackingSystem: "Metrc",
    licenseCaps: "Lottery-based licensing. Limited dispensary permits per region.",
    intakeNotes: [
      "✅ NEW PROGRAM: Kentucky's medical cannabis program became operational in 2025/2026.",
      "Lottery-based licensing — dispensary permits awarded by lottery.",
      "NO home cultivation allowed.",
      "Seed-to-sale tracking required (Metrc).",
      "Recreational remains fully illegal."
    ],
    intakeForms: [
      { name: "Patient Portal (kymedcan)", url: "https://kymedcan.ky.gov/patients-and-caregivers/Pages/default.aspx" },
      { name: "Business Licensing", url: "https://kymedcan.ky.gov/businesses/Pages/default.aspx" },
      { name: "OMC Main Page", url: "https://kymedcan.ky.gov/Pages/index.aspx" }
    ],
    intakeFAQ: [
      { q: "When did Kentucky legalize medical cannabis?", a: "SB 47 was signed in 2023. The program became operational in 2025 with dispensaries opening in phases." },
      { q: "Can I grow at home?", a: "No. Home cultivation is prohibited." },
      { q: "How are licenses awarded?", a: "Through a lottery system managed by the Office of Medical Cannabis." },
      { q: "Is recreational legal?", a: "No. Only medical cannabis with a valid OMC card." }
    ]
  },
  "Louisiana": {
    program: "https://ldh.la.gov/page/medical-marijuana",
    patientPortal: "No portal needed — any doctor can prescribe",
    businessPortal: "https://ldh.la.gov/assets/oph/Center-EH/sanitarian/fooddrug/marijuana/Marijuana-Retailer-Plans-Review-Questionnaire---1-26.Fillable.pdf",
    guide: "https://ldh.la.gov/page/medical-marijuana",
    resources: "https://www.mpp.org/states/louisiana/?state=LA",
    abbreviation: "LA",
    adultUseStatus: "No (≤14g decriminalized)",
    medicalStatus: "Yes",
    regulator: "Louisiana Department of Health (LDH)",
    compliancePage: "https://ldh.la.gov/page/medical-marijuana",
    checklistItems: ["Medical cultivation/processing","Testing","Product rules","Retailer pharmacy permits","Any doctor can recommend"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Cachexia","Seizure Disorders","Crohn's Disease","Muscular Dystrophy","MS","Spasticity","PTSD","Chronic Pain","Autism","Intractable Pain"],
    contactPhone: "(225) 342-9500",
    contactEmail: "medicalmarijuana@la.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "10 retail pharmacy permits statewide. Each can have up to 2 satellite locations.",
    intakeNotes: [
      "✅ UNIQUE: ANY licensed Louisiana physician can recommend cannabis — no special certification needed.",
      "No 'medical card' system — doctor writes recommendation directly into state system.",
      "10 licensed retail pharmacy permits statewide + satellite locations.",
      "Flower is legal for medical patients.",
      "≤14g possession decriminalized ($100 fine, no jail). Recreational remains illegal.",
      "LDH took over program management from Board of Pharmacy in 2025."
    ],
    intakeForms: [
      { name: "LDH Medical Marijuana Info", url: "https://ldh.la.gov/page/medical-marijuana" },
      { name: "Retailer Application", url: "https://ldh.la.gov/assets/oph/Center-EH/sanitarian/fooddrug/marijuana/Marijuana-Retailer-Plans-Review-Questionnaire---1-26.Fillable.pdf" }
    ],
    intakeFAQ: [
      { q: "Do I need a special marijuana doctor?", a: "No! Any licensed Louisiana physician can recommend medical cannabis. Just ask your regular doctor." },
      { q: "Is there a patient card or registry?", a: "No card system. Your doctor enters the recommendation into the state database and you pick up at a licensed pharmacy." },
      { q: "Is flower legal in Louisiana?", a: "Yes, for medical patients with a valid recommendation." },
      { q: "What about small amounts recreationally?", a: "≤14g is decriminalized ($100 fine, no jail), but recreational use remains technically illegal." }
    ]
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
    regulator: "Maine Office of Cannabis Policy (OCP)",
    compliancePage: "https://www.maine.gov/dafs/ocp/",
    checklistItems: ["License","Testing","Packaging","Labeling","Labor","Tax","Caregiver rules"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Epilepsy","Glaucoma","MS","Cancer","Crohn's Disease","HIV/AIDS","PTSD","Chronic Pain","Hepatitis C","ALS","Alzheimer's","Huntington's Disease","Nails-Patella Syndrome","Inflammatory Bowel Disease"],
    contactPhone: "(207) 287-3282",
    contactEmail: "licensing.ocp@maine.gov",
    trackingSystem: "Metrc",
    licenseCaps: "No strict state cap on licenses. Local municipalities can restrict.",
    intakeNotes: [
      "✅ DUAL-USE: Medical (since 2016) + Adult-Use sales (since 2020).",
      "Strong CAREGIVER culture — unique to Maine. Individual caregivers can grow/sell to patients.",
      "OCP regulates both medical and adult-use programs.",
      "Portland is the hub — most dispensaries and law firms concentrated there.",
      "No shipment of cannabis out of state allowed."
    ],
    intakeForms: [
      { name: "Registry ID Card Instructions", url: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions" },
      { name: "Online Licensing Portal", url: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421" },
      { name: "OCP Main Page", url: "https://www.maine.gov/dafs/ocp/" }
    ],
    intakeFAQ: [
      { q: "What is a caregiver in Maine?", a: "An individual registered with OCP who can grow and provide cannabis to up to 5 patients. Unique to Maine's program." },
      { q: "Do I need a medical card if adult-use is legal?", a: "Not required, but medical patients have no sales tax (vs 10% adult-use) and can designate a caregiver." },
      { q: "How do I get a medical card?", a: "Get a physician certification, then apply online through the OCP licensing portal. Fee varies." },
      { q: "Can I grow at home?", a: "Medical: up to 6 mature plants. Adult-use: up to 3 mature plants per person (6 per household)." }
    ]
  },
  "Maryland": {
    program: "https://cannabis.maryland.gov/Pages/Medical_Cannabis.aspx",
    patientPortal: "https://cannabis.maryland.gov/Pages/patients.aspx",
    businessPortal: "https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx",
    guide: "https://cannabis.maryland.gov/Documents/Infographics/DesignateCaregiver_Patient_Process.pdf",
    resources: "https://www.mpp.org/states/maryland/?state=MD",
    abbreviation: "MD",
    adultUseStatus: "Yes (since July 1, 2023)",
    medicalStatus: "Yes",
    regulator: "Maryland Cannabis Administration (MCA)",
    compliancePage: "https://cannabis.maryland.gov/",
    checklistItems: ["Licensing","Testing","Advertising restrictions","Track-and-trace (Metrc)","Taxes (9% state)","Social equity","Caregiver designation"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cachexia","Anorexia","Chronic Pain","Severe Nausea","Seizures","Severe Muscle Spasms","Glaucoma","PTSD","Chronic Pain"],
    contactPhone: "(410) 487-8100",
    contactEmail: "mdcannabis.mca@maryland.gov",
    trackingSystem: "Metrc",
    licenseCaps: "100+ dispensaries. Social equity licensing prioritized. Micro-licenses available.",
    intakeNotes: [
      "✅ DUAL-USE: Adult-use legalized July 1, 2023. Medical program since 2014.",
      "Maryland Cannabis Administration (MCA) replaced the old MMCC in 2023.",
      "Social equity licensing — priority for disproportionately impacted communities.",
      "9% state cannabis tax on adult-use. Medical patients: sales tax exempt.",
      "Interactive Dispensary Map on MCA website for verified locations.",
      "QR code verification sticker required at all licensed dispensaries.",
      "Home grow: up to 2 plants per person (4 per household) for personal use."
    ],
    intakeForms: [
      { name: "Patient Registration", url: "https://cannabis.maryland.gov/Pages/patients.aspx" },
      { name: "Caregiver Designation Process", url: "https://cannabis.maryland.gov/Documents/Infographics/DesignateCaregiver_Patient_Process.pdf" },
      { name: "Industry Licensees Directory", url: "https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx" },
      { name: "MCA Main Portal", url: "https://cannabis.maryland.gov/" }
    ],
    intakeFAQ: [
      { q: "Do I need a medical card if adult-use is legal?", a: "Not required to purchase, but medical patients are exempt from the 9% state cannabis tax and may have higher possession limits." },
      { q: "How do I verify a dispensary is licensed?", a: "Use the MCA Interactive Dispensary Map or scan the QR code on the verification sticker at any dispensary." },
      { q: "Can I grow at home?", a: "Yes — up to 2 plants per person, 4 per household for personal use." },
      { q: "What is the social equity program?", a: "Maryland prioritizes licenses for applicants from communities disproportionately harmed by cannabis prohibition, including micro-licenses with reduced fees." },
      { q: "How much does a medical card cost?", a: "Registration is free through the MCA. You will need a physician certification (cost varies by provider)." }
    ]
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
    guide: "https://www.michigan.gov/cra/sections/mmp",
    resources: "https://www.mpp.org/states/michigan/?state=MI",
    abbreviation: "MI",
    adultUseStatus: "Yes (since Dec 2019)",
    medicalStatus: "Yes (since 2008)",
    regulator: "Michigan Cannabis Regulatory Agency (CRA)",
    compliancePage: "https://www.michigan.gov/cra/",
    checklistItems: ["License (MRTMA/MMFLA)","Testing","Metrc tracking","Packaging","Advertising","24% wholesale tax"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Chronic Pain","Severe Nausea","Seizures","Severe Muscle Spasms","PTSD","HIV/AIDS","Hepatitis C","ALS","Crohn's Disease","Colitis","Glaucoma","Cancer","Alzheimer's","Nail-Patella Syndrome","Obsessive Compulsive Disorder","Arthritis","Autism","Cerebral Palsy","Tourette Syndrome"],
    contactPhone: "(517) 284-8599",
    contactEmail: "CRA-Compliance@michigan.gov",
    trackingSystem: "Metrc",
    licenseCaps: "838+ active retailers. 823 Class C growers. 273 processors. No strict state cap — market-driven.",
    intakeNotes: [
      "✅ DUAL-USE MEGA-MARKET: $3.17B in 2025 sales. One of the largest US cannabis markets.",
      "CRA regulates both MRTMA (adult-use, Prop 1 2018) and MMFLA (medical).",
      "838+ active retail licenses. Intense price competition — historic lows.",
      "24% wholesale tax on adult-use. 6% sales tax applies to all.",
      "Medical patients: lower tax rate, higher possession limits, caregiver system.",
      "Home grow: up to 12 plants per patient (medical). Adult-use: 12 plants per household.",
      "Border communities (Monroe, Niles, Benton Harbor) = major retail hubs for out-of-state traffic."
    ],
    intakeForms: [
      { name: "Patient Registration (Accela)", url: "https://aca-prod.accela.com/MIMM/Default.aspx" },
      { name: "CRA Medical Marihuana Program", url: "https://www.michigan.gov/cra/sections/mmp" },
      { name: "CRA Main Portal", url: "https://www.michigan.gov/cra/" }
    ],
    intakeFAQ: [
      { q: "Do I need a medical card if adult-use is legal?", a: "Not required, but medical patients pay lower taxes and can possess more. Also access to caregiver system." },
      { q: "How much does a medical card cost?", a: "$40 state registration fee. Physician evaluation typically $100-200." },
      { q: "Can I grow at home?", a: "Medical patients: up to 12 plants. Adult-use: up to 12 plants per household (must be secured)." },
      { q: "Why are Michigan prices so low?", a: "Market oversupply with 838+ retailers and 823+ growers. Intense competition has driven prices to historic lows." },
      { q: "What is the caregiver system?", a: "Registered caregivers can grow up to 12 plants per patient (max 5 patients = 60 plants) and provide cannabis to their patients." }
    ]
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
