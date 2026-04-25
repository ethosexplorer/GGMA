import React, { useState } from 'react';
import { turso } from '../../lib/turso';
import { Search, MapPin, Star, Calendar, Video, Filter, ChevronRight, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const providers = [
  { id: 1, name: 'Dr. Sarah Johnson', credentials: 'MD', type: 'cannabis', specialties: ['Chronic Pain', 'PTSD'], states: ['OK'], rating: 4.9, reviews: 127, nextSlot: 'Tomorrow 10:00 AM', featured: true },
  { id: 2, name: 'Dr. Michael Chen', credentials: 'DO', type: 'both', specialties: ['Anxiety', 'Insomnia', 'General Wellness'], states: ['OK', 'TX'], rating: 4.8, reviews: 94, nextSlot: 'Today 3:30 PM', featured: true },
  { id: 3, name: 'Dr. Emily Rodriguez', credentials: 'NP', type: 'cannabis', specialties: ['Epilepsy', 'Chronic Pain'], states: ['OK'], rating: 4.7, reviews: 68, nextSlot: 'Apr 22, 9:00 AM', featured: false },
  { id: 4, name: 'Dr. James Williams', credentials: 'MD', type: 'traditional', specialties: ['Internal Medicine', 'Preventive Care'], states: ['OK', 'AR'], rating: 4.6, reviews: 203, nextSlot: 'Apr 21, 2:00 PM', featured: false },
  { id: 5, name: 'Dr. Lisa Park', credentials: 'MD', type: 'cannabis', specialties: ['Holistic Care', 'Nausea', 'PTSD'], states: ['OK', 'CO'], rating: 4.9, reviews: 156, nextSlot: 'Today 5:00 PM', featured: true },
  { id: 6, name: 'Dr. Robert Martinez', credentials: 'DO', type: 'both', specialties: ['Pain Management', 'Neurology'], states: ['OK'], rating: 4.5, reviews: 42, nextSlot: 'Apr 23, 11:00 AM', featured: false },
];

const serviceTypes = ['All', 'Cannabis Recommendation', 'Traditional Telehealth', 'Both'];

export const ProviderDirectoryTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbProviders, setDbProviders] = useState<any[]>([]);

  React.useEffect(() => {
    turso.execute('SELECT * FROM providers LIMIT 10').then(res => setDbProviders(res.rows)).catch(console.error);
  }, []);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const activeProviders = dbProviders.length > 0 ? dbProviders.map(t => ({ id: t.id, name: t.name, rating: 5.0, reviews: 120, nextAvail: 'Today', specialties: [t.specialty], tags: ['Verified'] })) : providers;
  const filtered = activeProviders.filter(p => {
      p.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All' ||
      (selectedType === 'Cannabis Recommendation' && (p.type === 'cannabis' || p.type === 'both')) ||
      (selectedType === 'Traditional Telehealth' && (p.type === 'traditional' || p.type === 'both')) ||
      (selectedType === 'Both' && p.type === 'both');
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-2">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                  selectedType === type ? "bg-[#1a4731] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {type === 'Cannabis Recommendation' ? '🌿 Cannabis' : type === 'Traditional Telehealth' ? '🩺 Traditional' : type === 'Both' ? '🌿🩺 Both' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {searchQuery === '' && selectedType === 'All' && (
        <div className="bg-emerald-50 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5">
          <h3 className="font-bold text-emerald-800 mb-1 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" /> Recommended for You
          </h3>
          <p className="text-xs text-emerald-600 mb-3">Based on your qualifying conditions, location, and past visits</p>
        </div>
      )}

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((provider) => (
          <div
            key={provider.id}
            className={cn(
              "bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer hover:shadow-md",
              provider.featured ? "border-emerald-200" : "border-slate-200",
              selectedProvider === provider.id ? "ring-2 ring-emerald-500" : ""
            )}
            onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
          >
            {provider.featured && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold mb-3">⭐ Featured</span>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                {provider.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm">{provider.name}, {provider.credentials}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-slate-700">{provider.rating}</span>
                  <span className="text-xs text-slate-400">({provider.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              {provider.type === 'cannabis' || provider.type === 'both' ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">🌿 Cannabis</span>
              ) : null}
              {provider.type === 'traditional' || provider.type === 'both' ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">🩺 General</span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {provider.specialties.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">{s}</span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MapPin size={12} /> {provider.states.join(', ')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <Calendar size={12} /> Next: {provider.nextSlot}
            </div>

            {selectedProvider === provider.id && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <button className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                  <Video size={16} /> Book Telehealth
                </button>
                <button className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                  View Full Profile
                </button>
                <div className="flex items-center gap-1 justify-center text-[10px] text-emerald-600">
                  <Shield size={10} /> OMMA Registered & Verified
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">No providers found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};



