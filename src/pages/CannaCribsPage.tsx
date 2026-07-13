import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Home, Building2, Star, Shield, Check, ChevronDown,
  Sparkles, ArrowRight, Phone, Mail, Globe, Eye, Heart, Filter,
  Bed, Bath, Maximize, Leaf, DollarSign, Clock, Users, CheckCircle,
  X, Menu, ChevronRight, Zap, Award, TrendingUp, ShieldCheck,
  Briefcase, CalendarCheck, FileText, CreditCard, Wifi, Car,
  Flame, Wind, TreePine
} from 'lucide-react';

// ─── SAMPLE PROPERTY DATA ───
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Cannabis-Friendly Loft',
    type: 'Apartment',
    location: 'Oklahoma City, OK',
    price: 1450,
    priceType: '/mo',
    beds: 2,
    baths: 2,
    sqft: 1100,
    cannabisPolicy: 'Indoor & Outdoor OK',
    policyColor: 'emerald',
    furnished: true,
    petFriendly: true,
    rating: 4.9,
    reviews: 24,
    verified: true,
    tier: 'Gold',
    gradient: 'from-violet-600 via-purple-500 to-indigo-600',
    amenities: ['Air Filtration', 'Private Balcony', 'In-Unit Laundry'],
    tag: 'FEATURED',
  },
  {
    id: 2,
    title: 'Cozy 420-Friendly Cottage',
    type: 'House',
    location: 'Norman, OK',
    price: 1200,
    priceType: '/mo',
    beds: 3,
    baths: 1,
    sqft: 1400,
    cannabisPolicy: 'Outdoor Only',
    policyColor: 'amber',
    furnished: false,
    petFriendly: true,
    rating: 4.7,
    reviews: 18,
    verified: true,
    tier: 'Green',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-600',
    amenities: ['Fenced Yard', 'Porch', 'Garage'],
    tag: null,
  },
  {
    id: 3,
    title: 'Luxury CannaCrib Suite',
    type: 'Short-Term',
    location: 'Scottsdale, AZ',
    price: 189,
    priceType: '/night',
    beds: 1,
    baths: 1,
    sqft: 800,
    cannabisPolicy: 'Full Consumption',
    policyColor: 'emerald',
    furnished: true,
    petFriendly: false,
    rating: 5.0,
    reviews: 42,
    verified: true,
    tier: 'Executive',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    amenities: ['Welcome Kit', 'Concierge', 'Smart TV'],
    tag: 'LUXURY',
  },
  {
    id: 4,
    title: 'Spacious Grow-Friendly Rancher',
    type: 'House',
    location: 'Edmond, OK',
    price: 1800,
    priceType: '/mo',
    beds: 4,
    baths: 2,
    sqft: 2200,
    cannabisPolicy: 'Grow Space Included',
    policyColor: 'emerald',
    furnished: false,
    petFriendly: true,
    rating: 4.8,
    reviews: 11,
    verified: true,
    tier: 'Platinum',
    gradient: 'from-green-600 via-emerald-500 to-teal-500',
    amenities: ['Grow Room', '2-Car Garage', 'Large Yard'],
    tag: 'GROW READY',
  },
  {
    id: 5,
    title: 'Downtown Cannabis-Friendly Studio',
    type: 'Apartment',
    location: 'Tulsa, OK',
    price: 875,
    priceType: '/mo',
    beds: 0,
    baths: 1,
    sqft: 550,
    cannabisPolicy: 'Edibles & Vape Only',
    policyColor: 'blue',
    furnished: true,
    petFriendly: false,
    rating: 4.5,
    reviews: 31,
    verified: true,
    tier: 'Green',
    gradient: 'from-blue-600 via-indigo-500 to-purple-600',
    amenities: ['Gym Access', 'Rooftop', 'Doorman'],
    tag: null,
  },
  {
    id: 6,
    title: 'Desert Oasis Cannabis Retreat',
    type: 'Short-Term',
    location: 'Bullhead City, AZ',
    price: 145,
    priceType: '/night',
    beds: 2,
    baths: 2,
    sqft: 1050,
    cannabisPolicy: 'Full Consumption',
    policyColor: 'emerald',
    furnished: true,
    petFriendly: true,
    rating: 4.9,
    reviews: 56,
    verified: true,
    tier: 'Executive',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    amenities: ['Pool', 'Hot Tub', 'Mountain View'],
    tag: 'TOP RATED',
  },
  {
    id: 7,
    title: 'Cannabis-Friendly Commercial Space',
    type: 'Commercial',
    location: 'Moore, OK',
    price: 3200,
    priceType: '/mo',
    beds: 0,
    baths: 2,
    sqft: 4500,
    cannabisPolicy: 'Dispensary Ready',
    policyColor: 'emerald',
    furnished: false,
    petFriendly: false,
    rating: 4.6,
    reviews: 5,
    verified: true,
    tier: 'Platinum',
    gradient: 'from-slate-600 via-gray-500 to-zinc-600',
    amenities: ['Loading Dock', 'Security System', 'Zoned Commercial'],
    tag: 'COMMERCIAL',
  },
  {
    id: 8,
    title: 'Midtown 420 Friendly Townhome',
    type: 'House',
    location: 'Oklahoma City, OK',
    price: 1650,
    priceType: '/mo',
    beds: 3,
    baths: 2,
    sqft: 1800,
    cannabisPolicy: 'Indoor & Outdoor OK',
    policyColor: 'emerald',
    furnished: false,
    petFriendly: true,
    rating: 4.8,
    reviews: 19,
    verified: true,
    tier: 'Gold',
    gradient: 'from-cyan-600 via-sky-500 to-blue-600',
    amenities: ['Patio', 'New Appliances', 'Walk-In Closet'],
    tag: null,
  },
];

