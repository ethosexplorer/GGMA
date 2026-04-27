'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ businessName: z.string().min(1) });

export function CertificateOfCompliance() {
  return (
    <OmmaFormWrapper schema={schema} formType="CertificateOfCompliance">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Certificate of Compliance for OMMA Businesses</h1>
          <div><label className="font-bold text-sm">Business Entity Name</label><input {...register('businessName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
