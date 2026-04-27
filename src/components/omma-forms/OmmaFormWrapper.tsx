'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { ommaSchemas, type OmmaFormType } from '../../lib/omma-schemas';

interface Props {
  formType: OmmaFormType;
  children: (props: any) => React.ReactNode;
  defaultValues?: any;
}

export default function OmmaFormWrapper({ formType, children, defaultValues }: Props) {
  const schema = ommaSchemas[formType];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/omma-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, data, userId: 'CURRENT_USER_ID' }),
      });

      const result = await res.json();
      if (result.success) {
        alert('✅ Form submitted and PDF generated');
        window.open(`/api/omma-forms/${result.submissionId}/pdf`, '_blank');
      }
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white shadow-2xl p-8 rounded-2xl">
      {children({ register, errors })}
      <button type="submit" disabled={isSubmitting} className="w-full mt-10 bg-green-700 hover:bg-green-800 text-white text-lg py-7 rounded-xl flex items-center justify-center font-bold transition-colors">
        {isSubmitting ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : 'Submit to OMMA & Download Official PDF'}
      </button>
    </form>
  );
}
