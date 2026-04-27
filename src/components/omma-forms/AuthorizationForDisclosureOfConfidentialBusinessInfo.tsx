'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  legalEntityName: z.string().min(1),
  ommaLicenseNumber: z.string().min(1),
  financialInstitutionName: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function AuthorizationForDisclosureOfConfidentialBusinessInfo() {
  return (
    <OmmaFormWrapper schema={schema} formType="AuthorizationForDisclosureOfConfidentialBusinessInfo">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Authorization for Disclosure of Confidential Business Information</h1>
          <div><label>Legal Entity Name</label><input {...register('legalEntityName')} className="border p-3 w-full rounded" /></div>
          <div><label>OMMA License Number</label><input {...register('ommaLicenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Financial Institution Name</label><input {...register('financialInstitutionName')} className="border p-3 w-full rounded" /></div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
