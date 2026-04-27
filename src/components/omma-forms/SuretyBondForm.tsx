'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  licenseNumber: z.string().min(1),
  bondAmount: z.string().min(1),
});

export function SuretyBondForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="SuretyBondForm">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Commercial Medical Marijuana Grower License Bond</h1>
          <div><label>OMMA License Number</label><input {...register('licenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Penal Sum Amount</label><input {...register('bondAmount')} className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
