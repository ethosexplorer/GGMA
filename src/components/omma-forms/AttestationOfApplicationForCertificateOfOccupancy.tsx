'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  submissionDate: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function AttestationOfApplicationForCertificateOfOccupancy() {
  return (
    <OmmaFormWrapper schema={schema} formType="AttestationOfApplicationForCertificateOfOccupancy">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Attestation of Application for Certificate of Occupancy</h1>
          <div className="border p-6 rounded-xl">
            <label className="block font-medium">Date submitted (mm/dd/yyyy)</label>
            <input {...register('submissionDate')} type="date" className="w-full border p-4 rounded" />
          </div>
          <div className="border p-6 rounded-xl">
            <label className="block font-medium">Signature (Full Legal Name)</label>
            <input type="text" className="w-full border p-4 rounded" placeholder="Type full legal name" />
          </div>
          <div className="border p-6 rounded-xl">
            <label className="block font-medium">Date of Signature (mm/dd/yyyy)</label>
            <input {...register('signatureDate')} type="date" className="w-full border p-4 rounded" />
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
