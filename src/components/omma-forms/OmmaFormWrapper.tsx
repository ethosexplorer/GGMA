'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { ommaSchemas, type OmmaFormType } from '../../lib/omma-schemas';
import { generateOmmaPdf } from '../../lib/pdf/generateOmmaPdf';

interface Props {
  formType: OmmaFormType;
  children: (props: any) => React.ReactNode;
  defaultValues?: any;
}

export default function OmmaFormWrapper({ formType, children, defaultValues }: Props) {
  // @ts-ignore
  const schema = ommaSchemas[formType] || z.any();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: any) => {
    try {
      // Simulate submission to API
      const submissionId = `OMMA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      // Generate the PDF entirely in the browser using pdf-lib
      const pdfBytes = await generateOmmaPdf(formType, data, submissionId);
      
      // Trigger a browser download of the PDF blob
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formType}-${submissionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      alert('✅ Form submitted! Your official OMMA PDF is downloading.');
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
