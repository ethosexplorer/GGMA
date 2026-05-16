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
    guide: "https://masscannabiscontrol.com/",
    resources: "https://www.mpp.org/states/massachusetts/?state=MA",
    abbreviation: "MA",
    adultUseStatus: "Yes (since Nov 2018)",
    medicalStatus: "Yes (since 2013)",
    regulator: "Massachusetts Cannabis Control Commission (CCC)",
    compliancePage: "https://masscannabiscontrol.com/",
    checklistItems: ["CCC License","Testing","Security plan","Recall procedures","Tax compliance","Social equity","Host community agreement"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Hepatitis C","ALS","Crohn's Disease","Parkinson's Disease","MS","PTSD","Any debilitating condition as determined by physician"],
    contactPhone: "(617) 010-0100",
    contactEmail: "CannabisCommission@mass.gov",
    trackingSystem: "Metrc",
    licenseCaps: "300+ licensed retailers. No strict state cap. Host community agreements required. Social equity priority.",
    intakeNotes: [
      "✅ MATURE DUAL-USE: Adult-use since Nov 2018 (Question 4, 2016). ~$3B annual sales.",
      "CCC regulates all cannabis — adult-use, medical, and social equity programs.",
      "300+ licensed retailers. Competitive market with MSOs and craft operators.",
      "Tax: 10.75% state excise + 6.25% sales tax + up to 3% local option = ~20% total.",
      "Medical patients: no sales tax or excise tax. Registration fee: $50/year.",
      "Home grow: up to 6 plants per person, 12 per household (21+).",
      "Host Community Agreements (HCAs) required — can add up to 3% community impact fee.",
      "Social equity program: priority licensing for communities disproportionately impacted.",
      "Berkshires & border towns = major draw for NY, CT, VT visitors."
    ],
    intakeForms: [
      { name: "Patient Registration", url: "https://masscannabiscontrol.com/new-patients/register-as-a-new-patient/" },
      { name: "Patient Portal Login", url: "https://patient.massciportal.com/mmj-patient/login" },
      { name: "Business License Types", url: "https://masscannabiscontrol.com/license-types/" },
      { name: "CCC Main Portal", url: "https://masscannabiscontrol.com/" }
    ],
    intakeFAQ: [
      { q: "How much is the tax?", a: "Adult-use: 10.75% excise + 6.25% sales tax + up to 3% local = ~20%. Medical: NO tax." },
      { q: "How do I get a medical card?", a: "Register via the Virtual Gateway. See a certified physician. $50/year registration fee. Patients get tax-free cannabis." },
      { q: "Can I grow at home?", a: "Yes — up to 6 plants per person, 12 per household. Must be 21+. Must be out of public view." },
      { q: "What is a Host Community Agreement?", a: "Required agreement between cannabis business and municipality. Can include community impact fee up to 3% of gross sales." },
      { q: "What is social equity?", a: "CCC priority program for applicants from communities disproportionately impacted by marijuana prohibition. Lower fees, technical assistance." }
    ]
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
    adultUseStatus: "Yes (legalized 2023, sales began 2025)",
    medicalStatus: "Yes (since 2014)",
    regulator: "Minnesota Office of Cannabis Management (OCM)",
    compliancePage: "https://mn.gov/ocm/",
    checklistItems: ["OCM Licensing","Testing","Packaging","Local approvals","Social equity","Tribal compacts"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Tourette Syndrome","ALS","Seizures","Severe Muscle Spasms","Crohn's Disease","Terminal Illness","Intractable Pain","PTSD","Autism","Obstructive Sleep Apnea","Alzheimer's","Chronic Pain","Sickle Cell Disease"],
    contactPhone: "(651) 201-5000",
    contactEmail: "cannabis.info@state.mn.us",
    trackingSystem: "Metrc",
    licenseCaps: "~135 licenses issued. ~100 adult-use retail sites + 19 medical retail. Tribal dispensaries separate.",
    intakeNotes: [
      "✅ NEW DUAL-USE: Adult-use legalized May 2023 (HF 100). First retail sales began 2025.",
      "OCM regulates ALL cannabis: adult-use, medical, AND hemp-derived cannabinoids.",
      "Medical Cannabis Combination licenses let existing providers serve both medical + adult-use.",
      "Tribal dispensaries operate under separate compacts — different rules/products/pricing.",
      "Social equity priority: lower-potency edibles were legal first (2023-2024) before full retail.",
      "Home grow: up to 8 plants (4 mature) per household for adults 21+.",
      "Medical patients: sales tax exempt. Adult-use: 10% state tax."
    ],
    intakeForms: [
      { name: "Medical Patient Portal", url: "https://cannabis.web.health.state.mn.us/" },
      { name: "OCM Business Licensing", url: "https://mn.gov/ocm/businesses/licensing/license-types/" },
      { name: "Hemp First-Time Applicants", url: "https://www.mda.state.mn.us/plants/hemp/firsttimeapplicants" },
      { name: "OCM Main Portal", url: "https://mn.gov/ocm/" }
    ],
    intakeFAQ: [
      { q: "When did Minnesota legalize?", a: "HF 100 was signed May 30, 2023. Lower-potency edibles became legal immediately. Full adult-use retail sales began in 2025." },
      { q: "Do I need a medical card?", a: "Not for adult-use purchases (21+). But medical patients get tax exemptions and access to pharmacist consultations." },
      { q: "Can I grow at home?", a: "Yes — up to 8 plants per household (max 4 mature) for adults 21+." },
      { q: "What about tribal dispensaries?", a: "Tribal nations operate dispensaries on tribal lands under separate compacts. Products, pricing, and tax may differ from state-licensed shops." },
      { q: "How much is the tax?", a: "10% state cannabis tax on adult-use. Medical purchases are sales tax exempt." }
    ]
  },
  "Mississippi": {
    program: "https://ms-doh-public.nls.egov.com/login",
    patientPortal: "https://www.mmcp.ms.gov/patients-caregivers",
    businessPortal: "https://www.mmcp.ms.gov/businesses",
    guide: "https://msdh.ms.gov/page/30,0,425.html",
    resources: "https://www.mpp.org/states/mississippi/?state=MS",
    abbreviation: "MS",
    adultUseStatus: "No",
    medicalStatus: "Yes (SB 2095, signed Feb 2022)",
    regulator: "Mississippi Medical Cannabis Program (MMCP / MSDH)",
    compliancePage: "https://www.mmcp.ms.gov/",
    checklistItems: ["MMCP License","Lab testing","Labeling/Packaging","Record keeping","BioTrack","3oz monthly limit"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Epilepsy","Seizure disorders","Parkinson's Disease","Huntington's Disease","Muscular Dystrophy","Glaucoma","Spastic Quadriplegia","HIV/AIDS","Hepatitis C","ALS","Crohn's Disease","Ulcerative Colitis","Sickle Cell","Alzheimer's","Chronic Pain","PTSD","Spinal Cord Injury","Traumatic Brain Injury","Chronic Nausea","Cachexia","Agitation of Dementia","Multiple Sclerosis"],
    contactPhone: "(601) 576-7400",
    contactEmail: "MMCP@msdh.ms.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "~200+ licensed dispensaries. Multiple license types. County opt-out allowed.",
    intakeNotes: [
      "✅ MEDICAL ONLY: SB 2095 signed Feb 2022. First dispensaries opened 2024.",
      "MMCP under Mississippi State Department of Health (MSDH) regulates.",
      "Patient limit: 3 ounces per month (can petition for more with physician).",
      "~200+ licensed dispensaries statewide. Growing market.",
      "Counties/municipalities can opt OUT of allowing cannabis businesses.",
      "No home cultivation allowed.",
      "DeSoto County (Memphis metro) = highest concentration — TN patient draw.",
      "23 qualifying conditions — one of the broadest lists nationally."
    ],
    intakeForms: [
      { name: "Patient Registration Portal", url: "https://ms-doh-public.nls.egov.com/login" },
      { name: "MMCP Patients & Caregivers", url: "https://www.mmcp.ms.gov/patients-caregivers" },
      { name: "MMCP Business Registration", url: "https://www.mmcp.ms.gov/businesses" },
      { name: "MSDH Program Guide", url: "https://msdh.ms.gov/page/30,0,425.html" }
    ],
    intakeFAQ: [
      { q: "When did Mississippi legalize medical?", a: "SB 2095 was signed February 2, 2022. First dispensaries opened in 2024." },
      { q: "How much can I purchase?", a: "3 ounces per month. Physicians can petition MSDH for up to 6 ounces/month for certain conditions." },
      { q: "Can I grow at home?", a: "No. Home cultivation is NOT allowed in Mississippi." },
      { q: "Can my county opt out?", a: "Yes. Counties and municipalities can vote to opt out of allowing cannabis businesses within their borders." },
      { q: "What happened to Initiative 65?", a: "The MS Supreme Court struck down Initiative 65 in May 2021. The legislature then passed SB 2095 as a replacement in Feb 2022." }
    ]
  },
  "Missouri": {
    program: "https://mo-public.mycomplia.com/login",
    patientPortal: "https://mo-public.mycomplia.com/register",
    businessPortal: "https://mo-public.mycomplia.com/register",
    guide: "https://health.mo.gov/safety/cannabis/",
    resources: "https://www.mpp.org/states/missouri/?state=MO",
    abbreviation: "MO",
    adultUseStatus: "Yes (Amendment 3, Nov 2022. Sales Feb 2023)",
    medicalStatus: "Yes (Amendment 2, 2018)",
    regulator: "Missouri Division of Cannabis Regulation (DCR / DHSS)",
    compliancePage: "https://health.mo.gov/safety/cannabis/",
    checklistItems: ["DCR License","Lab testing","Metrc tracking","Packaging","Tax compliance","Verified Dispensary decal"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cancer","Epilepsy","Glaucoma","Intractable Migraines","Chronic Pain","Debilitating Psychiatric Disorders","HIV/AIDS","Hepatitis C","ALS","Crohn's Disease","Huntington's Disease","Parkinson's Disease","MS","Tourette Syndrome","Neuropathies","Terminal Illness","Autism","PTSD","Sickle Cell"],
    contactPhone: "(866) 219-0165",
    contactEmail: "medicalmarijuanainfo@health.mo.gov",
    trackingSystem: "Metrc",
    licenseCaps: "200+ licensed dispensaries. ~$2B annual market. No strict retailer cap. Comprehensive licenses.",
    intakeNotes: [
      "✅ DUAL-USE: Amendment 3 passed Nov 2022. Adult-use sales began Feb 3, 2023.",
      "DCR under DHSS regulates. 'Verified Dispensary' decal program for consumer safety.",
      "200+ licensed dispensaries statewide. Comprehensive (vertically integrated) licenses available.",
      "Tax: 6% state excise on adult-use. NO additional local option tax.",
      "Medical patients: 4% sales tax (reduced from 6%). Caregiver system available.",
      "Home grow: up to 6 flowering, 6 vegetative, 6 clones for patients. Adults: 6 flowering, 6 veg, 6 clones.",
      "License types: DIS (dispensary), CUL (cultivator), MAN (manufacturer), TES (testing).",
      "Mycomplia portal for patient/business registration."
    ],
    intakeForms: [
      { name: "Patient/Business Portal (Mycomplia)", url: "https://mo-public.mycomplia.com/login" },
      { name: "Patient Registration", url: "https://mo-public.mycomplia.com/register" },
      { name: "DHSS Cannabis Page", url: "https://health.mo.gov/safety/cannabis/" },
      { name: "DCR Licensed Facility Map", url: "https://health.mo.gov/safety/cannabis/" }
    ],
    intakeFAQ: [
      { q: "When did MO legalize adult-use?", a: "Amendment 3 passed November 2022. Adult-use sales began February 3, 2023." },
      { q: "What is the tax?", a: "6% state excise on adult-use (no local add-on). Medical: 4% sales tax." },
      { q: "Can I grow at home?", a: "Yes — patients can grow 6 flowering + 6 vegetative + 6 clones. Adults 21+ same limits." },
      { q: "What is the Verified Dispensary program?", a: "State-issued decal with QR code for consumer safety. Look for it in dispensary windows." },
      { q: "What is Mycomplia?", a: "The state's online portal for patient registration and business licensing at mo-public.mycomplia.com." }
    ]
  },
  "Montana": {
    program: "https://mtrevenue.gov/cannabis/",
    patientPortal: "https://tap.dor.mt.gov/_/",
    businessPortal: "https://tap.dor.mt.gov/",
    guide: "https://mtrevenue.gov/cannabis/",
    resources: "https://www.mpp.org/states/montana/?state=MT",
    abbreviation: "MT",
    adultUseStatus: "Yes (I-190, Nov 2020. Sales Jan 2022)",
    medicalStatus: "Yes (I-148, 2004)",
    regulator: "Montana Cannabis Control Division (CCD) under DOR",
    compliancePage: "https://mtrevenue.gov/cannabis/",
    checklistItems: ["CCD License","Lab testing","METRC tracking","Packaging/Labeling","Tax compliance (20% rec / 4% med)","Local-option compliance","Verified facility decal"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Cachexia","Severe Chronic Pain","Intractable Nausea/Vomiting","Epilepsy/Seizure Disorders","Multiple Sclerosis","Crohn's Disease","Painful Peripheral Neuropathy","PTSD","CNS Disorder (Spasticity/Muscle Spasms)","Hospice Care"],
    contactPhone: "(406) 444-0551",
    contactEmail: "DORCannabis@mt.gov",
    trackingSystem: "METRC",
    licenseCaps: "Hundreds of licensed dispensary sites statewide. Market-driven — no strict state cap. Local jurisdictions may restrict.",
    intakeNotes: [
      "✅ DUAL-USE: I-190 passed Nov 2020. Adult-use sales began Jan 1, 2022. Medical since I-148 (2004).",
      "Cannabis Control Division (CCD) under Department of Revenue regulates all cannabis.",
      "Tax: 20% state tax on adult-use. Medical patients: only 4% tax.",
      "Patient card fee: $20 (non-refundable). Applied through TAP (TransAction Portal).",
      "Home grow: medical patients can grow up to 4 mature / 4 seedlings. Adult-use: 2 mature per person.",
      "Concentrations in Billings, Missoula, Bozeman, Helena, Kalispell, Butte, Great Falls.",
      "Some counties/municipalities have opted out of adult-use sales.",
      "METRC seed-to-sale tracking required for all licensees."
    ],
    intakeForms: [
      { name: "Patient Registration (TAP Portal)", url: "https://tap.dor.mt.gov/_/" },
      { name: "Business Licensing (TAP Portal)", url: "https://tap.dor.mt.gov/" },
      { name: "CCD Cannabis Info", url: "https://mtrevenue.gov/cannabis/" },
      { name: "Licensed Facility List", url: "https://mtrevenue.gov/cannabis/" }
    ],
    intakeFAQ: [
      { q: "When did Montana legalize adult-use?", a: "I-190 passed November 2020. Adult-use sales began January 1, 2022." },
      { q: "What is the tax difference?", a: "Adult-use: 20% state tax. Medical patients: only 4% tax — a huge savings. Card is $20/year." },
      { q: "How do I get a medical card?", a: "See a Montana-licensed physician (MD/DO), get a certification, then apply online through TAP (TransAction Portal). $20 fee." },
      { q: "Can I grow at home?", a: "Medical patients: up to 4 mature + 4 seedlings. Adults 21+: up to 2 mature plants per person." },
      { q: "Can my county opt out?", a: "Yes. Some counties and municipalities have opted out of allowing adult-use cannabis businesses." }
    ]
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
    program: "https://ccb.nv.gov/",
    patientPortal: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin",
    businessPortal: "https://ccb.nv.gov/",
    guide: "https://ccb.nv.gov/",
    resources: "https://www.mpp.org/states/nevada/?state=NV",
    abbreviation: "NV",
    adultUseStatus: "Yes (Question 2, Nov 2016. Sales July 2017)",
    medicalStatus: "Yes (Question 9, 2000)",
    regulator: "Nevada Cannabis Compliance Board (CCB)",
    compliancePage: "https://ccb.nv.gov/",
    checklistItems: ["CCB License","Lab testing","METRC tracking","Packaging/Labeling","Tax compliance (10% retail / 15% wholesale)","Security plan","Limited-license compliance"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["AIDS","Anorexia/Cachexia","Anxiety Disorder","Autism Spectrum Disorder","Autoimmune Disease","Cancer","Opioid Dependence/Addiction","Glaucoma","HIV/AIDS","Muscle Spasms (MS)","Nausea","Neuropathic Conditions","Seizures/Epilepsy","Severe/Chronic Pain"],
    contactPhone: "(775) 687-7670",
    contactEmail: "ccbinfo@ccb.nv.gov",
    trackingSystem: "METRC",
    licenseCaps: "LIMITED-LICENSE market. No open application window. Market entry via purchase/relocation of existing licenses (CCB approval required).",
    intakeNotes: [
      "✅ MATURE DUAL-USE: Question 2 passed Nov 2016. Adult-use sales began July 1, 2017.",
      "CCB regulates all cannabis. LIMITED-LICENSE market — no new retail licenses issued openly.",
      "Tax: 10% retail excise on adult-use. Medical patients EXEMPT from retail excise. 15% wholesale tax applies to all.",
      "Patient card: $50/year via DPBH. Physician certification required.",
      "Tourism-driven market — Las Vegas Strip dispensaries dominate revenue.",
      "Planet 13 = world's largest dispensary (entertainment complex near Strip).",
      "Tribal cannabis establishments operate under sovereign authority — NOT CCB-licensed.",
      "Home grow: medical patients only — up to 12 plants if >25 miles from nearest dispensary. No adult-use home grow.",
      "Key markets: Las Vegas, Henderson, North Las Vegas, Reno, Sparks, Carson City."
    ],
    intakeForms: [
      { name: "Patient Registry Portal", url: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin" },
      { name: "CCB Main Portal", url: "https://ccb.nv.gov/" },
      { name: "CCB License Search", url: "https://ccb.nv.gov/" },
      { name: "DPBH Medical Program", url: "https://dpbh.nv.gov/Reg/MME-Registry/MME_Registry_-_Home/" }
    ],
    intakeFAQ: [
      { q: "When did Nevada legalize adult-use?", a: "Question 2 passed November 2016. Sales began July 1, 2017 — one of the first states." },
      { q: "What is the tax?", a: "10% retail excise on adult-use (medical patients EXEMPT). Plus 15% wholesale tax on all cannabis. Plus standard sales tax." },
      { q: "Is it a limited-license market?", a: "Yes. Nevada caps retail licenses. No open application window — entry is via purchasing/relocating existing licenses with CCB approval." },
      { q: "Can I grow at home?", a: "Medical patients only, and only if you live >25 miles from the nearest dispensary (up to 12 plants). NO adult-use home grow." },
      { q: "What about tribal dispensaries?", a: "Tribal cannabis operations are sovereign and NOT regulated by the CCB. They are not on the state's licensed retailer list." }
    ]
  },
  "New Hampshire": {
    program: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/",
    patientPortal: "https://www.dhhs.nh.gov/sites/g/files/ehbemt476/files/documents/2021-11/tcp-applicationpatient.pdf",
    businessPortal: "",
    guide: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/therapeutic-cannabis-applications-and",
    resources: "https://www.mpp.org/states/new-hampshire/?state=NH",
    abbreviation: "NH",
    adultUseStatus: "No (Medical only — recreational illegal)",
    medicalStatus: "Yes (HB 573, 2013. Therapeutic Cannabis Program)",
    regulator: "NH Department of Health and Human Services (DHHS) — Therapeutic Cannabis Program (TCP)",
    compliancePage: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/",
    checklistItems: ["ATC License (vertically integrated)","Lab testing","Patient verification","Records retention","Not-for-profit requirement"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Autism Spectrum Disorder (21+)","Generalized Anxiety Disorder","PTSD (moderate/severe)","Chronic Pain (moderate/severe)","Opioid Use Disorder (w/ addiction treatment)","Cancer","ALS","Crohn's Disease","Epilepsy","Glaucoma","Hepatitis C","HIV/AIDS","Lupus","Multiple Sclerosis","Muscular Dystrophy","Parkinson's Disease","Spinal Cord Injury/Disease","Traumatic Brain Injury","Ulcerative Colitis","Any terminal/debilitating condition (provider-determined)"],
    contactPhone: "(603) 271-9520",
    contactEmail: "DHHS-TCP@dhhs.nh.gov",
    trackingSystem: "BioTrack",
    licenseCaps: "ONLY 7 ATCs statewide. 3 operators: GraniteLeaf Cannabis, Sanctuary Medicinals, Temescal Wellness. Vertically integrated, not-for-profit.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: HB 573 (2013). NO adult-use. Recreational cannabis is ILLEGAL in NH.",
      "Only 7 Alternative Treatment Centers (ATCs) statewide — most restrictive in New England.",
      "3 licensed operators: GraniteLeaf Cannabis (3 ATCs), Sanctuary Medicinals (2 ATCs), Temescal Wellness (2 ATCs).",
      "ATCs are NOT-FOR-PROFIT, vertically integrated (grow, process, sell).",
      "TAX EXEMPT: No sales tax in NH. No excise tax on therapeutic cannabis.",
      "Patient card: $50/year ($25 for Medicaid/SSI). Requires NH-licensed provider certification.",
      "OUT-OF-STATE RECIPROCITY: Visiting patients with valid cards from other states or Canada can purchase.",
      "Providers: MD, APRN, PA, dentist, optometrist, podiatrist, or naturopathic doctor can certify.",
      "Locations: Merrimack, Dover, Keene, Plymouth, Conway, Lebanon, Chichester."
    ],
    intakeForms: [
      { name: "Patient Application (PDF)", url: "https://www.dhhs.nh.gov/sites/g/files/ehbemt476/files/documents/2021-11/tcp-applicationpatient.pdf" },
      { name: "DHHS TCP Program Page", url: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/" },
      { name: "Provider Certification Form", url: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/therapeutic-cannabis-applications-and" }
    ],
    intakeFAQ: [
      { q: "Is recreational cannabis legal in NH?", a: "NO. New Hampshire is MEDICAL ONLY. Recreational cannabis is illegal." },
      { q: "How many dispensaries are there?", a: "Only 7 ATCs (Alternative Treatment Centers) statewide, run by 3 operators. Very limited access." },
      { q: "Is there any tax?", a: "NO — New Hampshire has no sales tax, and medical cannabis is exempt from any excise. Tax-free." },
      { q: "Can out-of-state patients purchase?", a: "YES — NH has reciprocity. Visiting patients with valid cards from other states or Canada can purchase." },
      { q: "What does a card cost?", a: "$50/year standard, $25/year for Medicaid/SSI recipients." },
      { q: "Who can certify me?", a: "MD, APRN, PA, dentist, optometrist, podiatrist, or naturopathic doctor licensed in NH." }
    ]
  },
  "New Jersey": {
    program: "https://www.nj.gov/cannabis/",
    patientPortal: "https://njmcp.crc.nj.gov/web/#/home/createAdultPatientUser",
    businessPortal: "https://www.nj.gov/cannabis/businesses/recreational/license-application-process/",
    guide: "https://www.nj.gov/cannabis/medicinalcannabis/patient-registration/",
    resources: "https://www.mpp.org/states/new-jersey/?state=NJ",
    abbreviation: "NJ",
    adultUseStatus: "Yes (NJCREAMMA, Feb 2021. Sales April 2022)",
    medicalStatus: "Yes (Compassionate Use Act, 2010)",
    regulator: "New Jersey Cannabis Regulatory Commission (CRC)",
    compliancePage: "https://www.nj.gov/cannabis/",
    checklistItems: ["CRC License","Lab testing","Packaging/Labeling","Labor Peace Agreement","Social equity compliance","Tax compliance (6.625% + muni)","Municipal authorization"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["ALS","Anxiety","Cancer","Chronic Pain","Dysmenorrhea","Glaucoma","IBD (Crohn's)","Intractable Skeletal Muscular Spasticity","Migraine","Multiple Sclerosis","Muscular Dystrophy","Opioid Use Disorder","PTSD","Seizure Disorders/Epilepsy","Terminal Illness (<12 months)","Tourette Syndrome","HIV/AIDS"],
    contactPhone: "(609) 376-5550",
    contactEmail: "cannabis@nj.gov",
    trackingSystem: "Metrc",
    licenseCaps: "No strict cap on total licenses. License types: Cultivator, Manufacturer, Retailer, Wholesaler, Distributor, Delivery, Microbusiness. Municipal opt-in required.",
    intakeNotes: [
      "✅ DUAL-USE: NJCREAMMA signed Feb 2021. Adult-use sales began April 21, 2022.",
      "CRC (Cannabis Regulatory Commission) regulates all cannabis. Municipal opt-in required.",
      "Tax: 6.625% state sales tax on adult-use. Medical patients EXEMPT from sales tax.",
      "Municipal transfer tax: up to 2% additional. Social Equity Excise Fee on cultivators ($2.50/oz).",
      "Patient card: FREE digital card. Physical card: $10. Requires CRC-registered practitioner.",
      "Densely populated state — strong demand across North, Central, and South Jersey.",
      "License types include Microbusiness (small operators) and Delivery services.",
      "Key markets: Newark, Jersey City, Hoboken, Paterson, Edison, Atlantic City, Cherry Hill, Trenton."
    ],
    intakeForms: [
      { name: "Patient Registration Portal (NJMCP)", url: "https://njmcp.crc.nj.gov/web/#/home/createAdultPatientUser" },
      { name: "CRC Business Licensing", url: "https://www.nj.gov/cannabis/businesses/recreational/license-application-process/" },
      { name: "CRC Dispensary Finder", url: "https://njcrcgov.info/dispensary" },
      { name: "CRC Main Portal", url: "https://www.nj.gov/cannabis/" }
    ],
    intakeFAQ: [
      { q: "When did NJ legalize adult-use?", a: "NJCREAMMA was signed Feb 2021. Retail sales began April 21, 2022." },
      { q: "What is the tax?", a: "6.625% state sales tax on adult-use (medical patients EXEMPT). Plus up to 2% municipal transfer tax." },
      { q: "How much does a medical card cost?", a: "FREE digital card. Physical card: $10. Requires evaluation by a CRC-registered practitioner." },
      { q: "Do municipalities have to opt in?", a: "Yes. Each municipality must authorize cannabis businesses to operate within their borders." },
      { q: "What license types are available?", a: "Cultivator, Manufacturer, Retailer, Wholesaler, Distributor, Delivery, and Microbusiness." }
    ]
  },
  "New Mexico": {
    program: "https://www.rld.nm.gov/cannabis/licensing/new-applications/apply-for-license/",
    patientPortal: "https://www.rld.nm.gov/cannabis/licensing/new-applications/",
    businessPortal: "https://www.rld.nm.gov/cannabis/licensing/apply-renew-a-cannabis-license/",
    guide: "https://www.nmhealth.org/about/phd/mcp/",
    resources: "https://www.mpp.org/states/new-mexico/?state=NM",
    abbreviation: "NM",
    adultUseStatus: "Yes (Cannabis Regulation Act, 2021)",
    medicalStatus: "Yes (Lynn and Erin Compassionate Use Act, 2007)",
    regulator: "Cannabis Control Division (CCD) under NM Regulation & Licensing Dept",
    compliancePage: "https://www.rld.nm.gov/cannabis/compliance/",
    checklistItems: ["CCD License","Lab testing (BioTrack)","Child-resistant packaging","Tamper-evident sealing","Tax compliance (13% excise + gross receipts)"],
    complianceSource: "https://www.nsc.org/cannabis-regulations",
    conditions: ["Alzheimer's Disease","ALS","Anxiety Disorder","Autism Spectrum Disorder","Cancer","Crohn's Disease","Spinal Cord Damage","Epilepsy","Friedreich's Ataxia","Glaucoma","Hepatitis C","HIV/AIDS","Hospice Care","Huntington's Disease","Inclusion Body Myositis","Autoimmune Arthritis","Insomnia","Intractable Nausea","Lewy Body Disease","Multiple Sclerosis","Sleep Apnea","Opioid Use Disorder","Peripheral Neuropathy","Parkinson's Disease","PTSD","Anorexia/Cachexia","Severe Chronic Pain","Cervical Dystonia","Spinal Muscular Atrophy","Ulcerative Colitis"],
    contactPhone: "(505) 476-4995",
    contactEmail: "Cannabis.Control@state.nm.us",
    trackingSystem: "BioTrack",
    licenseCaps: "No statewide cap on total licenses. Local jurisdictions may limit density/locations.",
    intakeNotes: [
      "✅ DUAL-USE: Cannabis Regulation Act passed 2021. Adult-use sales began April 2022.",
      "Regulated by the Cannabis Control Division (CCD). Medical program managed by DOH.",
      "Tax: 13% state excise tax on adult-use (increases 1% annually to 18% in 2030) + gross receipts tax.",
      "Medical patients are EXEMPT from the excise tax.",
      "Patient card: FREE. No state fee for medical cannabis cards. Handled via online portal.",
      "OUT-OF-STATE RECIPROCITY: Visiting patients with valid out-of-state cards can purchase tax-free after registering at an NM dispensary.",
      "Home grow allowed: Up to 6 mature / 6 immature plants per adult (max 12 per household).",
      "Key markets: Albuquerque, Santa Fe, Las Cruces, Rio Rancho, Roswell."
    ],
    intakeForms: [
      { name: "Medical Cannabis Program Portal", url: "https://www.nmhealth.org/about/phd/mcp/" },
      { name: "CCD Business Licensing", url: "https://www.rld.nm.gov/cannabis/licensing/" },
      { name: "CCD Licensee Search", url: "https://ccd.rld.state.nm.us/" }
    ],
    intakeFAQ: [
      { q: "When did NM legalize adult-use?", a: "The Cannabis Regulation Act passed in 2021. Sales began April 1, 2022." },
      { q: "What is the tax?", a: "13% excise tax currently, plus local gross receipts tax. Medical patients are exempt from the excise tax." },
      { q: "Is there reciprocity for out-of-state patients?", a: "Yes. Out-of-state patients can purchase medical cannabis tax-free by registering their valid out-of-state card at an NM dispensary." },
      { q: "How much is a medical card?", a: "The state does not charge a fee for the medical cannabis card itself (provider eval fees still apply)." },
      { q: "Can adults grow at home?", a: "Yes, up to 6 mature and 6 immature plants per adult (max 12 mature plants per household)." }
    ]
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
    program: "https://www.ncagr.gov/divisions/plant-industry/plant-protection/hemp",
    patientPortal: "",
    businessPortal: "",
    guide: "https://ebci-ccb.org/",
    resources: "https://www.mpp.org/states/north-carolina/?state=NC",
    abbreviation: "NC",
    adultUseStatus: "No (Illegal statewide. Exception: EBCI Tribal Land)",
    medicalStatus: "No (Illegal statewide. Exception: EBCI Tribal Land)",
    regulator: "NC Department of Agriculture (for Hemp/CBD) / EBCI Cannabis Control Board (Tribal)",
    compliancePage: "https://www.ncagr.gov/divisions/plant-industry/plant-protection/hemp",
    checklistItems: ["Hemp compliance (<0.3% THC)","CBD testing","Federal farm bill compliance"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["N/A - Medical marijuana is illegal statewide in North Carolina."],
    contactPhone: "(919) 707-3730",
    contactEmail: "hemp@ncagr.gov",
    trackingSystem: "N/A",
    licenseCaps: "N/A - Cannabis is illegal. Hemp is regulated by the state.",
    intakeNotes: [
      "⚠️ ILLEGAL STATEWIDE: Both medical and recreational marijuana are illegal in North Carolina.",
      "HEMP / CBD ONLY: Hemp-derived products (CBD, Delta-8, THCa) <0.3% THC are currently legal.",
      "TRIBAL EXCEPTION: The Eastern Band of Cherokee Indians (EBCI) operates as a sovereign nation on the Qualla Boundary.",
      "EBCI legalized both medical and adult-use. 'Great Smoky Cannabis Company' is the ONLY legal dispensary in NC (located on tribal land).",
      "Transporting cannabis off the Qualla Boundary into NC jurisdiction is a state/federal crime.",
      "No statewide patient cards, no state dispensary licenses."
    ],
    intakeForms: [
      { name: "NC Hemp Program (Dept of Ag)", url: "https://www.ncagr.gov/divisions/plant-industry/plant-protection/hemp" },
      { name: "EBCI Cannabis Control Board", url: "https://ebci-ccb.org/" }
    ],
    intakeFAQ: [
      { q: "Is medical marijuana legal in NC?", a: "NO. Medical marijuana is illegal under North Carolina state law." },
      { q: "What is the Great Smoky Cannabis Company?", a: "It is the only legal dispensary physically located in NC, operating on the sovereign Qualla Boundary (EBCI tribal land)." },
      { q: "Can I buy CBD?", a: "Yes. Hemp-derived CBD products containing less than 0.3% THC are legal." },
      { q: "Can I transport tribal cannabis into NC?", a: "NO. Transporting cannabis off tribal land into state jurisdiction is illegal and subject to criminal penalties." }
    ]
  },
  "North Dakota": {
    program: "https://www.hhs.nd.gov/health/medical-marijuana",
    patientPortal: "https://mmregistration.health.nd.gov/",
    businessPortal: "https://www.hhs.nd.gov/health/medical-marijuana",
    guide: "https://www.hhs.nd.gov/health/medical-marijuana",
    resources: "https://www.mpp.org/states/north-dakota/?state=ND",
    abbreviation: "ND",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Compassionate Care Act, 2016)",
    regulator: "North Dakota Department of Health and Human Services (DHHS)",
    compliancePage: "https://www.hhs.nd.gov/health/medical-marijuana/laws-and-rules",
    checklistItems: ["DHHS License","Lab testing (BioTrack)","Patient registry verification"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","HIV/AIDS","Hepatitis C (Cirrhosis)","ALS","PTSD","Alzheimer's/Dementia","Crohn's Disease","Fibromyalgia","Glaucoma","Epilepsy/Seizures","Anorexia/Bulimia","Anxiety Disorder","Tourette Syndrome","Ehlers-Danlos Syndrome","Endometriosis","Interstitial Cystitis","Neuropathy","Migraine","Rheumatoid Arthritis","Autism Spectrum Disorder","Brain Injury","Terminal Illness","Spinal Stenosis","Chronic Back Pain","Cachexia"],
    contactPhone: "(701) 328-3330",
    contactEmail: "medmarijuana@nd.gov",
    trackingSystem: "BioTrackTHC",
    licenseCaps: "Strict caps. Currently capped at 8 dispensaries statewide (Bismarck, Fargo, Grand Forks, Minot, Devils Lake, Dickinson, Jamestown, Williston).",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: Passed in 2016. Extremely limited market with strict caps.",
      "Regulated by the Department of Health and Human Services (DHHS).",
      "Only 8 dispensaries operate in the entire state (Curaleaf, Pure Dakota, Strive Life).",
      "Tax: 5% state sales tax (up to ~7% with local). NO excise tax.",
      "OUT-OF-STATE RECIPROCITY: ND allows nonresidents to apply for a temporary nonresident medical marijuana card via the BioTrackTHC portal.",
      "No adult-use or home grow allowed."
    ],
    intakeForms: [
      { name: "ND DHHS Medical Marijuana Portal", url: "https://www.hhs.nd.gov/health/medical-marijuana" },
      { name: "BioTrackTHC Patient Registration", url: "https://mmregistration.health.nd.gov/" }
    ],
    intakeFAQ: [
      { q: "Is recreational marijuana legal in ND?", a: "NO. North Dakota is strictly a medical-only state." },
      { q: "How many dispensaries are there?", a: "The state has strictly capped the number of dispensaries to 8 statewide." },
      { q: "What is the tax rate?", a: "Medical marijuana is subject to the standard 5% state sales tax, plus any local taxes. There is no additional excise tax." },
      { q: "Can out-of-state patients buy?", a: "Yes, but they cannot use their out-of-state card directly at the register. They must apply for a nonresident ND card through the DHHS portal first." }
    ]
  },
  "Ohio": {
    program: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana",
    patientPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/patient-and-caregiver-registry",
    businessPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control",
    guide: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers",
    resources: "https://www.mpp.org/states/ohio/?state=OH",
    abbreviation: "OH",
    adultUseStatus: "Yes (Issue 2 passed Nov 2023. Sales started 2024)",
    medicalStatus: "Yes (HB 523, 2016)",
    regulator: "Ohio Division of Cannabis Control (DCC)",
    compliancePage: "https://com.ohio.gov/divisions-and-programs/cannabis-control/about-dcc/rules",
    checklistItems: ["DCC License","Dual-use certification","Metrc tracking","Local zoning compliance","Tax compliance (10% excise)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["AIDS/HIV","Alzheimer's Disease","ALS","Cancer","Cachexia","Chronic Traumatic Encephalopathy","Crohn's Disease","Epilepsy/Seizure Disorders","Fibromyalgia","Glaucoma","Hepatitis C","Huntington's Disease","Inflammatory Bowel Disease (IBD)","Multiple Sclerosis","Chronic Pain (Severe/Intractable)","Parkinson's Disease","PTSD","Sickle Cell Anemia","Spasticity","Spinal Cord Disease/Injury","Terminal Illness","Tourette Syndrome","Traumatic Brain Injury","Ulcerative Colitis"],
    contactPhone: "(833) 464-6627",
    contactEmail: "MMCPRegistry@pharmacy.ohio.gov",
    trackingSystem: "Metrc",
    licenseCaps: "Yes. The state has limited allocations for dispensaries, cultivators, and processors, managed by the DCC.",
    intakeNotes: [
      "✅ DUAL-USE: Issue 2 legalized adult-use (Nov 2023). Most dispensaries now operate as 'Dual-Use' (serving both medical and adult-use).",
      "Regulator: Division of Cannabis Control (DCC) under the Dept of Commerce.",
      "Tax: 10% state excise tax on adult-use + standard sales tax (5.75%).",
      "Medical patients are EXEMPT from the 10% excise tax.",
      "NO RECIPROCITY: Ohio does not accept out-of-state medical cards.",
      "Home grow allowed: Up to 6 plants per adult (max 12 per household).",
      "Key markets: Columbus, Cleveland, Cincinnati, Toledo, Dayton, Akron."
    ],
    intakeForms: [
      { name: "Ohio Medical Marijuana Registry", url: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/patient-and-caregiver-registry" },
      { name: "DCC Business Portal", url: "https://com.ohio.gov/divisions-and-programs/cannabis-control" }
    ],
    intakeFAQ: [
      { q: "When did Ohio legalize recreational?", a: "Issue 2 passed in November 2023. Dual-use sales began in mid-2024." },
      { q: "What is a dual-use dispensary?", a: "A dispensary licensed by the DCC to sell to both medical patients and adult-use consumers." },
      { q: "What is the tax rate?", a: "Adult-use has a 10% excise tax. Medical patients are exempt from this excise tax." },
      { q: "Does Ohio accept out-of-state cards?", a: "NO. Ohio has no reciprocity. Out-of-state cards are invalid." },
      { q: "Can I grow at home?", a: "Yes, adults 21+ can grow up to 6 plants (max 12 per household)." }
    ]
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
    program: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram",
    patientPortal: "https://ommpsystem.oregon.gov/",
    businessPortal: "https://www.oregon.gov/olcc/marijuana",
    guide: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx",
    resources: "https://www.mpp.org/states/oregon/?state=OR",
    abbreviation: "OR",
    adultUseStatus: "Yes (Measure 91, 2014)",
    medicalStatus: "Yes (OMMP, 1998)",
    regulator: "Oregon Liquor and Cannabis Commission (OLCC) / Oregon Health Authority (OHA)",
    compliancePage: "https://www.oregon.gov/olcc/marijuana/Pages/Rules.aspx",
    checklistItems: ["OLCC License","Metrc tracking","OMMP compliance","Local city/county limits","Tax compliance (17% state + local)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Glaucoma","HIV/AIDS","Alzheimer's Disease","PTSD","Degenerative/Neurological conditions","Cachexia","Severe Pain","Severe Nausea","Seizures","Persistent Muscle Spasms (including MS)","Hospice/Palliative Care (Effective 2027)"],
    contactPhone: "(971) 673-1234",
    contactEmail: "medmarijuana.dispensaries@odhsoha.oregon.gov",
    trackingSystem: "Metrc",
    licenseCaps: "Yes. The OLCC has implemented moratoriums on new licenses in certain categories due to oversupply.",
    intakeNotes: [
      "✅ DUAL-USE MARKET: Dispensaries are licensed by the OLCC and serve both recreational and medical (OMMP) patients.",
      "Regulators: OLCC (Retail/Commercial) and OHA (Medical Program - OMMP).",
      "Tax: 17% state excise tax + up to 3% local tax (Max 20%).",
      "Medical patients (OMMP) are EXEMPT from the 17% state excise tax.",
      "NO RECIPROCITY: Oregon does not accept out-of-state medical cards.",
      "Home grow allowed: Up to 4 plants per household for adult-use; up to 6 mature plants for OMMP patients."
    ],
    intakeForms: [
      { name: "OMMP Patient Registry", url: "https://ommpsystem.oregon.gov/" },
      { name: "OLCC Cannabis Licensing", url: "https://www.oregon.gov/olcc/marijuana" }
    ],
    intakeFAQ: [
      { q: "What is the OMMP?", a: "The Oregon Medical Marijuana Program, managed by the Oregon Health Authority (OHA)." },
      { q: "What is the tax rate?", a: "Recreational is taxed at 17% state + up to 3% local. OMMP patients are exempt from the 17% state tax." },
      { q: "Does Oregon accept out-of-state cards?", a: "NO. Oregon has no reciprocity. Out-of-state cards are invalid." },
      { q: "Who licenses dispensaries?", a: "The OLCC licenses all retail dispensaries. There are no longer 'medical-only' dispensaries; they are dual-use." }
    ]
  },
  "Pennsylvania": {
    program: "https://www.pa.gov/services/health/register-for-the-medical-marijuana-program",
    patientPortal: "https://padohmmp.custhelp.com/app/login",
    businessPortal: "https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Dispensaries.aspx",
    guide: "https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Medical%20Marijuana.aspx",
    resources: "https://www.mpp.org/states/pennsylvania/?state=PA",
    abbreviation: "PA",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Medical Marijuana Act, 2016)",
    regulator: "Pennsylvania Department of Health (DOH)",
    compliancePage: "https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Medical%20Marijuana.aspx",
    checklistItems: ["DOH Dispensary/Grower Permit","MJ Freeway tracking (state system)","Pharmacist/Medical Professional on-site","Tax compliance (5% wholesale)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["ALS","Anxiety Disorders","Autism","Cancer","Crohn's Disease","Dyskinetic/Spastic Movement Disorders","Epilepsy","Glaucoma","HIV/AIDS","Huntington's Disease","Inflammatory Bowel Disease","Intractable Seizures","Multiple Sclerosis","Neurodegenerative Diseases","Neuropathies","Opioid Use Disorder","Parkinson's Disease","PTSD","Severe Chronic or Intractable Pain","Sickle Cell Anemia","Terminal Illness","Tourette Syndrome"],
    contactPhone: "(888) 733-5595",
    contactEmail: "RA-DHMedMarijuana@pa.gov",
    trackingSystem: "MJ Freeway",
    licenseCaps: "Yes. PA limits the number of grower/processor and dispensary permits.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: Adult-use (recreational) marijuana remains strictly illegal in PA.",
      "Regulator: Pennsylvania Department of Health (DOH).",
      "Dispensaries must have a medical professional (pharmacist, physician) on-site during hours of operation.",
      "Tax: 0% retail sales tax. There is a 5% excise tax on the wholesale transfer from grower to dispensary.",
      "NO RECIPROCITY: PA does not recognize out-of-state medical cards. You must be a PA resident.",
      "Home grow is strictly prohibited in PA."
    ],
    intakeForms: [
      { name: "PA DOH Patient Portal", url: "https://padohmmp.custhelp.com/app/login" },
      { name: "PA DOH Medical Marijuana Program", url: "https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Medical%20Marijuana.aspx" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in PA?", a: "NO. Pennsylvania is strictly a medical-only state." },
      { q: "What is the tax rate?", a: "Patients pay 0% retail tax. The state levies a 5% wholesale tax on growers selling to dispensaries." },
      { q: "Can I use my out-of-state card?", a: "NO. PA has no reciprocity. Only PA-issued cards are accepted." },
      { q: "Can I grow my own?", a: "NO. Home cultivation is a felony in Pennsylvania, even for medical patients." }
    ]
  },
  "Rhode Island": {
    program: "https://health.ri.gov/medical-marijuana/information/patients-caregivers",
    patientPortal: "https://cannabislicensing.ri.gov/ricannabis/s/login/",
    businessPortal: "https://ccc.ri.gov/",
    guide: "https://health.ri.gov/publications/policies/MedicalMarijuanaProgram.pdf",
    resources: "https://www.mpp.org/states/rhode-island/?state=RI",
    abbreviation: "RI",
    adultUseStatus: "Yes (Legalized 2022)",
    medicalStatus: "Yes (Edward O. Hawkins Act, 2006)",
    regulator: "Rhode Island Cannabis Control Commission (CCC) / DOH",
    compliancePage: "https://ccc.ri.gov/",
    checklistItems: ["CCC License","DOH Medical Compliance","Hybrid Compassion Center limits","Metrc tracking","Tax compliance (20% adult-use)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Alzheimer's Disease (Agitation)","Autism Spectrum Disorder","Cancer","Cachexia/Wasting Syndrome","Glaucoma","Hepatitis C","HIV/AIDS","PTSD","Seizures (including Epilepsy)","Severe Nausea","Severe/Chronic/Debilitating Pain","Severe and Persistent Muscle Spasms (including MS & Crohn's)"],
    contactPhone: "(401) 222-2828",
    contactEmail: "mmp@health.ri.gov",
    trackingSystem: "Metrc",
    licenseCaps: "Yes. The CCC limits the number of compassion centers and adult-use licenses.",
    intakeNotes: [
      "✅ DUAL-USE MARKET: Many Compassion Centers hold hybrid licenses, serving both adult-use and medical patients.",
      "Regulators: Cannabis Control Commission (CCC) oversees the industry. DOH manages the patient registry.",
      "Tax: Adult-use is taxed at 20% (7% sales + 10% state excise + 3% local).",
      "Medical patients are EXEMPT from the state and local excise taxes.",
      "✅ RECIPROCITY: Rhode Island accepts valid out-of-state medical marijuana cards.",
      "Home grow allowed: Up to 6 plants (max 3 mature) per household."
    ],
    intakeForms: [
      { name: "RI Cannabis Licensing Portal", url: "https://cannabislicensing.ri.gov/ricannabis/s/login/" },
      { name: "CCC Official Website", url: "https://ccc.ri.gov/" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in RI?", a: "Yes, adult-use was legalized in 2022. Sales are conducted at hybrid compassion centers." },
      { q: "What is a Compassion Center?", a: "A state-licensed dispensary. Most are now hybrid, meaning they serve both medical and recreational." },
      { q: "What is the tax rate?", a: "Recreational carries a 20% total tax. Medical patients are exempt from the 13% excise taxes." },
      { q: "Does RI accept out-of-state cards?", a: "YES. RI has medical reciprocity and accepts valid out-of-state cards." }
    ]
  },
  "South Carolina": {
    program: "https://southcarolinastatecannabis.org/medical",
    patientPortal: "",
    businessPortal: "",
    guide: "https://www.scstatehouse.gov/query.php?search=DOC&searchtext=Julian%27s%20Law",
    resources: "https://www.mpp.org/states/south-carolina/?state=SC",
    abbreviation: "SC",
    adultUseStatus: "Illegal",
    medicalStatus: "Illegal (CBD Exception Only - Julian's Law)",
    regulator: "None (SCDA regulates Hemp)",
    compliancePage: "https://agriculture.sc.gov/divisions/consumer-protection/hemp/",
    checklistItems: ["Hemp/CBD compliance","SCDA Hemp Farming Permit (if applicable)","Age gating (21+ for intoxicating hemp)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Severe Epilepsy / Lennox-Gastaut / Dravet Syndrome (CBD Exception Only)"],
    contactPhone: "",
    contactEmail: "",
    trackingSystem: "None",
    licenseCaps: "N/A - Marijuana is illegal",
    intakeNotes: [
      "🚨 ILLEGAL STATE: Both medical and recreational marijuana are completely illegal in SC.",
      "Julian's Law (2014) provides a very narrow affirmative defense for patients with severe epilepsy to possess low-THC/high-CBD oil (<0.9% THC).",
      "There is NO state-regulated medical marijuana program or dispensary system.",
      "The Compassionate Care Act (S. 53) has repeatedly failed or stalled in the legislature.",
      "The market consists entirely of Hemp and CBD stores selling Farm Bill-compliant products (Delta-8, CBD, THCA).",
      "Recent laws (2026) restrict intoxicating hemp products to adults 21+."
    ],
    intakeForms: [
      { name: "SCDA Hemp Farming Program", url: "https://agriculture.sc.gov/divisions/consumer-protection/hemp/" }
    ],
    intakeFAQ: [
      { q: "Is medical marijuana legal in SC?", a: "NO. The Compassionate Care Act has not passed. There is no state medical program." },
      { q: "What is Julian's Law?", a: "A narrow 2014 law allowing severe epilepsy patients to possess CBD oil with less than 0.9% THC if recommended by a physician." },
      { q: "Are dispensaries open in SC?", a: "There are NO marijuana dispensaries. Stores selling cannabis products are Hemp/CBD stores operating under Farm Bill rules." },
      { q: "Can I grow my own?", a: "NO. Cultivating marijuana is a criminal offense in South Carolina." }
    ]
  },
  "South Dakota": {
    program: "https://medcannabisapplication.sd.gov/",
    patientPortal: "https://medcannabis.sd.gov/",
    businessPortal: "https://medcannabis.sd.gov/Establishments/Forms.aspx",
    guide: "https://medcannabis.sd.gov/",
    resources: "https://www.mpp.org/states/south-dakota/?state=SD",
    abbreviation: "SD",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Initiated Measure 26, 2020)",
    regulator: "South Dakota Department of Health (DOH)",
    compliancePage: "https://medcannabis.sd.gov/",
    checklistItems: ["DOH Establishment License","Local Government Compliance Certification (Form E)","Metrc inventory tracking","Sales tax compliance"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Amyotrophic Lateral Sclerosis (ALS)","Cachexia or Wasting Syndrome","Cancer","Crohn's Disease","Epilepsy and Seizures","Glaucoma","HIV/AIDS","Multiple Sclerosis (MS)","Post-Traumatic Stress Disorder (PTSD)","Severe or Chronic Pain","Severe Nausea","Severe and Persistent Muscle Spasms"],
    contactPhone: "(605) 773-3361",
    contactEmail: "MCST@state.sd.us",
    trackingSystem: "Metrc",
    licenseCaps: "Municipalities can set local caps, but cannot completely ban medical dispensaries.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: Recreational cannabis remains illegal after failed ballot measures in 2022 and 2024.",
      "Regulator: South Dakota Department of Health (DOH).",
      "Tax: No cannabis-specific excise tax. Subject to 4.2% state sales tax plus local municipal taxes (approx 5.2%-6.2% total).",
      "NO RECIPROCITY: Out-of-state cards are NOT accepted. Non-residents must apply for an SD card.",
      "Possession limit: 3 ounces of cannabis per 14-day period."
    ],
    intakeForms: [
      { name: "SD DOH Medical Cannabis Portal", url: "https://medcannabisapplication.sd.gov/" },
      { name: "Establishment Licensing Info", url: "https://medcannabis.sd.gov/Establishments/Forms.aspx" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in SD?", a: "NO. It is strictly a medical-only state." },
      { q: "What is the tax rate?", a: "There is no special cannabis tax. Standard state and local sales taxes apply (around 5.2% to 6.2%)." },
      { q: "Can I use an out-of-state card?", a: "NO. South Dakota does not have reciprocity. You must have a SD-issued card." },
      { q: "What is the purchase limit?", a: "Registered patients can purchase up to 3 ounces every 14 days." }
    ]
  },
  "Tennessee": {
    program: "https://www.tn.gov/abc.html",
    patientPortal: "",
    businessPortal: "https://www.tn.gov/abc.html",
    guide: "https://www.tn.gov/abc/hdcp.html",
    resources: "https://www.mpp.org/states/tennessee/?state=TN",
    abbreviation: "TN",
    adultUseStatus: "Illegal",
    medicalStatus: "Illegal (No Program)",
    regulator: "Tennessee Alcoholic Beverage Commission (TABC) - Hemp Only",
    compliancePage: "https://www.tn.gov/abc/hdcp.html",
    checklistItems: ["TABC HDCP License (Retailers/Suppliers)","Strict age gating (21+)","Wholesale HDCP Tax (2 cents/mg)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: [],
    contactPhone: "(615) 741-1602",
    contactEmail: "TABC.Info@tn.gov",
    trackingSystem: "None",
    licenseCaps: "N/A - Marijuana is illegal",
    intakeNotes: [
      "🚨 ILLEGAL STATE: Both medical and recreational marijuana are completely illegal in Tennessee.",
      "The market consists entirely of Hemp-Derived Cannabinoid Products (HDCPs).",
      "As of Jan 1, 2026, regulatory oversight for HDCPs shifted from the Dept. of Agriculture (TDA) to the Alcoholic Beverage Commission (TABC).",
      "Tax: No retail tax. There is a wholesale tax of 2 cents per mg of HDCP, $50/oz for flower, or $4.40/gallon for liquid.",
      "Sales of HDCPs are restricted to individuals 21+ in age-restricted retail environments."
    ],
    intakeForms: [
      { name: "TABC HDCP Licensing", url: "https://www.tn.gov/abc/hdcp.html" }
    ],
    intakeFAQ: [
      { q: "Is medical marijuana legal in TN?", a: "NO. There is no medical marijuana program in Tennessee." },
      { q: "Can I buy CBD or Delta-8?", a: "Yes, Hemp-Derived Cannabinoid Products (HDCPs) under 0.3% Delta-9 THC are legal for adults 21+, regulated by the TABC." },
      { q: "Who regulates dispensaries?", a: "There are no marijuana dispensaries. Hemp retailers are regulated by the Tennessee Alcoholic Beverage Commission (TABC)." },
      { q: "Can I grow my own?", a: "NO. Cultivating marijuana is a criminal offense in Tennessee." }
    ]
  },
  "Texas": {
    program: "https://www.dps.texas.gov/section/compassionate-use-program",
    patientPortal: "https://curt.dps.texas.gov/app/login",
    businessPortal: "https://www.dps.texas.gov/section/compassionate-use-program/dispensing-organization-licensing",
    guide: "https://www.dps.texas.gov/section/compassionate-use-program/patient-frequently-asked-questions",
    resources: "https://www.mpp.org/states/texas/?state=TX",
    abbreviation: "TX",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Compassionate Use Program - TCUP)",
    regulator: "Texas Department of Public Safety (DPS)",
    compliancePage: "https://www.dps.texas.gov/section/compassionate-use-program",
    checklistItems: ["DPS Dispensing Organization License","CURT system integration","1% THC limit compliance","State sales tax (8.25%)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Amyotrophic Lateral Sclerosis (ALS)","Autism","Cancer (all forms)","Chronic pain","Crohn's Disease","Epilepsy/Seizure disorders","Incurable neurodegenerative diseases","Multiple Sclerosis","Post-Traumatic Stress Disorder (PTSD)","Spasticity","Terminal illness","Traumatic brain injury"],
    contactPhone: "(512) 424-2000",
    contactEmail: "TCUP@dps.texas.gov",
    trackingSystem: "CURT (Compassionate Use Registry of Texas)",
    licenseCaps: "Yes. Highly restricted. Currently expanding from 3 to 15 dispensing organizations.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY (TCUP): Texas has a highly restrictive medical program capped at 1% THC by weight.",
      "Regulator: Texas Department of Public Safety (DPS) manages the Compassionate Use Program.",
      "No Medical Cards: Texas does NOT issue physical medical cards. Physicians enter prescriptions directly into the CURT system.",
      "Tax: No cannabis excise tax. Standard state/local sales tax applies (~8.25%).",
      "NO RECIPROCITY: Out-of-state cards are NOT accepted.",
      "Home grow is strictly prohibited."
    ],
    intakeForms: [
      { name: "Compassionate Use Registry (CURT)", url: "https://curt.dps.texas.gov/app/login" },
      { name: "TCUP Information", url: "https://www.dps.texas.gov/section/compassionate-use-program" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in TX?", a: "NO. Texas only permits low-THC medical cannabis through TCUP." },
      { q: "How do I get a Texas medical card?", a: "Texas does not issue cards. Your registered physician puts your prescription into the CURT system, and the dispensary looks you up." },
      { q: "Can I use an out-of-state card?", a: "NO. Texas has no reciprocity." },
      { q: "Can I buy high-THC flower?", a: "NO. TCUP limits products to a maximum of 1% THC by weight. Smokable flower is prohibited." }
    ]
  },
  "Utah": {
    program: "https://medicalcannabis.utah.gov/patients/apply-for-patient-card/",
    patientPortal: "https://evs.utah.gov",
    businessPortal: "https://medicalcannabis.utah.gov/businesses/",
    guide: "https://medicalcannabis.utah.gov/patients/",
    resources: "https://www.mpp.org/states/utah/?state=UT",
    abbreviation: "UT",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Proposition 2, 2018)",
    regulator: "Utah Dept. of Agriculture and Food (UDAF) & DHHS",
    compliancePage: "https://medicalcannabis.utah.gov/businesses/laws-and-rules/",
    checklistItems: ["Pharmacy/Cultivation Licensing (UDAF)","EVS (Electronic Verification System) integration","Pharmacist in Charge (PIC) requirement","Tax compliance (sales tax exemption)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Alzheimer's Disease","Amyotrophic Lateral Sclerosis (ALS)","Autism","Cancer","Crohn's Disease or Ulcerative Colitis","Epilepsy/Debilitating seizures","HIV/AIDS","Multiple Sclerosis","Persistent nausea","Persistent pain (refractory to standard treatment)","Post-Traumatic Stress Disorder (PTSD)","Terminal illness (<6 months)"],
    contactPhone: "(801) 538-6504",
    contactEmail: "medicalcannabis@utah.gov",
    trackingSystem: "EVS (Electronic Verification System)",
    licenseCaps: "Yes. Strictly capped number of pharmacy and cultivation licenses.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: Adult-use recreational cannabis remains strictly illegal.",
      "Regulator: Currently transitioning oversight from DHHS fully over to UDAF by 2027.",
      "Pharmacies: Dispensaries are legally termed 'Medical Cannabis Pharmacies' and require a pharmacist.",
      "Tax: Medical cannabis products are EXEMPT from state and local sales taxes (there is a wholesale cultivation tax).",
      "EVS: All patient registrations, certifications, and purchases run through the Electronic Verification System (EVS).",
      "Reciprocity: No direct reciprocity, but out-of-state patients can apply for a 21-day temporary non-resident card."
    ],
    intakeForms: [
      { name: "Electronic Verification System (EVS)", url: "https://evs.utah.gov" },
      { name: "Medical Cannabis Program Info", url: "https://medicalcannabis.utah.gov" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in UT?", a: "NO. Utah is strictly a medical-only state." },
      { q: "Do I have to pay sales tax on cannabis?", a: "No. Medical cannabis products in dosage form are exempt from retail sales tax in Utah." },
      { q: "Can I use an out-of-state card?", a: "Not directly. However, you can use your home state card to apply for a temporary 21-day Utah non-resident card via EVS." },
      { q: "What is the EVS?", a: "The Electronic Verification System. It's the central portal for patient cards, provider certs, and point-of-sale tracking." }
    ]
  },
  "Vermont": {
    program: "https://ccb.vermont.gov/med-forms",
    patientPortal: "https://ccb.vermont.gov/forms",
    businessPortal: "https://ccb.vermont.gov/applications",
    guide: "https://ccb.vermont.gov/faq",
    resources: "https://www.mpp.org/states/vermont/?state=VT",
    abbreviation: "VT",
    adultUseStatus: "Yes (Legalized 2018, Sales 2022)",
    medicalStatus: "Yes",
    regulator: "Vermont Cannabis Control Board (CCB)",
    compliancePage: "https://ccb.vermont.gov/laws-rules-and-guidance",
    checklistItems: ["CCB License","Municipal approval","Tax compliance","Inventory tracking"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Cachexia or wasting syndrome","Chronic pain","Crohn's disease","Epilepsy or other seizures","Glaucoma","HIV/AIDS","Multiple Sclerosis","Parkinson's disease","Post-Traumatic Stress Disorder (PTSD)","Severe nausea","Ulcerative colitis"],
    contactPhone: "(802) 828-1010",
    contactEmail: "CCB.Med@vermont.gov",
    trackingSystem: "State mandated tracking",
    licenseCaps: "Local municipalities can opt-in/opt-out of adult-use retail.",
    intakeNotes: [
      "🌿 DUAL USE: Vermont operates both medical and adult-use markets under the CCB.",
      "Regulator: Vermont Cannabis Control Board (CCB).",
      "Medical Tax: Registered medical patients are completely EXEMPT from both the 14% excise tax and 6% sales tax.",
      "Adult-Use Tax: 14% excise tax + 6% state sales tax (plus possible 1% local option tax).",
      "Reciprocity: NONE. Vermont does not accept out-of-state medical cards.",
      "Limits: Medical patients can purchase up to 3 ounces. Adult-use is limited to 1 ounce.",
      "Home grow is legal: 2 mature and 4 immature plants per household."
    ],
    intakeForms: [
      { name: "CCB Applications Portal", url: "https://ccb.vermont.gov/applications" },
      { name: "Medical Patient Forms", url: "https://ccb.vermont.gov/med-forms" }
    ],
    intakeFAQ: [
      { q: "Do medical patients pay taxes in VT?", a: "No. Medical cannabis purchases are exempt from the 14% excise tax and 6% sales tax." },
      { q: "Can I use an out-of-state medical card?", a: "NO. Vermont does not accept out-of-state medical cards." },
      { q: "How much can I buy?", a: "Adult-use is limited to 1 ounce. Registered medical patients can purchase up to 3 ounces." },
      { q: "Can I grow at home?", a: "Yes. Adults 21+ can grow up to 2 mature and 4 immature plants per household." }
    ]
  },
  "Virginia": {
    program: "https://cca.virginia.gov/medicalcannabis",
    patientPortal: "https://cca.virginia.gov/medicalcannabis/patients",
    businessPortal: "https://cca.virginia.gov/licensing",
    guide: "https://cca.virginia.gov/faqs",
    resources: "https://www.mpp.org/states/virginia/?state=VA",
    abbreviation: "VA",
    adultUseStatus: "Legal to possess/grow (No Retail Sales yet)",
    medicalStatus: "Yes",
    regulator: "Virginia Cannabis Control Authority (CCA)",
    compliancePage: "https://cca.virginia.gov/laws-and-regulations",
    checklistItems: ["CCA Pharmaceutical Processor License","Practitioner certification required","Product testing","Inventory tracking"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Any condition or symptom diagnosed by a registered practitioner (No specific list)"],
    contactPhone: "(804) 688-6112",
    contactEmail: "info@cca.virginia.gov",
    trackingSystem: "State mandated tracking",
    licenseCaps: "Yes. Highly restricted number of pharmaceutical processors (dispensaries).",
    intakeNotes: [
      "⚕️ MEDICAL SALES ONLY: While adult-use possession and home grow are legal, there are NO adult-use retail stores open.",
      "Regulator: Virginia Cannabis Control Authority (CCA).",
      "Conditions: Virginia does not have a strict list of qualifying conditions. Any registered practitioner can certify a patient for any condition.",
      "Tax: Medical cannabis purchases are generally exempt from special cannabis excise taxes, subject only to standard sales tax.",
      "Reciprocity: NONE. Virginia does not accept out-of-state medical cards.",
      "Home grow is legal: Up to 4 plants per household for adults 21+."
    ],
    intakeForms: [
      { name: "CCA Patient Info", url: "https://cca.virginia.gov/medicalcannabis/patients" },
      { name: "Practitioner Registry", url: "https://cca.virginia.gov/medicalcannabis/practitioners" }
    ],
    intakeFAQ: [
      { q: "Are recreational dispensaries open in VA?", a: "NO. You can legally possess and grow cannabis, but there is no legal retail market for adult-use yet." },
      { q: "What conditions qualify for a medical card?", a: "Any condition. It is entirely up to the clinical judgment of a registered practitioner." },
      { q: "Can I use an out-of-state medical card?", a: "NO. Virginia has no reciprocity." },
      { q: "How much can I buy?", a: "A registered patient can purchase up to a 90-day supply of cannabis products." }
    ]
  },
  "Washington": {
    program: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis",
    patientPortal: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis/patient-information",
    businessPortal: "https://lcb.wa.gov/mjlicense/marijuana-licensing",
    guide: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis/laws-and-rules",
    resources: "https://www.mpp.org/states/washington/?state=WA",
    abbreviation: "WA",
    adultUseStatus: "Yes",
    medicalStatus: "Yes",
    regulator: "Washington LCB (Business) / DOH (Medical)",
    compliancePage: "https://lcb.wa.gov/laws/laws-and-rules",
    checklistItems: ["LCB Retail License","DOH Medical Endorsement","Traceability integration","37% excise tax compliance"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Cancer","Chronic renal failure","Crohn's disease","Epilepsy or other seizure disorders","Glaucoma","Hepatitis C","HIV/AIDS","Intractable pain","Multiple Sclerosis","Post-Traumatic Stress Disorder (PTSD)","Traumatic brain injury"],
    contactPhone: "(360) 236-4819",
    contactEmail: "medicalcannabis@doh.wa.gov",
    trackingSystem: "CCRS (Cannabis Central Reporting System)",
    licenseCaps: "Yes. LCB tightly caps the number of retail licenses statewide.",
    intakeNotes: [
      "🌿 DUAL USE: Washington has a robust adult-use market (LCB) and a medical program (DOH).",
      "Regulators: Liquor and Cannabis Board (LCB) licenses businesses. Department of Health (DOH) manages the patient registry.",
      "Adult-Use Tax: Very high. 37% cannabis excise tax + 6.5% standard state sales tax (plus local taxes).",
      "Medical Tax Exemption: Registered patients with a DOH recognition card are EXEMPT from the 37% excise tax and sales tax on DOH-compliant products.",
      "Reciprocity: NONE. Washington does not accept out-of-state medical cards for tax exemptions.",
      "Home Grow: Only registered medical patients can legally grow at home (up to 6-15 plants). Adult-use home grow is illegal."
    ],
    intakeForms: [
      { name: "DOH Patient Info", url: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis" },
      { name: "LCB Business Licensing", url: "https://lcb.wa.gov/mjlicense/marijuana-licensing" }
    ],
    intakeFAQ: [
      { q: "Is weed legal in WA?", a: "Yes, both medical and adult-use (21+) cannabis are legal." },
      { q: "Do medical patients pay taxes?", a: "Registered patients with a DOH card are exempt from the 37% excise tax and sales tax on compliant products." },
      { q: "Can I use an out-of-state medical card?", a: "NO. Washington does not have medical reciprocity." },
      { q: "Can I grow my own plants?", a: "Only if you are a registered medical patient. Recreational home grow is a felony." }
    ]
  },
  "West Virginia": {
    program: "https://omc.wv.gov",
    patientPortal: "https://omc.wv.gov/patients",
    businessPortal: "https://omc.wv.gov/industry",
    guide: "https://omc.wv.gov/patients/Pages/default.aspx",
    resources: "https://www.mpp.org/states/west-virginia/?state=WV",
    abbreviation: "WV",
    adultUseStatus: "No (Medical Only)",
    medicalStatus: "Yes (Medical Cannabis Act, 2017)",
    regulator: "West Virginia Office of Medical Cannabis (OMC)",
    compliancePage: "https://omc.wv.gov/laws-and-rules",
    checklistItems: ["OMC Dispensary Permit","10% privilege tax remittance","Metrc tracking compliance","No smokable or edible products (vaporization only)"],
    complianceSource: "https://www.ncsl.org/health/state-medical-cannabis-laws",
    conditions: ["Amyotrophic Lateral Sclerosis (ALS)","Cancer","Chronic or intractable pain","Crohn's disease","Epilepsy or intractable seizures","HIV/AIDS","Huntington's disease","Multiple sclerosis","Neuropathies","Parkinson's disease","Post-Traumatic Stress Disorder (PTSD)","Sickle cell anemia","Spinal cord damage with intractable spasticity","Terminal illness"],
    contactPhone: "(304) 356-5090",
    contactEmail: "medcanwv@wv.gov",
    trackingSystem: "Metrc",
    licenseCaps: "Yes. OMC tightly controls the number of dispensary, processor, and grower permits.",
    intakeNotes: [
      "⚕️ MEDICAL ONLY: West Virginia has a strict medical cannabis program. Adult-use is illegal.",
      "Regulator: Office of Medical Cannabis (OMC) under DHHR.",
      "Consumption Laws: SMOKING CANNABIS IS PROHIBITED. Only vaporization of dry leaf is allowed, alongside oils, tinctures, capsules, and topicals. Edibles are not permitted.",
      "Tax: Dispensaries pay a 10% excise (privilege) tax. Patient sales are exempt from the 6% state sales tax.",
      "Reciprocity: Very limited. Only terminally ill cancer patients from other states are recognized. Otherwise, no reciprocity.",
      "Home grow is strictly prohibited."
    ],
    intakeForms: [
      { name: "OMC Patient Portal", url: "https://omc.wv.gov/patients" },
      { name: "OMC Industry Portal", url: "https://omc.wv.gov/industry" }
    ],
    intakeFAQ: [
      { q: "Is recreational weed legal in WV?", a: "NO. West Virginia only has a medical cannabis program." },
      { q: "Can I smoke my medical cannabis?", a: "NO. State law strictly prohibits the smoking of cannabis. Dry leaf is permitted only for vaporization." },
      { q: "Do patients pay taxes?", a: "Patients do not pay state sales tax. The 10% privilege tax is paid by the dispensary and usually baked into the retail price." },
      { q: "Can I grow my own plants?", a: "NO. Home cultivation is illegal." }
    ]
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
