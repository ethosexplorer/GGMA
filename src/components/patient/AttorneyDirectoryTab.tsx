import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar, FileText, Lock, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const attorneys = [
  { id: 1, name: 'Robert Davis, Esq.', firm: 'Davis Legal Group', specialties: ['Cannabis Licensing', 'Expungement'], states: ['OK'], rating: 4.9, reviews: 84, nextSlot: 'Tomorrow 2:00 PM', featured: true },
  { id: 2, name: 'Maria Gonzalez, Esq.', firm: 'Gonzalez & Partners', specialties: ['Criminal Defense', 'Business Law'], states: ['OK', 'TX'], rating: 4.8, reviews: 112, nextSlot: 'Apr 21, 10:00 AM', featured: true },
  { id: 3, name: 'James Wilson, Esq.', firm: 'Wilson Compliance', specialties: ['Regulatory Compliance', 'Contracts'], states: ['OK'], rating: 4.7, reviews: 45, nextSlot: 'Today 4:00 PM', featured: false },
  { id: 4, name: 'Sarah Jenkins, Esq.', firm: 'Jenkins Legal', specialties: ['Patient Rights', 'Employment Law'], states: ['OK', 'CO'], rating: 4.9, reviews: 156, nextSlot: 'Apr 22, 11:30 AM', featured: false },
];

export const AttorneyDirectoryTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttorney, setSelectedAttorney] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<number | null>(null);

  const filtered = attorneys.filter(a => {
    return a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleGrantPermission = (id: number) => {
    // In a real app, this would open a consent modal to select exactly which data to share
    setPermissionGranted(id);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search attorneys by name, firm, or specialty (e.g. Expungement, Patient Rights)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
        <h3 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
          <Shield size={16} className="text-blue-600" /> Legal Support & Attorney Integration
        </h3>
        <p className="text-xs text-blue-700">
          Connect with specialized legal counsel. You can selectively grant attorneys permission to access your client data, document vault, and compliance history securely via the GGP-OS platform.
        </p>
      </div>

      {/* Attorney Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((attorney) => (
          <div
            key={attorney.id}
            className={cn(
              "bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer hover:shadow-md",
              attorney.featured ? "border-blue-200" : "border-slate-200",
              selectedAttorney === attorney.id ? "ring-2 ring-blue-500" : ""
            )}
            onClick={() => setSelectedAttorney(selectedAttorney === attorney.id ? null : attorney.id)}
          >
            {attorney.featured && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold mb-3">⭐ Featured</span>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {attorney.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm">{attorney.name}</h4>
                <p className="text-xs text-slate-500 truncate">{attorney.firm}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-slate-700">{attorney.rating}</span>
                  <span className="text-xs text-slate-400">({attorney.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {attorney.specialties.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">{s}</span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MapPin size={12} /> {attorney.states.join(', ')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
              <Calendar size={12} /> Next Consult: {attorney.nextSlot}
            </div>

            {selectedAttorney === attorney.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar size={16} /> Book Consultation
                </button>
                
                {permissionGranted === attorney.id ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold flex items-center justify-center gap-2">
                    <Lock size={16} /> Data Access Granted
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleGrantPermission(attorney.id); }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={16} /> Grant Record Access
                  </button>
                )}
                
                <div className="flex items-center gap-1 justify-center text-[10px] text-slate-500 text-center mt-2 px-2">
                  <Shield size={10} className="shrink-0" />
                  Access allows attorney to view patient data and compliance history for legal representation. You can revoke this anytime.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">No attorneys found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};
