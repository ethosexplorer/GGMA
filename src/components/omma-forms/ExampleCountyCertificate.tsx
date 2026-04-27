'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const schema = z.object({ countyName: z.string().min(1) });

export function ExampleCountyCertificate() {
  return (
    <OmmaFormWrapper schema={schema} formType="ExampleCountyCertificate">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">County Zoning Certificate</h1>
          <div><label className="font-bold">County Name</label><input {...register('countyName')} className="border border-slate-300 p-3 w-full rounded-lg mt-1" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
