'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  licenseNumber: z.string().min(1),
  bondNumber: z.string().min(1),
  cancellationDate: z.string().min(1),
});

export function SuretyBondCancellation() {
  return (
    <OmmaFormWrapper schema={schema} formType="SuretyBondCancellation">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Cancellation of Commercial Medical Marijuana Grower License Bond</h1>
          <div><label>OMMA License Number</label><input {...register('licenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Surety Bond Number</label><input {...register('bondNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Date of Cancellation</label><input {...register('cancellationDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
