import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Search, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguagesByRegion, type Language } from '../lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  compact?: boolean; // For navbar use
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange, compact = false }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const languagesByRegion = getLanguagesByRegion();

  // Filter languages by search
  const filteredLanguages = search.trim()
    ? SUPPORTED_LANGUAGES.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
        l.code.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearch('');
  };

  const LanguageItem: React.FC<{ lang: Language }> = ({ lang }) => (
    <button
      onClick={() => handleSelect(lang.code)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left ${
        lang.code === currentLanguage ? 'bg-emerald-50 border-l-2 border-emerald-500' : ''
      }`}
    >
      <span className="text-lg">{lang.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{lang.nativeName}</p>
        <p className="text-[10px] text-slate-400 truncate">{lang.name}</p>
      </div>
      {lang.code === currentLanguage && (
        <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
      )}
    </button>
  );

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 transition-all ${
          compact
            ? 'px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/10 backdrop-blur-sm'
            : 'px-4 py-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-700 border border-slate-200 shadow-sm hover:shadow'
        }`}
      >
        <Globe size={compact ? 14 : 16} />
        <span className="text-lg leading-none">{currentLang.flag}</span>
        <span className={`font-bold ${compact ? 'text-[10px] hidden sm:inline' : 'text-xs'}`}>
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  autoFocus
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredLanguages ? (
                // Search results
                filteredLanguages.length > 0 ? (
                  filteredLanguages.map(lang => (
                    <LanguageItem key={lang.code} lang={lang} />
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">No languages found</div>
                )
              ) : (
                // Grouped by region
                Object.entries(languagesByRegion).map(([region, langs]) => (
                  <div key={region}>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{region}</span>
                    </div>
                    {langs.map(lang => (
                      <LanguageItem key={lang.code} lang={lang} />
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50">
              <p className="text-[10px] text-slate-400 text-center">
                {SUPPORTED_LANGUAGES.length} languages available • Powered by GGP-OS
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
