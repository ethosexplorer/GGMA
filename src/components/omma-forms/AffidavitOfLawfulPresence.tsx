'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ signatureDate: z.string().min(1) });

export function AffidavitOfLawfulPresence() {
  return (
    <OmmaFormWrapper schema={schema} formType="AffidavitOfLawfulPresence">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Affidavit of Lawful Presence</h1>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
