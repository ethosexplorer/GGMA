'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ signatureDate: z.string().min(1) });

export function AttestationRegardingNationalBackgroundCheck() {
  return (
    <OmmaFormWrapper schema={schema} formType="AttestationRegardingNationalBackgroundCheck">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Attestation Regarding National Background Check</h1>
          <div className="border p-6 rounded-xl bg-amber-50">
            <p className="text-sm">I attest that I am unable to submit a national fingerprint-based background check at this time...</p>
          </div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
