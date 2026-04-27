'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  patientFirstName: z.string().min(1),
  patientLastName: z.string().min(1),
  patientLicenseNumber: z.string().min(1),
  licenseType: z.enum(['2year', '60day']),
});

export function PhysicianRecommendationAdult() {
  return (
    <OmmaFormWrapper schema={schema} formType="PhysicianRecommendationAdult">
      {({ register }) => (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b pb-6">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl">OK</div>
             <div>
               <h1 className="text-3xl font-bold text-green-800">Physician Recommendation Form</h1>
               <p className="text-green-600 font-medium">Adult Patient License</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div><label className="font-bold text-sm">Patient First Name</label><input {...register('patientFirstName')} className="border border-slate-300 p-3 w-full rounded-lg mt-1" /></div>
            <div><label className="font-bold text-sm">Patient Last Name</label><input {...register('patientLastName')} className="border border-slate-300 p-3 w-full rounded-lg mt-1" /></div>
            <div><label className="font-bold text-sm">Current License # (if renewal)</label><input {...register('patientLicenseNumber')} className="border border-slate-300 p-3 w-full rounded-lg mt-1" /></div>
            <div>
              <label className="font-bold text-sm">License Type</label>
              <select {...register('licenseType')} className="border border-slate-300 p-3 w-full rounded-lg mt-1 bg-white">
                <option value="2year">Standard 2-Year</option>
                <option value="60day">Short-Term 60-Day</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