// ─── SERVICE TIERS ───
const SERVICE_TIERS = [
  {
    name: 'Green Listing',
    price: 49,
    emoji: '🟢',
    tagline: 'Get listed. Get found.',
    color: 'emerald',
    features: [
      'Property listing on CannaCribs',
      'Tenant application processing',
      'Background & credit checks',
      'Cannabis-friendly lease template',
      'Digital lease signing',
      'Landlord dashboard',
    ],
    notIncluded: ['Inspections', 'Cleaning services', 'Insurance brokering'],
    popular: false,
  },
  {
    name: 'Gold Crib',
    price: 149,
    emoji: '🟡',
    tagline: 'We find, screen, and check on your property.',
    color: 'amber',
    features: [
      'Everything in Green Listing',
      'Monthly property inspection',
      'Photo inspection reports',
      'Quarterly deep cleaning',
      'Tenant communication mgmt',
      'Cannabis compliance audit',
      '10% insurance discount',
      'Priority listing placement',
    ],
    notIncluded: [],
    popular: true,
  },
  {
    name: 'Platinum Crib',
    price: 299,
    emoji: '💎',
    tagline: 'Hotel-grade management. Zero stress.',
    color: 'violet',
    features: [
      'Everything in Gold Crib',
      'Weekly property inspections',
      'Bi-weekly professional cleaning',
      'Insurance brokering included',
      'Odor mitigation service',
      '24/7 emergency maintenance',
      'Rent collection + direct deposit',
      'Featured listing placement',
    ],
    notIncluded: [],
    popular: false,
  },
  {
    name: 'Executive Suite',
    price: 499,
    emoji: '👑',
    tagline: 'White-glove luxury cannabis living.',
    color: 'purple',
    features: [
      'Everything in Platinum',
      'Fully furnished + styled units',
      'Weekly cleaning + linen service',
      'Tenant welcome kit',
      'Concierge services',
      'Professional photography',
      'Dynamic pricing engine',
      'Dedicated account manager',
    ],
    notIncluded: [],
    popular: false,
  },
];

