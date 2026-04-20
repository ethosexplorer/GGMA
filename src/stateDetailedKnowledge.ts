// ═══════════════════════════════════════════════════════════════════════════════
// GGP-OS Detailed State Licensing Knowledge Base
// Stores deep links to specific forms, guides, and portal requirements per state
// ═══════════════════════════════════════════════════════════════════════════════

export interface DetailedStateKnowledge {
  state: string;
  patientData: {
    links: { title: string; url: string }[];
    notes?: string[];
  };
  businessData: {
    links: { title: string; url: string }[];
    notes?: string[];
  };
}

export const DETAILED_STATE_KNOWLEDGE: Record<string, DetailedStateKnowledge> = {
  "Alabama": {
    state: "Alabama",
    patientData: {
      links: [
        { title: "AMCC Portal Instructions - Patients", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Patients.pdf" },
        { title: "AMCC Portal Instructions - Caregivers", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Caregivers.pdf" },
        { title: "AMCC Portal Instructions - Physicians", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Physicians.pdf" },
        { title: "Patient Portal", url: "https://amcc.alabama.gov/patients/" }
      ]
    },
    businessData: {
      links: [
        { title: "Applicant/Licensee Info - Integrated Facility", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-INTEGRATED-FACILITY.pdf" },
        { title: "Applicant/Licensee Info - Cultivator", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-CULTIVATOR.pdf" },
        { title: "Applicant/Licensee Info - Processor", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-PROCESSOR.pdf" },
        { title: "Applicant/Licensee Info - Dispensary", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-DISPENSARY-1.pdf" },
        { title: "Applicant/Licensee Info - Secure Transporter", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-SECURE-TRANSPORTER.pdf" },
        { title: "Applicant/Licensee Info - State Testing Laboratory", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-STATE-TESTING-LABORATORY.pdf" }
      ]
    }
  },
  "Arkansas": {
    state: "Arkansas",
    patientData: {
      links: [
        { title: "Patient Application PDF", url: "https://mmj.adh.arkansas.gov/static/web/media/Patient_Application.pdf" },
        { title: "Caregiver Application PDF", url: "https://mmj.adh.arkansas.gov/static/web/media/Caregiver_Application.pdf" },
        { title: "MMJ Information Change Request", url: "https://mmj.adh.arkansas.gov/static/web/media/MMJ_Information_Change_Request.pdf" },
        { title: "Licensing and Renewal FAQ", url: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/licensing-and-renewal-faq/" }
      ],
      notes: ["Uses Complia for state portal"]
    },
    businessData: {
      links: [
        { title: "Business Sign-in/Register", url: "https://ar-dfa-public.nls.egov.com/login" }
      ]
    }
  },
  "Connecticut": {
    state: "Connecticut",
    patientData: {
      links: [
        { title: "Register for Medical Marijuana Card", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/register-for-a-medical-marijuana-card?language=en_US" },
        { title: "Qualifying Conditions", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/qualifying-conditions" },
        { title: "Patient FAQs", url: "https://portal.ct.gov/cannabis/mmppatientfaq" },
        { title: "Certification Process for Prescribers", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/certification-process-for-prescribers" }
      ]
    },
    businessData: {
      links: [
        { title: "Licensing Home Page", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/licensing/licensing-home-page?language=en_US" },
        { title: "Pharmacist Temporary Certifications", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/pharmacists/temporary-medical-marijuana-certifications" }
      ]
    }
  },
  "Iowa": {
    state: "Iowa",
    patientData: {
      links: [
        { title: "Online Application and Renewal Guide - Patients", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" },
        { title: "Online Application and Renewal Guide - Caregivers", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" },
        { title: "Medical Cannabis Patient FAQ", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" }
      ],
      notes: ["Phone: 1-877-214-9313", "Email: medical.cannabis@hhs.iowa.gov"]
    },
    businessData: {
      links: [
        { title: "Manufacturer Rules and Regulations", url: "https://hhs.iowa.gov/media/9175/download?inline" },
        { title: "Dispensary Rules and Regulations", url: "https://hhs.iowa.gov/media/9179/download?inline" },
        { title: "Medical Cannabidiol Testing Flow Chart", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" },
        { title: "Manufacturer Inspection Checklist", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" },
        { title: "Dispensary Inspection Checklist", url: "https://hhs.iowa.gov/health-prevention/medical-cannabis" }
      ]
    }
  },
  "Maine": {
    state: "Maine",
    patientData: {
      links: [
        { title: "Applications and Forms", url: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms" },
        { title: "Caregiver Online Application Instructions", url: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms" },
        { title: "Registry Identification Card Online Application Instructions", url: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions" }
      ],
      notes: ["Email: Licensing.OCP@maine.gov", "Phone: (207) 287-3282"]
    },
    businessData: {
      links: [
        { title: "Apply for an Establishment Conditional License", url: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421" },
        { title: "Upload Outstanding Application Documents", url: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421" },
        { title: "Renew an Active Establishment License", url: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421" }
      ]
    }
  },
  "Mississippi": {
    state: "Mississippi",
    patientData: {
      links: [
        { title: "Portal User Guide", url: "https://www.mmcp.ms.gov/" },
        { title: "Pre-Application Checklist", url: "https://www.mmcp.ms.gov/" }
      ],
      notes: ["Uses Complia platform"]
    },
    businessData: {
      links: [
        { title: "Affidavit for Medical Cannabis Business Licensure", url: "https://www.mmcp.ms.gov/" },
        { title: "Steps to Obtain a Work Permit", url: "https://www.mmcp.ms.gov/" },
        { title: "For Licensees: Getting Started with Metrc", url: "https://www.mmcp.ms.gov/" },
        { title: "Packaging & Labeling Guide", url: "https://www.mmcp.ms.gov/" }
      ]
    }
  },
  "New York": {
    state: "New York",
    patientData: {
      links: [
        { title: "Caregiver Registration Instructions", url: "https://cannabis.ny.gov/caregiver-registration-instructions" },
        { title: "Patient and Caregiver Registry ID Guide", url: "https://cannabis.ny.gov/patient-and-caregiver-registry-id-guide" },
        { title: "Medical Cannabis Home Cultivation Guide", url: "https://cannabis.ny.gov/medical-cannabis-home-cultivation-guide" }
      ],
      notes: ["Qualifying conditions include: Autism, Alzheimer's, Cancer, Chronic Pain, Epilepsy, HIV/AIDS, Inflammatory Bowel Disease, PTSD, Neuropathy, Parkinson's, Rheumatoid Arthritis, Substance Use Disorder"]
    },
    businessData: {
      links: [
        { title: "Practitioner Guide to Patient Certification", url: "https://cannabis.ny.gov/practitioner-guide-patient-certification" },
        { title: "Designated Caregiver Facility Registration", url: "https://cannabis.ny.gov/designated-caregiver-facility-registration" },
        { title: "Dispensing Facilities", url: "https://cannabis.ny.gov/dispensing-facilities" }
      ]
    }
  },
  "Oregon": {
    state: "Oregon",
    patientData: {
      links: [
        { title: "OMMP Application Form and Instructions", url: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx" },
        { title: "Attending Provider's Statement", url: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx" }
      ],
      notes: ["OMMP will issue the patient listed on the application a 30-day receipt, which has the same legal effect as a registry ID card for 30 days, if a complete application is submitted.", "Grow site fee is $200 and is paid by the grower."]
    },
    businessData: {
      links: [
        { title: "Growers", url: "https://ommpsystem.oregon.gov/" },
        { title: "Processors", url: "https://ommpsystem.oregon.gov/" },
        { title: "Dispensaries", url: "https://ommpsystem.oregon.gov/" }
      ]
    }
  }
};

export const getDetailedStateKnowledge = (stateName: string): DetailedStateKnowledge | null => {
  const normalized = stateName.toLowerCase();
  for (const [key, value] of Object.entries(DETAILED_STATE_KNOWLEDGE)) {
    if (key.toLowerCase() === normalized) {
      return value;
    }
  }
  return null;
};
