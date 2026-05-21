import React, { useState, useEffect } from 'react';
import { Search, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

interface Props {
  dark?: boolean;
}

export const NationalEnforcementLedger: React.FC<Props> = ({ dark = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await turso.execute('SELECT * FROM omma_enforcement_records ORDER BY created_at DESC LIMIT 5');
        setRecentAudits(res.rows);
      } catch (err) {
        console.error('NationalEnforcementLedger recent load error:', err);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = async (queryStr: string, stateCode: string) => {
    setSearchQuery(queryStr);
    if (!queryStr.trim() && stateCode === 'ALL') {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      let sql = 'SELECT * FROM omma_enforcement_records WHERE 1=1';
      const args: any[] = [];

      if (queryStr.trim()) {
        sql += ' AND (business_name LIKE ? OR dba LIKE ? OR license_number LIKE ?)';
        const likeQuery = `%${queryStr}%`;
        args.push(likeQuery, likeQuery, likeQuery);
      }

      if (stateCode !== 'ALL') {
        sql += ' AND state = ?';
        args.push(stateCode);
      }

      sql += ' LIMIT 20';
      const res = await turso.execute({ sql, args });
      setResults(res.rows);
    } catch (err) {
      console.error('National Intel Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const containerBg = dark ? 'bg-[#0f1b2d] border-[#1e3a5f]/60 text-white' : 'bg-white border-slate-200 text-slate-800';
  const headerBorder = dark ? 'border-[#1e3a5f]/30' : 'border-slate-100';
  const subText = dark ? 'text-blue-300/50' : 'text-slate-400 font-bold';
  const badgeStyle = dark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-900/40' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
  const inputBg = dark ? 'bg-[#0a1628] border-[#1e3a5f]/50 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';
  const selectBg = dark ? 'bg-[#0a1628]' : 'bg-white';
  const itemBg = dark ? 'bg-[#0a1628]/60 border-[#1e3a5f]/30' : 'bg-slate-50/60 border-slate-200/60';
  const itemText = dark ? 'text-slate-300' : 'text-slate-600';
  const itemDba = dark ? 'text-slate-400' : 'text-slate-400';
  const detailLabel = dark ? 'text-slate-400' : 'text-slate-400';
  const detailSub = dark ? 'text-slate-500' : 'text-slate-400';
  const stateBadge = dark ? 'bg-blue-950 text-blue-400 border-blue-900/40' : 'bg-blue-50 text-blue-700 border-blue-100';
  const recentHeader = dark ? 'text-slate-400' : 'text-slate-400';
  const recentItemBg = dark ? 'bg-[#0a1628]/30 border-[#1e3a5f]/20' : 'bg-slate-50/30 border-slate-200/50';

  return (
    <div className={cn("rounded-3xl border p-8 space-y-6 shadow-sm", containerBg)}>
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4", headerBorder)}>
        <div>
          <h3 className={cn("text-lg font-black flex items-center gap-2", dark ? "text-white" : "text-slate-800")}>
            <Globe size={22} className="text-blue-500" />
            National Regulatory & Enforcement Ledger
          </h3>
          <p className={cn("text-xs mt-1", subText)}>
            Aggregated historical registry of license suspensions, forfeitures, and regulatory outcomes.
          </p>
        </div>
        <span className={cn("text-[10px] font-black border px-3 py-1.5 rounded-xl uppercase tracking-wider self-start md:self-center flex items-center gap-1.5", badgeStyle)}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Realtime Sync Active
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search business, DBA, or license ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value, stateFilter)}
            className={cn("w-full border focus:border-blue-500 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-slate-400", inputBg)}
          />
        </div>
        <div className={cn("sm:w-48 rounded-2xl border flex items-center px-4", inputBg)}>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-2 shrink-0">State:</span>
          <select
            value={stateFilter}
            className="flex-1 bg-transparent border-none text-xs font-black text-slate-700 outline-none cursor-pointer py-3.5"
            onChange={(e) => {
              const val = e.target.value;
              setStateFilter(val);
              handleSearch(searchQuery, val);
            }}
          >
            <option value="ALL" className={selectBg}>All States</option>
            <option value="OK" className={selectBg}>Oklahoma (OK)</option>
            <option value="MS" className={selectBg}>Mississippi (MS)</option>
            <option value="CA" className={selectBg}>California (CA)</option>
            <option value="TX" className={selectBg}>Texas (TX)</option>
            <option value="MO" className={selectBg}>Missouri (MO)</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-slate-500 text-xs font-bold">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
            Querying national authority databases...
          </div>
        ) : (searchQuery.trim() || stateFilter !== 'ALL') ? (
          results.length > 0 ? (
            results.map((record) => (
              <div key={record.id} className={cn("border rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md", itemBg)}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider", stateBadge)}>{record.state}</span>
                    <span className={cn("text-sm font-black", dark ? "text-white" : "text-slate-800")}>{record.business_name}</span>
                    {record.dba && <span className={cn("text-[10px] font-bold", itemDba)}>({record.dba})</span>}
                  </div>
                  <p className={cn("text-xs font-bold leading-relaxed", itemText)}>
                    <strong className={detailLabel}>Action/Reason:</strong> {record.reasons}
                  </p>
                  <div className={cn("flex items-center gap-4 text-[9px] font-black uppercase tracking-wider", detailSub)}>
                    <span>Type: {record.license_type}</span>
                    <span>License: {record.license_number}</span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0">
                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    record.status.toLowerCase().includes('active') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : record.status.toLowerCase().includes('suspend') 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  )}>{record.status}</span>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", detailSub)}>{record.dates_connected}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-2xl">
              No matching records found.
            </div>
          )
        ) : (
          // Default: show recent database updates
          <div className="space-y-3">
            <p className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-2", recentHeader)}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Latest Database Audits
            </p>
            {recentAudits.map((record) => (
              <div key={record.id} className={cn("border rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 hover:shadow-sm transition-all", recentItemBg)}>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border", stateBadge)}>{record.state}</span>
                    <span className={cn("text-xs font-black", dark ? "text-white" : "text-slate-800")}>{record.business_name}</span>
                  </div>
                  <p className={cn("text-[11px] font-bold leading-relaxed truncate max-w-xl", itemText)}>
                    {record.reasons}
                  </p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <span className={cn("text-[9px] font-black uppercase tracking-wider", detailSub)}>{record.dates_connected}</span>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                    record.status.toLowerCase().includes('active') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : record.status.toLowerCase().includes('suspend') 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  )}>{record.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
