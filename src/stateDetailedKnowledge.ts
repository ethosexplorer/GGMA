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
        { title: "Amcc Portal Instructions Creating An Account Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Creating-an-Account.pdf" },
        { title: "Patients", url: "https://amcc.alabama.gov/patients/" },
        { title: "Amcc Portal Instructions Patients Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Patients.pdf" },
        { title: "Amcc Portal Instructions Caregivers Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Caregivers.pdf" },
        { title: "Amcc Portal Instructions Physicians Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/AMCC-Portal-Instructions-Physicians.pdf" }
      ]
    },
    businessData: {
      links: [
        { title: "Applicant Licensee Info Integrated Facility Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-INTEGRATED-FACILITY.pdf" },
        { title: "Applicant Licensee Info Cultivator Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-CULTIVATOR.pdf" },
        { title: "Applicant Licensee Info Processor Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-PROCESSOR.pdf" },
        { title: "Applicant Licensee Info Dispensary 1 Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-DISPENSARY-1.pdf" },
        { title: "Applicant Licensee Info Secure Transporter Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-SECURE-TRANSPORTER.pdf" },
        { title: "Applicant Licensee Info State Testing Laboratory Pdf", url: "https://amcc.alabama.gov/wp-content/uploads/2026/01/Applicant-Licensee-Info-STATE-TESTING-LABORATORY.pdf" }
      ]
    }
  },
  "Alaska": {
    state: "Alaska",
    patientData: {
      links: [
        { title: "Medicalmarijuana Pdf", url: "https://health.alaska.gov/media/ocjibnfh/medicalmarijuana.pdf" },
        { title: "Medical Marijuana", url: "https://www.azdhs.gov/licensing/medical-marijuana/" },
        { title: "Portal Instructions Pdf", url: "https://www.azdhs.gov/documents/licensing/medical-marijuana/portal-instructions.pdf" }
      ]
    },
    businessData: {
      links: [
        { title: "#Dispensary Agent", url: "https://www.azdhs.gov/licensing/medical-marijuana/#dispensary-agent" },
        { title: "#Labs", url: "https://www.azdhs.gov/licensing/medical-marijuana/#labs" },
        { title: "#Physician", url: "https://www.azdhs.gov/licensing/medical-marijuana/#physician" }
      ]
    }
  },
  "Arkansas": {
    state: "Arkansas",
    patientData: {
      links: [
        { title: "Mmj.Adh.Arkansas.Gov", url: "https://mmj.adh.arkansas.gov/" },
        { title: "Patient_Application Pdf", url: "https://mmj.adh.arkansas.gov/static/web/media/Patient_Application.pdf" },
        { title: "Caregiver_Application Pdf", url: "https://mmj.adh.arkansas.gov/static/web/media/Caregiver_Application.pdf" },
        { title: "Mmj_Information_Change_Request Pdf", url: "https://mmj.adh.arkansas.gov/static/web/media/MMJ_Information_Change_Request.pdf" },
        { title: "Licensing And Renewal Faq", url: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/licensing-and-renewal-faq/" },
        { title: "Mmicp.Aspx", url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP.aspx" },
        { title: "Mmicp Faqs.Aspx", url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP-FAQs.aspx" },
        { title: "Mmicp Forms And Appeals.Aspx", url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP-Forms-and-Appeals.aspx" }
      ]
    },
    businessData: {
      links: [
        { title: "Login", url: "https://ar-dfa-public.nls.egov.com/login" },
        { title: "00101_ _00118_Redacted Pdf", url: "https://www.dfa.arkansas.gov/wp-content/uploads/00101_-_00118_Redacted.pdf" },
        { title: "Applicants", url: "https://www.cannabis.ca.gov/applicants/" },
        { title: "How To Apply", url: "https://www.cannabis.ca.gov/applicants/how-to-apply/" },
        { title: "Application Resources", url: "https://www.cannabis.ca.gov/applicants/application-resources/" }
      ]
    }
  },
  "Colorado": {
    state: "Colorado",
    patientData: {
      links: [
        { title: "Medical Marijuana Registry Patients", url: "https://cdphe.colorado.gov/medical-marijuana-registry-patients" },
        { title: "Medical Marijuana Registry Faq", url: "https://cdphe.colorado.gov/medical-marijuana-registry-faq" },
        { title: "Forms", url: "https://med.colorado.gov/forms" },
        { title: "Login.Aspx", url: "https://biznet.ct.gov/AccountMaint/Login.aspx" },
        { title: "Register For A Medical Marijuana Card?Language=En_Us", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/register-for-a-medical-marijuana-card?language=en_US" },
        { title: "Qualifying Conditions", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/qualifying-conditions" },
        { title: "Mmppatientfaq", url: "https://portal.ct.gov/cannabis/mmppatientfaq" },
        { title: "Certification Process For Prescribers", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/certification-process-for-prescribers" },
        { title: "Physician Requirements And Eligibility", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/physician-requirements-and-eligibility" },
        { title: "Prescriber Faqs", url: "https://portal.ct.gov/cannabis/prescriber-faqs" }
      ]
    },
    businessData: {
      links: [
        { title: "Marijuana Business Owner License Application", url: "https://med.colorado.gov/marijuana-business-owner-license-application" },
        { title: "Forms", url: "https://med.colorado.gov/forms" },
        { title: "Licensing Home Page?Language=En_Us", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/licensing/licensing-home-page?language=en_US" },
        { title: "Temporary Medical Marijuana Certifications", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/pharmacists/temporary-medical-marijuana-certifications" },
        { title: "Pharmacist Eligibility", url: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/pharmacists/pharmacist-eligibility" },
        { title: "Pharmacist Faqs", url: "https://portal.ct.gov/cannabis/pharmacist-faqs" }
      ]
    }
  },
  "Delaware": {
    state: "Delaware",
    patientData: {
      links: [
        { title: "Patientapplication Pdf", url: "https://omc.delaware.gov/medical/contentFolder/pdf/patientApplication.pdf" },
        { title: "Caregiverapplication Pdf", url: "https://omc.delaware.gov/medical/contentFolder/pdf/caregiverApplication.pdf" },
        { title: "Pediatricapplication Pdf", url: "https://omc.delaware.gov/medical/contentFolder/pdf/pediatricApplication.pdf" },
        { title: "Index.Shtml?Dc=Appproc", url: "https://omc.delaware.gov/medical/index.shtml?dc=appProc" }
      ]
    },
    businessData: {
      links: [
        { title: "Licensing", url: "https://omc.delaware.gov/adult/licensing/" },
        { title: "Index.Shtml#Licensing", url: "https://omc.delaware.gov/faq/index.shtml#licensing" }
      ]
    }
  },
  "District Of Columbia": {
    state: "District Of Columbia",
    patientData: {
      links: [
        { title: "1531231", url: "https://abca.dc.gov/node/1531231" },
        { title: "1531276", url: "https://abca.dc.gov/node/1531276" },
        { title: "Patients%E2%80%94Dc Residents#Gsc.Tab=0", url: "https://abca.dc.gov/page/patients%E2%80%94dc-residents#gsc.tab=0" },
        { title: "Login", url: "https://mmuregistry.flhealth.gov/spa/login" },
        { title: "#Instructional Guides", url: "https://knowthefactsmmj.com/registry/#instructional-guides" },
        { title: "#Identification Cards", url: "https://knowthefactsmmj.com/registry/#identification-cards" },
        { title: "Home", url: "https://www.gmcc.ga.gov/home" }
      ]
    },
    businessData: {
      links: [
        { title: "Form Dh8013 Ommu 042018 Application For Medical Marijuana Treatment Center Registration Pdf", url: "https://knowthefactsmmj.com/wp-content/uploads/_documents/form-dh8013-ommu-042018-application-for-medical-marijuana-treatment-center-registration.pdf" }
      ]
    }
  },
  "Hawaii": {
    state: "Hawaii",
    patientData: {
      links: [
        { title: "Welcome", url: "https://medmj.ehawaii.gov/medmj/welcome" }
      ]
    },
    businessData: {
      links: [
      ]
    }
  },
  "Idaho": {
    state: "Idaho",
    patientData: {
      links: [
        { title: "Medical", url: "https://idahocannabis.org/medical" },
        { title: "New Patient Resources.Html", url: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis/new-patient-resources.html" },
        { title: "Existing Patient Resources.Html", url: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis/existing-patient-resources.html" },
        { title: "Hcp Resources.Html", url: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis/hcp-resources.html" }
      ]
    },
    businessData: {
      links: [
      ]
    }
  },
  "Iowa": {
    state: "Iowa",
    patientData: {
      links: [
      ]
    },
    businessData: {
      links: [
        { title: "Download?Inline", url: "https://hhs.iowa.gov/media/9175/download?inline" },
        { title: "Download?Inline", url: "https://hhs.iowa.gov/media/9179/download?inline" }
      ]
    }
  },
  "Kentucky": {
    state: "Kentucky",
    patientData: {
      links: [
      ]
    },
    businessData: {
      links: [
        { title: "Licensees.Aspx", url: "https://kymedcan.ky.gov/businesses/Pages/licensees.aspx" },
        { title: "2024 6 28%20 %20Guidance%20Re%20Local%20Government%20And%20Lottery%20Process%20 %20Version%201 Pdf", url: "https://kymedcan.ky.gov/laws-and-regulations/Local%20Government%20Rules/2024-6-28%20-%20Guidance%20re%20Local%20Government%20and%20Lottery%20Process%20-%20Version%201.pdf" },
        { title: "2024 7 11%20Guidance%20Re%20Documentation%20Of%20Sufficient%20Capital Pdf", url: "https://kymedcan.ky.gov/businesses/Documents/2024-7-11%20Guidance%20re%20Documentation%20of%20Sufficient%20Capital.pdf" }
      ]
    }
  },
  "Maine": {
    state: "Maine",
    patientData: {
      links: [
        { title: "Login", url: "https://patient.massciportal.com/mmj-patient/login" },
        { title: "Register", url: "https://mo-public.mycomplia.com/register" }
      ]
    },
    businessData: {
      links: [
        { title: "Patient Cultivation.Php", url: "https://health.mo.gov/safety/cannabis/patient-cultivation.php" }
      ]
    }
  },
  "Nebraska": {
    state: "Nebraska",
    patientData: {
      links: [
        { title: "Patientregistryolcreatelogin", url: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin" }
      ]
    },
    businessData: {
      links: [
        { title: "Licensing", url: "https://www.dpbh.nv.gov/resources/licensing/" }
      ]
    }
  },
  "New Mexico": {
    state: "New Mexico",
    patientData: {
      links: [
        { title: "Apply For License", url: "https://www.rld.nm.gov/cannabis/licensing/new-applications/apply-for-license/" }
      ]
    },
    businessData: {
      links: [
      ]
    }
  },
  "New York": {
    state: "New York",
    patientData: {
      links: [
        { title: "Caregiver Registration Instructions", url: "https://cannabis.ny.gov/caregiver-registration-instructions" },
        { title: "Cspnp", url: "https://commerce.health.state.ny.us/doh2/applinks/cspnp/" },
        { title: "Patient And Caregiver Registry Id Guide", url: "https://cannabis.ny.gov/patient-and-caregiver-registry-id-guide" },
        { title: "Practitioner Guide Patient Certification", url: "https://cannabis.ny.gov/practitioner-guide-patient-certification" },
        { title: "Patient And Caregiver Certification Guidelines", url: "https://cannabis.ny.gov/patient-and-caregiver-certification-guidelines" },
        { title: "Practitioner Rights And Protections", url: "https://cannabis.ny.gov/practitioner-rights-and-protections" },
        { title: "Designated Caregiver Facility Registration", url: "https://cannabis.ny.gov/designated-caregiver-facility-registration" },
        { title: "Research", url: "https://cannabis.ny.gov/research" },
        { title: "Dispensing Facilities", url: "https://cannabis.ny.gov/dispensing-facilities" },
        { title: "Patients", url: "https://cannabis.ny.gov/patients" },
        { title: "Medical Home Grow Fact Sheet", url: "https://cannabis.ny.gov/medical-home-grow-fact-sheet" },
        { title: "Medical Cannabis Home Cultivation Guide", url: "https://cannabis.ny.gov/medical-cannabis-home-cultivation-guide" },
        { title: "Medical Cannabis Office Visits", url: "https://cannabis.ny.gov/medical-cannabis-office-visits" },
        { title: "Medical Cannabis Home Cultivation Faqs", url: "https://cannabis.ny.gov/medical-cannabis-home-cultivation-faqs" },
        { title: "Report An Incident", url: "https://cannabis.ny.gov/report-an-incident" },
        { title: "Adverse Event Reporting", url: "https://cannabis.ny.gov/adverse-event-reporting" }
      ]
    },
    businessData: {
      links: [
        { title: "How Read Lab Certificate Analysis Your Cannabis Product", url: "https://cannabis.ny.gov/how-read-lab-certificate-analysis-your-cannabis-product" }
      ]
    }
  },
  "North Carolina": {
    state: "North Carolina",
    patientData: {
      links: [
        { title: "Medical", url: "https://northcarolinastatecannabis.org/medical" }
      ]
    },
    businessData: {
      links: [
      ]
    }
  },
  "Ohio": {
    state: "Ohio",
    patientData: {
      links: [
        { title: "Activating Your Medical Marijuana Card", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/activating-your-medical-marijuana-card" },
        { title: "Caregiver Approval Process", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/caregiver-approval-process" },
        { title: "Other Forms Of Identification", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/other-forms-of-identification" },
        { title: "Registering As Both A Patient And Caregiver", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/registering-as-both-a-patient-and-caregiver" },
        { title: "Registering With Indigent Veteran Status", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/registering-with-indigent-veteran-status" },
        { title: "Renewing Caregiver Registration", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/renewing-caregiver-registration" },
        { title: "Renewing Patient Registration", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana/renewing-patient-registration" },
        { title: "Medportal.Omma.Ok.Gov", url: "https://medportal.omma.ok.gov/" },
        { title: "Apply.Html#Application Fees", url: "https://oklahoma.gov/omma/apply.html#application-fees" },
        { title: "Omma Medportal.Html", url: "https://oklahoma.gov/omma/omma-medportal.html" },
        { title: "Apply.Html#Updates", url: "https://oklahoma.gov/omma/apply.html#updates" }
      ]
    },
    businessData: {
      links: [
        { title: "Ohio Cannabis Faq", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/licensee-resources/what-we-do/Ohio-Cannabis-FAQ" },
        { title: "Dcc Update", url: "https://com.ohio.gov/wps/portal/gov/com/divisions-and-programs/cannabis-control/licensee-resources/what-we-do/dcc-update" },
        { title: "Apply.Html#Apply", url: "https://oklahoma.gov/omma/apply.html#apply" },
        { title: "Apply.Html#Commercial Application Resources", url: "https://oklahoma.gov/omma/apply.html#commercial-application-resources" }
      ]
    }
  },
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
