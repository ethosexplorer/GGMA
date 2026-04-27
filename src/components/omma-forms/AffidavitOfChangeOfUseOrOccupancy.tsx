'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  individualName: z.string().min(1),
  applicantEntity: z.string().min(1),
  title: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function AffidavitOfChangeOfUseOrOccupancy() {
  return (
    <OmmaFormWrapper schema={schema} formType="AffidavitOfChangeOfUseOrOccupancy">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Affidavit of Change of Use or Occupancy After COO Submission</h1>
          <div><label>Individual Name</label><input {...register('individualName')} className="border p-3 w-full rounded" /></div>
          <div><label>Applicant Entity Name</label><input {...register('applicantEntity')} className="border p-3 w-full rounded" /></div>
          <div><label>Title</label><input {...register('title')} className="border p-3 w-full rounded" /></div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
