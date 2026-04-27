'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  individualName: z.string().min(1),
  applicant: z.string().min(1),
  licenseType: z.string().min(1),
  licenseNumber: z.string().min(1),
  applicationNo: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function AffidavitOutdoorExclusiveGrow() {
  return (
    <OmmaFormWrapper schema={schema} formType="AffidavitOutdoorExclusiveGrow">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Affidavit Outdoor Exclusive Grow Certificate of Occupancy Form - Renewal Only</h1>
          <div><label>Individual Affiant Name</label><input {...register('individualName')} className="border p-3 w-full rounded" /></div>
          <div><label>Applicant</label><input {...register('applicant')} className="border p-3 w-full rounded" /></div>
          <div><label>License Number</label><input {...register('licenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