export const CannaCribsPage = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [priceRange, setPriceRange] = useState('Any');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [likedProperties, setLikedProperties] = useState<number[]>([]);

  const filteredProperties = useMemo(() => {
    return SAMPLE_PROPERTIES.filter(p => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Houses') return p.type === 'House';
      if (activeFilter === 'Apartments') return p.type === 'Apartment';
      if (activeFilter === 'Short-Term') return p.type === 'Short-Term';
      if (activeFilter === 'Commercial') return p.type === 'Commercial';
      if (activeFilter === 'Grow Ready') return p.cannabisPolicy.includes('Grow');
      if (activeFilter === 'Furnished') return p.furnished;
      return true;
    });
  }, [activeFilter]);

  const toggleLike = (id: number) => {
    setLikedProperties(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══ TOP BAR ═══ */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-900 text-white py-2 px-6 flex items-center justify-between text-xs font-bold overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] text-purple-200">Now serving Oklahoma & Arizona</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-purple-300">
          <span>📞 1-888-CANNA-CRIBS</span>
          <span>•</span>
          <span>✉️ hello@canna-cribs.com</span>
        </div>
      </div>

      {/* ═══ NAVIGATION ═══ */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 h-18 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 py-3">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Leaf className="text-white" size={20} />
            </div>
            <div className="ml-2">
              <div className="text-xl font-black tracking-tight">
                <span className="text-green-600">Canna</span>
                <span className="text-amber-500">Cribs</span>
              </div>
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">Cannabis-Friendly Real Estate</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button className="hover:text-green-600 transition-colors flex items-center gap-1">
            <Search size={14} /> Browse
          </button>
          <button className="hover:text-green-600 transition-colors">Short-Term Stays</button>
          <button className="hover:text-green-600 transition-colors">Commercial</button>
          <button className="hover:text-green-600 transition-colors flex items-center gap-1">
            <Shield size={14} /> For Landlords
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-4 py-2 text-sm font-bold text-green-700 hover:text-green-800 transition-colors">
            Log In
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/20">
            List Your Property
          </button>
          <button className="md:hidden p-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-slate-200 px-6 py-4 md:hidden z-40 relative"
          >
            <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
              <button className="text-left py-2 hover:text-green-600">Browse Properties</button>
              <button className="text-left py-2 hover:text-green-600">Short-Term Stays</button>
              <button className="text-left py-2 hover:text-green-600">Commercial</button>
              <button className="text-left py-2 hover:text-green-600">For Landlords</button>
              <button className="text-left py-2 hover:text-green-600">Log In</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0a2e1a]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(34,197,94,0.3), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.3), transparent 50%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 pb-24 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-green-300 uppercase tracking-widest backdrop-blur-sm mb-6">
              <Leaf size={12} />
              Your Home. Your Rules. Your Green.
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4">
              Cannabis-Friendly<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-amber-400">
                Real Estate
              </span>
            </h1>

            <p className="text-xl text-purple-100/70 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
              Find apartments, houses, and short-term stays where you can be yourself.
              No judgment. No surprises. Just cannabis-friendly living.
            </p>
          </motion.div>

          {/* ═══ SEARCH BAR ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                  <input
                    type="text"
                    placeholder="City, State, or ZIP code..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-white/10 rounded-xl text-white placeholder-white/40 font-medium focus:outline-none focus:ring-2 focus:ring-green-400/50 border border-white/10"
                  />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-4 bg-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-400/50 border border-white/10 appearance-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-800">All Types</option>
                  <option value="Apartment" className="bg-slate-800">Apartments</option>
                  <option value="House" className="bg-slate-800">Houses</option>
                  <option value="Short-Term" className="bg-slate-800">Short-Term</option>
                  <option value="Commercial" className="bg-slate-800">Commercial</option>
                </select>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-4 bg-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-400/50 border border-white/10 appearance-none cursor-pointer"
                >
                  <option value="Any" className="bg-slate-800">Any Price</option>
                  <option value="0-1000" className="bg-slate-800">Under $1,000</option>
                  <option value="1000-1500" className="bg-slate-800">$1,000 - $1,500</option>
                  <option value="1500-2500" className="bg-slate-800">$1,500 - $2,500</option>
                  <option value="2500+" className="bg-slate-800">$2,500+</option>
                </select>
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/30 flex items-center gap-2">
                  <Search size={18} /> Search
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            {[
              { value: '500+', label: 'Properties Listed' },
              { value: '38', label: 'States Active' },
              { value: '4.8★', label: 'Avg Rating' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-green-400">{stat.value}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FILTER BAR ═══ */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto pb-1">
          <Filter size={16} className="text-slate-400 flex-shrink-0" />
          {['All', 'Houses', 'Apartments', 'Short-Term', 'Commercial', 'Grow Ready', 'Furnished'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ PROPERTY LISTINGS ═══ */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeFilter === 'All' ? 'Featured Properties' : activeFilter}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{filteredProperties.length} cannabis-friendly properties available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Property Image Placeholder */}
                <div className={`relative h-48 bg-gradient-to-br ${property.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/80">
                      {property.type === 'House' && <Home size={48} className="mx-auto mb-2 opacity-60" />}
                      {property.type === 'Apartment' && <Building2 size={48} className="mx-auto mb-2 opacity-60" />}
                      {property.type === 'Short-Term' && <Star size={48} className="mx-auto mb-2 opacity-60" />}
                      {property.type === 'Commercial' && <Briefcase size={48} className="mx-auto mb-2 opacity-60" />}
                      <span className="text-xs font-bold uppercase tracking-widest opacity-50">{property.type}</span>
                    </div>
                  </div>

                  {/* Tag Badge */}
                  {property.tag && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm border border-white/20">
                      {property.tag}
                    </div>
                  )}

                  {/* Like Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(property.id); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Heart
                      size={16}
                      className={likedProperties.includes(property.id) ? 'text-red-500 fill-red-500' : 'text-slate-400'}
                    />
                  </button>

                  {/* Cannabis Policy Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                      property.policyColor === 'emerald' ? 'bg-emerald-500/80 border-emerald-300/30 text-white' :
                      property.policyColor === 'amber' ? 'bg-amber-500/80 border-amber-300/30 text-white' :
                      'bg-blue-500/80 border-blue-300/30 text-white'
                    }`}>
                      🌿 {property.cannabisPolicy}
                    </div>
                    {property.verified && (
                      <div className="w-7 h-7 rounded-full bg-green-500/90 flex items-center justify-center backdrop-blur-sm">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-green-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
                        <MapPin size={11} />
                        {property.location}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-black text-slate-900">${property.price.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-slate-400">{property.priceType}</span>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold mb-3">
                    {property.beds > 0 && (
                      <span className="flex items-center gap-1"><Bed size={12} /> {property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
                    )}
                    <span className="flex items-center gap-1"><Bath size={12} /> {property.baths} Bath</span>
                    <span className="flex items-center gap-1"><Maximize size={12} /> {property.sqft.toLocaleString()} sqft</span>
                  </div>

                  {/* Amenity Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {property.amenities.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">{a}</span>
                    ))}
                    {property.furnished && <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">Furnished</span>}
                    {property.petFriendly && <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-bold text-amber-600">🐾 Pets OK</span>}
                  </div>

                  {/* Rating & Tier */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star size={12} className="fill-amber-400" /> {property.rating}
                      <span className="text-slate-400 font-medium">({property.reviews})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      property.tier === 'Executive' ? 'bg-purple-100 text-purple-700' :
                      property.tier === 'Platinum' ? 'bg-violet-100 text-violet-700' :
                      property.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {property.tier} Tier
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 mx-auto">
              View All Properties <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-[11px] font-black text-green-700 uppercase tracking-widest mb-4">
              <Zap size={12} /> How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              From Search to Move-In in <span className="text-green-600">5 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', icon: <Search size={24} />, title: 'Browse & Search', desc: 'Filter by location, type, price, and cannabis policy', color: 'from-purple-500 to-violet-600' },
              { step: '02', icon: <FileText size={24} />, title: 'Apply Online', desc: 'Submit your application + $45 fee for screening', color: 'from-blue-500 to-indigo-600' },
              { step: '03', icon: <ShieldCheck size={24} />, title: 'Get Verified', desc: 'Background, credit, and cannabis card verification', color: 'from-green-500 to-emerald-600' },
              { step: '04', icon: <CalendarCheck size={24} />, title: 'Get Approved', desc: 'Landlord reviews and accepts through our portal', color: 'from-amber-500 to-orange-600' },
              { step: '05', icon: <Home size={24} />, title: 'Move In', desc: 'Sign digitally, pay, and enjoy your new CannaCrib', color: 'from-rose-500 to-pink-600' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Step {item.step}</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                {i < 4 && (
                  <div className="hidden md:block absolute top-8 -right-3 text-slate-300">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICE TIERS ═══ */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-black text-purple-700 uppercase tracking-widest mb-4">
              <Award size={12} /> For Landlords
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Choose Your <span className="text-purple-600">Service Tier</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Every tier includes the base CannaCribs listing. Higher tiers add inspection, cleaning, and insurance services that eliminate risk and justify premium rents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  tier.name === 'Executive Suite'
                    ? 'bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] text-white border-2 border-purple-500/50'
                    : tier.popular
                    ? 'bg-white border-2 border-green-500 shadow-lg shadow-green-500/10'
                    : 'bg-white border-2 border-slate-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="text-3xl mb-3">{tier.emoji}</div>
                <h3 className={`text-lg font-black mb-1 ${tier.name === 'Executive Suite' ? 'text-amber-400' : 'text-slate-900'}`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-black ${tier.name === 'Executive Suite' ? 'text-green-400' : 'text-green-600'}`}>
                    ${tier.price}
                  </span>
                  <span className={`text-xs font-semibold ${tier.name === 'Executive Suite' ? 'text-white/40' : 'text-slate-400'}`}>/mo per property</span>
                </div>
                <p className={`text-xs italic mb-5 ${tier.name === 'Executive Suite' ? 'text-white/50' : 'text-slate-500'}`}>
                  {tier.tagline}
                </p>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2 text-xs ${tier.name === 'Executive Suite' ? 'text-white/70' : 'text-slate-600'}`}>
                      <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {tier.notIncluded.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                      <X size={14} className="flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  tier.name === 'Executive Suite'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20'
                    : tier.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CANNACRIBS ═══ */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#0a2e1a] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Why <span className="text-green-400">Canna</span><span className="text-amber-400">Cribs</span>?
            </h2>
            <p className="text-purple-200/60 mt-3 max-w-xl mx-auto">
              We're not just another listing site. We're the only full-service cannabis real estate platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Eye size={28} />,
                title: 'Hotel-Grade Inspections',
                desc: '30-point property inspections with photo documentation. Weekly, monthly, or quarterly — based on your tier. Cannabis-specific checks included.',
                color: 'from-violet-500/20 to-purple-500/20',
                border: 'border-violet-500/30',
              },
              {
                icon: <Sparkles size={28} />,
                title: 'Professional Cleaning',
                desc: 'Standard, deep, and hotel-style turnover cleaning. Includes cannabis odor mitigation with ozone treatment and air scrubbing.',
                color: 'from-green-500/20 to-emerald-500/20',
                border: 'border-green-500/30',
              },
              {
                icon: <Shield size={28} />,
                title: 'Insurance Brokering',
                desc: 'We broker specialty cannabis-friendly property insurance for landlords. Renters insurance for tenants. Eliminate the risk that keeps landlords from saying yes.',
                color: 'from-amber-500/20 to-orange-500/20',
                border: 'border-amber-500/30',
              },
              {
                icon: <TrendingUp size={28} />,
                title: '20-30% Above Market Rent',
                desc: 'Cannabis-friendly tenants pay premium for peace of mind. Our landlords earn more with less vacancy because demand is massive.',
                color: 'from-blue-500/20 to-indigo-500/20',
                border: 'border-blue-500/30',
              },
              {
                icon: <ShieldCheck size={28} />,
                title: 'Full Compliance',
                desc: 'Cannabis-specific lease addendums, consumption waivers, ventilation requirements — all managed through our platform.',
                color: 'from-cyan-500/20 to-teal-500/20',
                border: 'border-cyan-500/30',
              },
              {
                icon: <Users size={28} />,
                title: 'Powered by GGP-OS',
                desc: 'Enterprise compliance engine, CRM, document management, and analytics — the same platform trusted by government agencies.',
                color: 'from-rose-500/20 to-pink-500/20',
                border: 'border-rose-500/30',
              },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-6 hover:scale-[1.02] transition-all`}>
                <div className="text-green-400 mb-4">{item.icon}</div>
                <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LANDLORD CTA ═══ */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-black text-amber-700 uppercase tracking-widest mb-6">
            <DollarSign size={12} /> Landlord Opportunity
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Earn <span className="text-green-600">3x More</span> on Your Property
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            Our CEO previously secured short-term leases at 3x annual rates by offering hotel-grade inspection and cleaning services to landlords. The same proven model, now for cannabis-friendly real estate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-4xl font-black text-green-600 mb-2">3x</div>
              <div className="text-sm font-bold text-slate-700">Lease Rate vs Traditional</div>
              <div className="text-xs text-slate-400 mt-1">Proven with insurance-displaced housing</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-4xl font-black text-green-600 mb-2">20-30%</div>
              <div className="text-sm font-bold text-slate-700">Premium Over Market Rent</div>
              <div className="text-xs text-slate-400 mt-1">Tenants pay more for freedom</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-4xl font-black text-green-600 mb-2">50%+</div>
              <div className="text-sm font-bold text-slate-700">Service Profit Margin</div>
              <div className="text-xs text-slate-400 mt-1">Cleaning & inspection markup</div>
            </div>
          </div>

          <button className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-xl shadow-green-500/20 flex items-center gap-3 mx-auto">
            <Home size={20} /> List Your Property Now <ArrowRight size={20} />
          </button>
          <p className="text-xs text-slate-400 mt-3">Start with Green Listing at just $49/month • No long-term contracts</p>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-10">
            CannaCribs vs. <span className="text-slate-400">Everyone Else</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-xs font-black uppercase tracking-wider text-slate-500">Feature</th>
                  <th className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Leaf size={14} className="text-green-500" />
                      <span className="text-sm font-black text-green-600">CannaCribs</span>
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-bold text-slate-400">Zillow</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-400">Airbnb</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-400">Facebook</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cannabis-Friendly Filter', true, false, false, false],
                  ['Tenant Screening', true, false, false, false],
                  ['Property Inspections', true, false, false, false],
                  ['Cleaning Services', true, false, true, false],
                  ['Insurance Brokering', true, false, false, false],
                  ['Cannabis Lease Templates', true, false, false, false],
                  ['Odor Mitigation', true, false, false, false],
                  ['Commercial Listings', true, true, false, false],
                  ['Short-Term + Long-Term', true, false, true, false],
                ].map(([feature, cc, z, a, fb], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-4 text-sm font-semibold text-slate-700">{feature as string}</td>
                    <td className="p-4 text-center">{cc ? <CheckCircle size={18} className="text-green-500 mx-auto" /> : <X size={18} className="text-slate-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{z ? <CheckCircle size={18} className="text-slate-300 mx-auto" /> : <X size={18} className="text-slate-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{a ? <CheckCircle size={18} className="text-slate-300 mx-auto" /> : <X size={18} className="text-slate-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{fb ? <CheckCircle size={18} className="text-slate-300 mx-auto" /> : <X size={18} className="text-slate-300 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-gradient-to-br from-[#1a0a2e] to-[#0a1f14] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-xl font-black">
                    <span className="text-green-400">Canna</span>
                    <span className="text-amber-400">Cribs</span>
                  </div>
                  <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">A Global Green Enterprise</div>
                </div>
              </div>
              <p className="text-sm text-white/50 max-w-md leading-relaxed mb-4">
                The first full-service cannabis-friendly real estate platform. Combining Zillow-style property search with hotel-grade management services and insurance brokering.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-white/30">
                <span>Oklahoma City, OK</span>
                <span>•</span>
                <span>Bullhead City, AZ</span>
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-green-400 mb-4">For Tenants</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="hover:text-white cursor-pointer transition-colors">Browse Properties</li>
                <li className="hover:text-white cursor-pointer transition-colors">Short-Term Stays</li>
                <li className="hover:text-white cursor-pointer transition-colors">How It Works</li>
                <li className="hover:text-white cursor-pointer transition-colors">Apply Now</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-widest text-amber-400 mb-4">For Landlords</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="hover:text-white cursor-pointer transition-colors">List Your Property</li>
                <li className="hover:text-white cursor-pointer transition-colors">Service Tiers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Landlord Dashboard</li>
                <li className="hover:text-white cursor-pointer transition-colors">Insurance Services</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/30 text-center md:text-left">
              © 2026 Global Green Enterprises, a DBA of Diversity Health and Wellness. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Accessibility</span>
              <span className="text-green-400/60 font-bold">Powered by GGP-OS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ BACK TO GGP-OS BUTTON ═══ */}
      {onNavigate && (
        <button
          onClick={() => onNavigate('landing')}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 border border-emerald-400/30"
        >
          <Globe size={14} /> Back to GGP-OS
        </button>
      )}
    </div>
  );
};

export default CannaCribsPage;
