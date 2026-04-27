'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  ownerName: z.string().min(1),
  licenseNumber: z.string().min(1),
  facilityAddress: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function AttestationOfLandOwnership() {
  return (
    <OmmaFormWrapper schema={schema} formType="AttestationOfLandOwnership">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Attestation of Land Ownership</h1>
          <div><label>Owner First &amp; Last Name</label><input {...register('ownerName')} className="border p-3 w-full rounded" /></div>
          <div><label>OMMA License Number</label><input {...register('licenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Facility / Permit Area Address</label><input {...register('facilityAddress')} className="border p-3 w-full rounded" /></div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
