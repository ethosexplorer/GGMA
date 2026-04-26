import React, { useState } from 'react';
import { Search, Filter, Shield, Scale, MapPin, Star, MessageSquare, Briefcase, FileText, Globe, CheckCircle, ExternalLink, Gavel } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AttorneyMarketplaceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const attorneys = [
    {
      id: 'ATY-001',
      name: 'Sarah J. Richardson',
      firm: 'Richardson & Associates',
      location: 'Oklahoma City, OK',
      specialties: ['Regulatory Compliance', 'OMMA Licensing', 'Administrative Law'],
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      status: 'Online Now',
      bio: 'Expert in Oklahoma cannabis law since SQ 788. Successfully managed over 200 commercial license applications.',
      verified: true
    },
    {
      id: 'ATY-002',
      name: 'Marcus Thorne',
      firm: 'Thorne Legal Group',
      location: 'Miami, FL / Los Angeles, CA',
      specialties: ['Multi-State Operations', 'M&A', 'Corporate Governance'],
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
      status: 'Busy',
      bio: 'Specializing in interstate expansion and complex corporate structuring for MSOs.',
      verified: true
    },
    {
      id: 'ATY-003',
      name: 'Elena Vance',
      firm: 'Vance Regulatory Law',
      location: 'Austin, TX',
      specialties: ['Criminal Defense', 'Patient Advocacy', 'Expungement'],
      rating: 5.0,
      reviews: 215,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
      status: 'Online Now',
      bio: 'Protecting patient rights and navigating restrictive medical programs in Texas.',
      verified: true
    },
    {
      id: 'ATY-004',
      name: 'David Choi',
      firm: 'Pacific Cannabis Counsel',
      location: 'Seattle, WA',
      specialties: ['Tax (280E)', 'IP Protection', 'Employment Law'],
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      status: 'Away',
      bio: 'Strategic tax planning and intellectual property protection for cannabis brands.',
      verified: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-[#1a4731] text-white p-8 md:p-12 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-full bg-white/5 blur-3xl rounded-full translate-x-1/2"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-4">
            <Gavel size={12} />
            Verified Legal Marketplace
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">
            Connect with Elite <br /> <span className="text-emerald-400">Cannabis Legal Counsel</span>
          </h2>
          <p className="text-emerald-100/70 text-lg font-medium max-w-2xl">
            The GGP-OS Attorney Marketplace connects business owners and patients with verified legal experts specialized in state-specific regulatory compliance.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-6 bg-white border-b border-slate-200 sticky top-0 z-20 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by specialty, location, or attorney name..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#1a4731] font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:border-[#1a4731] hover:text-[#1a4731] transition-all flex items-center gap-2">
            <Filter size={18} /> Jurisdiction
          </button>
          <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:border-[#1a4731] hover:text-[#1a4731] transition-all flex items-center gap-2">
            <Shield size={18} /> Specialty
          </button>
          <button className="px-8 py-3.5 bg-[#1a4731] text-white rounded-2xl text-sm font-black hover:bg-[#153a28] shadow-lg shadow-emerald-900/20 transition-all">
            Find Matches
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {attorneys.filter(atty => 
            atty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            atty.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
            atty.location.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((atty) => (
            <div key={atty.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all group relative flex flex-col md:flex-row gap-6">
               <div className="shrink-0 relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-500">
                    <img src={atty.image} alt={atty.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={cn("absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white z-20 shadow-sm", 
                    atty.status === 'Online Now' ? "bg-emerald-500" : atty.status === 'Busy' ? "bg-amber-500" : "bg-slate-300"
                  )}></div>
               </div>

               <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                         <h3 className="text-xl font-black text-slate-900">{atty.name}</h3>
                         {atty.verified && <CheckCircle size={16} className="text-blue-500 fill-blue-50" />}
                       </div>
                       <p className="text-sm font-bold text-[#1a4731]">{atty.firm}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                       <Star size={14} className="text-amber-500 fill-amber-500" />
                       <span className="text-xs font-black text-amber-700">{atty.rating}</span>
                       <span className="text-[10px] font-bold text-amber-600/60 ml-1">({atty.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4">
                    <MapPin size={14} className="text-slate-400" />
                    {atty.location}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium italic">
                    "{atty.bio}"
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {atty.specialties.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => ((window as any).Calendly ? (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/shantell-ggma' }) : window.open('https://calendly.com/shantell-ggma', '_blank'))} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a4731] text-white rounded-2xl text-xs font-black hover:bg-[#153a28] shadow-lg shadow-emerald-900/20 transition-all">
                       <MessageSquare size={16} /> Consult Now
                    </button>
                    <button className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all">
                       <FileText size={18} />
                    </button>
                  </div>
               </div>
               
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={20} className="text-slate-300 hover:text-[#1a4731] cursor-pointer" />
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Footer */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Scale size={20} className="text-emerald-400" />
           </div>
           <div>
              <p className="text-sm font-black uppercase tracking-widest">Malpractice Insured</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight">All marketplace attorneys carry verified professional liability insurance.</p>
           </div>
        </div>
        <div className="flex gap-8">
           <div className="text-center">
              <p className="text-lg font-black leading-none mb-1 text-emerald-400">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bar Verified</p>
           </div>
           <div className="text-center">
              <p className="text-lg font-black leading-none mb-1 text-emerald-400">24h</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Response</p>
           </div>
           <div className="text-center">
              <p className="text-lg font-black leading-none mb-1 text-emerald-400">$2M+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Settled / Saved</p>
           </div>
        </div>
      </div>
    </div>
  );
};


