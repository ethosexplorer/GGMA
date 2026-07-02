import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Globe2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ALL_STATES, STATE_REGULATORY_MAP, getTraceabilityBadgeColor, getCannabisStatusColor } from '../../lib/stateRegulatory';

interface StateJurisdictionSelectorProps {
  value: string;
  onChange: (state: string) => void;
  /** Visual variant: 'dark' for dark-themed dashboards, 'light' for light-themed */
  variant?: 'dark' | 'light';
  /** Show regulatory metadata below the selector */
  showMetadata?: boolean;
  /** Compact mode — smaller for sidebars and toolbars */
  compact?: boolean;
  /** Label text override */
  label?: string;
  /** CSS class override */
  className?: string;
}

export const StateJurisdictionSelector: React.FC<StateJurisdictionSelectorProps> = ({
  value,
  onChange,
  variant = 'dark',
  showMetadata = false,
  compact = false,
  label = 'Jurisdiction',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const stateData = value !== 'All States Active' ? STATE_REGULATORY_MAP[value] : null;

  const filteredStates = ALL_STATES.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase()) ||
    STATE_REGULATORY_MAP[s].abbr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const isDark = variant === 'dark';

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-xl font-bold transition-all border',
          compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2.5 text-xs',
          isDark
            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
          isOpen && (isDark ? 'ring-2 ring-indigo-500/40 border-indigo-500/50' : 'ring-2 ring-indigo-500/20 border-indigo-400')
        )}
      >
        <Globe2 size={compact ? 13 : 15} className={isDark ? 'text-indigo-400' : 'text-indigo-500'} />
        <span className={cn('uppercase tracking-wider', compact ? 'text-[9px]' : 'text-[10px]', isDark ? 'text-slate-500' : 'text-slate-400')}>
          {label}:
        </span>
        <span className={cn('font-black', compact ? 'text-[11px]' : 'text-xs')}>
          {value === 'All States Active' ? '🌐 All States' : `${stateData?.abbr || ''} ${value}`}
        </span>
        <ChevronDown size={compact ? 12 : 14} className={cn('transition-transform ml-1', isOpen && 'rotate-180', isDark ? 'text-slate-500' : 'text-slate-400')} />
      </button>

      {/* Metadata Bar (optional) */}
      {showMetadata && stateData && (
        <div className={cn(
          'flex flex-wrap items-center gap-2 mt-2',
          compact ? 'text-[9px]' : 'text-[10px]'
        )}>
          <span className={cn('px-2 py-0.5 rounded-lg border font-black uppercase tracking-wider',
            getTraceabilityBadgeColor(stateData.traceabilitySystem)
          )}>
            {stateData.traceabilitySystem}
          </span>
          <span className={cn('font-bold', getCannabisStatusColor(stateData.cannabisStatus))}>
            {stateData.cannabisStatus}
          </span>
          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
          <span className={isDark ? 'text-slate-400 font-bold' : 'text-slate-500 font-bold'}>
            {stateData.licensingAuthority}
          </span>
          {stateData.reciprocity && (
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-black uppercase tracking-wider text-[8px]">
              Reciprocity
            </span>
          )}
        </div>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={cn(
          'absolute top-full left-0 mt-2 z-[200] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200',
          compact ? 'w-72' : 'w-96',
          isDark
            ? 'bg-[#0c1220] border-slate-700/60'
            : 'bg-white border-slate-200'
        )}>
          {/* Search */}
          <div className={cn('p-3 border-b', isDark ? 'border-slate-700/50' : 'border-slate-100')}>
            <div className={cn('flex items-center gap-2 rounded-xl px-3 py-2',
              isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'
            )}>
              <Search size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search states..."
                className={cn(
                  'flex-1 bg-transparent outline-none text-xs font-medium',
                  isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400'
                )}
              />
            </div>
          </div>

          {/* All States Option */}
          <button
            onClick={() => { onChange('All States Active'); setIsOpen(false); setSearchTerm(''); }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b',
              isDark ? 'border-slate-700/30 hover:bg-indigo-500/10' : 'border-slate-100 hover:bg-indigo-50',
              value === 'All States Active' && (isDark ? 'bg-indigo-500/15 border-l-2 border-l-indigo-500' : 'bg-indigo-50 border-l-2 border-l-indigo-500')
            )}
          >
            <Globe2 size={16} className="text-indigo-400" />
            <div>
              <span className={cn('text-xs font-black', isDark ? 'text-white' : 'text-slate-800')}>🌐 All States Active</span>
              <p className={cn('text-[10px] font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>Aggregate nationwide — 51 jurisdictions</p>
            </div>
          </button>

          {/* State List */}
          <div className="max-h-72 overflow-y-auto">
            {filteredStates.map(state => {
              const data = STATE_REGULATORY_MAP[state];
              const isActive = value === state;
              return (
                <button
                  key={state}
                  onClick={() => { onChange(state); setIsOpen(false); setSearchTerm(''); }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 text-left transition-all',
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50',
                    isActive && (isDark ? 'bg-indigo-500/10 border-l-2 border-l-indigo-400' : 'bg-indigo-50 border-l-2 border-l-indigo-500')
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={12} className={cn(
                      isActive ? 'text-indigo-400' : (isDark ? 'text-slate-600' : 'text-slate-300')
                    )} />
                    <div>
                      <span className={cn('text-xs font-bold', isDark ? 'text-slate-200' : 'text-slate-700')}>
                        {data.abbr} — {state}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn('text-[9px] font-bold', getCannabisStatusColor(data.cannabisStatus))}>
                          {data.cannabisStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border',
                    getTraceabilityBadgeColor(data.traceabilitySystem)
                  )}>
                    {data.traceabilitySystem === 'None' ? '—' : data.traceabilitySystem}
                  </span>
                </button>
              );
            })}

            {filteredStates.length === 0 && (
              <div className={cn('px-4 py-8 text-center text-xs font-medium', isDark ? 'text-slate-600' : 'text-slate-400')}>
                No states matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
