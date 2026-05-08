import React from 'react';
import { AlertCircle, FileText, Lock, ShieldAlert, ArrowUpRight, Scale, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface UpdateItem {
  id: string;
  category: 'legal' | 'compliance' | 'federal' | 'state';
  title: string;
  date: string;
  summary: string;
  fullText: string;
  link?: string;
  icon: any;
  color: string;
}

const updates: UpdateItem[] = [
  {
    id: 'omma-dea-reschedule',
    category: 'federal',
    title: 'OMMA Monitors DEA Rescheduling Status & Lawsuit',
    date: 'Recent Update',
    summary: 'The DEA has released instructions for dispensaries, but OMMA has NOT issued emergency rules for Oklahoma. State laws remain unchanged at this time.',
    fullText: 'As the federal landscape for medical marijuana continues to shift, OMMA is closely monitoring the DEA\'s final rescheduling rule and the recent petition filed by SAM and NDASA with the U.S. Court of Appeals. \n\n"These announcements have created a lot of questions, but very few answers have been received. OMMA will continue to relay information as released by the DEA and federal government, but, ultimately, we encourage licensees to seek professional counsel as they determine the best decisions for their business," said OMMA Executive Director Adria Berry.\n\nOMMA FAQ Highlight:\nAt this time, OMMA\'s regulatory and licensing requirements and rules remain unchanged. The federal rule does not, by itself, amend Oklahoma law or automatically require rule changes. OMMA-licensed businesses must continue to adhere to existing state regulatory requirements.',
    link: 'https://oklahoma.gov/omma/about/news/2026/update-omma-monitors-dea-rescheduling-status-shares-recently-filed-lawsuit.html',
    icon: ShieldAlert,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'omma-lockbox',
    category: 'state',
    title: 'Free OMMA Medication Lockboxes & Legal Protection',
    date: 'Active Program',
    summary: 'Law enforcement generally requires a warrant to search a locked container. Request your free medication lockbox today to protect your rights.',
    fullText: 'Attention Patients: The Oklahoma Medical Marijuana Authority (OMMA) partners with the Oklahoma Department of Mental Health and Substance Abuse Services (ODMHSAS) to provide free medication lockboxes. \n\nKeeping cannabis in a locked box provides an additional layer of legal protection, as law enforcement generally requires a warrant to open and search a locked container, even during a routine traffic stop. This is a critical piece of legal knowledge for patient protection and compliance.',
    link: 'https://oklahoma.gov/odmhsas/prevention/request-medication-lockbox.html',
    icon: Lock,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'federal-hemp-compliance',
    category: 'compliance',
    title: 'Hemp-Derived Intoxicating Cannabinoid Regulations',
    date: 'Ongoing Review',
    summary: 'Several states are reviewing legislation to restrict or regulate hemp-derived intoxicating cannabinoids (like Delta-8 and Delta-9 THC) and apply age/packaging restrictions.',
    fullText: 'States like Wisconsin and Washington have introduced bills to tightly regulate intoxicating hemp products, aiming to prohibit sales to individuals under 21, mandate child-resistant packaging, and require strict laboratory testing. Businesses operating across state lines should be prepared for varying degrees of compliance enforcement on hemp-derived cannabinoids, separate from adult-use and medical marijuana frameworks.',
    icon: Scale,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  }
];

export const ImportantUpdates = ({ role = 'general' }: { role?: string }) => {
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Bell className="text-red-500 animate-pulse" size={28} />
            Important Updates & Advisories
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Critical legal, compliance, and federal updates affecting the GGP-OS ecosystem.</p>
        </div>
        <div className="hidden sm:block">
          <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-full uppercase tracking-widest">
            {updates.length} Active Alerts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {updates.map((update) => (
          <div key={update.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={cn("px-6 py-4 border-b flex items-center gap-3", update.color)}>
              <update.icon size={20} />
              <h3 className="font-bold text-sm uppercase tracking-wider">{update.category} Alert</h3>
              <span className="ml-auto text-xs font-semibold opacity-75">{update.date}</span>
            </div>
            
            <div className="p-6">
              <h4 className="text-xl font-black text-slate-800 mb-3">{update.title}</h4>
              <p className="text-slate-600 font-medium mb-4">{update.summary}</p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {update.fullText}
                </p>
              </div>

              {update.link && (
                <a 
                  href={update.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1a4731] hover:text-[#235e41] hover:underline transition-all"
                >
                  <FileText size={16} /> Read Full Official Release <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
