import { z } from 'zod';

export const ommaSchemas = {
  // 1. Attestation of Application for Certificate of Occupancy
  AttestationOfApplicationForCertificateOfOccupancy: z.object({
    submissionDate: z.string().min(1, 'Submission date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
    signatureDate: z.string().min(1, 'Signature date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
    signatureName: z.string().min(2, 'Signature name is required').optional(),
  }),

  // 2. Affidavit of Change of Use or Occupancy After COO Submission
  AffidavitOfChangeOfUseOrOccupancy: z.object({
    individualName: z.string().min(3, 'Full name required'),
    applicantEntity: z.string().min(3, 'Entity name required'),
    title: z.string().min(2, 'Title required'),
    signatureDate: z.string().min(1, 'Date required'),
  }),

  // 3. Affidavit of Continued Occupancy Compliance
  AffidavitOfContinuedOccupancyCompliance: z.object({
    individualName: z.string().min(3),
    applicantEntity: z.string().min(3),
    title: z.string().min(2),
    signatureDate: z.string().min(1),
  }),

  // 4. Affidavit Outdoor Exclusive Grow COO-Renewal Only
  AffidavitOutdoorExclusiveGrow: z.object({
    individualName: z.string().min(3),
    applicant: z.string().min(3),
    licenseType: z.string().min(1),
    licenseNumber: z.string().min(1),
    applicationNo: z.string().min(1),
    signatureDate: z.string().min(1),
  }),

  // 5. Authorization for Disclosure of Confidential Business Information
  AuthorizationForDisclosureOfConfidentialBusinessInfo: z.object({
    legalEntityName: z.string().min(3),
    ommaLicenseNumber: z.string().min(1),
    financialInstitutionName: z.string().min(3),
    signatureDate: z.string().min(1),
    authorizedRepresentativeName: z.string().min(3).optional(),
    title: z.string().min(2).optional(),
  }),

  // 6. Dispensary Inspection Form (Checklist style)
  DispensaryInspectionForm: z.object({
    checklist: z.array(z.string()),
    inspectorNotes: z.string().optional(),
  }),

  // 7. Laboratory Inspection Form
  LaboratoryInspectionForm: z.object({
    checklist: z.array(z.string()),
    inspectorNotes: z.string().optional(),
  }),

  // 8. Sample Field Log
  SampleFieldLog: z.object({
    ommaBusinessName: z.string().min(1),
    laboratoryName: z.string().min(1),
    transporterName: z.string().min(1).optional(),
    batchNumber: z.string().min(1).optional(),
    uniqueSampleIdPrimary: z.string().min(1).optional(),
    samplingStartDateTime: z.string().min(1).optional(),
    samplingEndDateTime: z.string().min(1).optional(),
  }),

  // 9. Non-Medical Marijuana Waste Disposal Log
  NonMedicalMarijuanaWasteDisposalLog: z.object({
    businessName: z.string().min(1),
    licenseNumber: z.string().min(1),
    disposalDate: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    quantity: z.string().min(1).optional(),
  }),

  // 10. Operational Status Visit Form
  OperationalStatusVisitForm: z.object({
    operationalStatus: z.enum(['activelyOperating', 'workingTowards', 'nonoperational']).optional(),
    checklist: z.array(z.string()).optional(),
  }),

  AttestationOfOccupancy: z.object({ submissionDate: z.string().min(1), signatureDate: z.string().min(1) }),
  CaregiverDesignation: z.object({
    patientFirstName: z.string().min(1), patientLastName: z.string().min(1),
    patientLicenseNumber: z.string().min(1),
    caregiverFirstName: z.string().min(1), caregiverLastName: z.string().min(1),
  }),
  AuthorizationToDisclose: z.object({
    patientFirstName: z.string().min(1),
    patientLastName: z.string().min(1),
    patientLicenseNumber: z.string().min(1),
  }),
  PhysicianRecommendationAdult: z.object({
    patientFirstName: z.string().min(1),
    patientLastName: z.string().min(1),
    patientLicenseNumber: z.string().min(1),
    licenseType: z.enum(['2year', '60day']),
  }),
  PhysicianRecommendationMinor: z.object({
    patientFirstName: z.string().min(1),
    patientLastName: z.string().min(1),
  }),
  CertificateOfCompliance: z.object({ businessName: z.string().min(1) }),
  CommercialApplicationChecklist: z.object({ completed: z.array(z.string()).optional() }),
  CommercialPostApprovalChecklist: z.object({ completed: z.array(z.string()).optional() }),
  ExampleCountyCertificate: z.object({ countyName: z.string().min(1) }),
  CommercialLicenseeChecklist: z.object({ checked: z.boolean().optional() }),

  TransportationAgentEmployeeVerification: z.object({
    agentFirstName: z.string().min(1),
    agentLastName: z.string().min(1),
    agentDob: z.string().min(1),
    agentLicenseNumber: z.string().min(1),
    businessName: z.string().min(1),
    businessLicenseNumber: z.string().min(1),
    signatureDate: z.string().min(1),
  }),
  AttestationOfLandOwnership: z.object({
    ownerName: z.string().min(1),
    licenseNumber: z.string().min(1),
    facilityAddress: z.string().min(1),
    signatureDate: z.string().min(1),
  }),
  AttestationRegardingNationalBackgroundCheck: z.object({ signatureDate: z.string().min(1) }),
  MunicipalSetbackDistanceObjection: z.object({
    municipalityName: z.string().min(1),
    schoolName: z.string().min(1),
    dispensaryName: z.string().min(1),
    licenseNumber: z.string().min(1),
  }),
  SuretyBondCancellation: z.object({
    licenseNumber: z.string().min(1),
    bondNumber: z.string().min(1),
    cancellationDate: z.string().min(1),
  }),
  SuretyBondForm: z.object({
    licenseNumber: z.string().min(1),
    bondAmount: z.string().min(1),
  }),
  InterviewIntake: z.object({
    applicationNumber: z.string().min(1),
    fullName: z.string().min(1),
  }),
  AffidavitOfLawfulPresence: z.object({ signatureDate: z.string().min(1) }),

  ProcessorInspectionForm: z.object({ checklist: z.array(z.string()).optional() }),
  GrowerInspectionForm: z.object({ checklist: z.array(z.string()).optional() }),
  WasteDisposalInspectionForm: z.object({ checklist: z.array(z.string()).optional() }),

  // Informational / Guidelines forms (no validation needed, but schema for consistency)
  MonthlyReportingDeadlines: z.object({}),
  ThcUniversalSymbolGuidelines: z.object({}),
  OmmaRegionMap: z.object({}),
  FoodLicenseFactSheet: z.object({}),
  BackgroundCheckRequirements: z.object({}),
  BackgroundCheckInformation: z.object({}),
  ResearchApplicationGuidelines: z.object({}),
  ThcUniversalSymbol: z.object({}),
  LaboratoryIntakeSampleProcess: z.object({}),
} as const;

export type OmmaFormType = keyof typeof ommaSchemas;
export type OmmaFormData<T extends OmmaFormType> = z.infer<(typeof ommaSchemas)[T]>;
