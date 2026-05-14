import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Phone, Mail, Clock, ShieldCheck, Building2, User, Landmark, Building, Briefcase, Scale, HeartHandshake, Truck, Search, X, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const STAGES = [
  { id: 'lead', title: 'Lead / Prospect', color: 'border-slate-300', bg: 'bg-slate-50' },
  { id: 'contacted', title: 'Contacted', color: 'border-blue-300', bg: 'bg-blue-50' },
  { id: 'demo', title: 'Demo / Consult', color: 'border-indigo-300', bg: 'bg-indigo-50' },
  { id: 'proposal', title: 'Under Review', color: 'border-amber-300', bg: 'bg-amber-50' },
  { id: 'active', title: 'Active / Won', color: 'border-emerald-300', bg: 'bg-emerald-50' },
];

const ENTITY_TYPES = [
  { id: 'patient', label: 'Patient', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: User },
  { id: 'business', label: 'Business', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Building2 },
  { id: 'provider', label: 'Provider / Clinic', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: ShieldCheck },
  { id: 'attorney', label: 'Attorney / Law Firm', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Scale },
  { id: 'agency', label: 'Gov / State Agency', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Landmark },
  { id: 'advocate', label: 'Advocate', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: HeartHandshake },
  { id: 'distribution', label: 'Distribution', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Truck },
  { id: 'partner', label: 'Partner', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Briefcase },
  { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Building },
];

const TEAM = [
  { id: 'founder', name: 'Shantell Robinson' },
  { id: 'ceo', name: 'Ryan Ferrari' },
  { id: 'compliance', name: 'Monica Green' },
  { id: 'advisor', name: 'Bob Moore' },
  { id: 'unassigned', name: 'Unassigned' },
];

interface Deal {
  id: string;
  name: string;
  contactName: string;
  type: string;
  stage: string;
  value: number;
  assignedTo: string;
  phone: string;
  email: string;
  licenseNumber: string;
  jurisdiction: string;
  notes: string;
  updatedAt: any;
}

export const PipelineCRM = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', contactName: '', type: 'business', stage: 'lead',
    value: '', assignedTo: 'unassigned', phone: '', email: '',
    licenseNumber: '', jurisdiction: '', notes: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'crm_deals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dealsData: Deal[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Deal));
      // Sort by recently updated
      dealsData.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setDeals(dealsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;

    const deal = deals.find(d => d.id === dealId);
    if (deal && deal.stage !== stageId) {
      // Optimistic update
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: stageId } : d));
      
      // Update Firestore
      try {
        await updateDoc(doc(db, 'crm_deals', dealId), {
          stage: stageId,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Failed to update deal stage:', err);
      }
    }
  };

  const openModal = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        name: deal.name, contactName: deal.contactName, type: deal.type,
        stage: deal.stage, value: deal.value.toString(), assignedTo: deal.assignedTo,
        phone: deal.phone, email: deal.email, licenseNumber: deal.licenseNumber || '', jurisdiction: deal.jurisdiction || '', notes: deal.notes || ''
      });
    } else {
      setEditingDeal(null);
      setFormData({
        name: '', contactName: '', type: 'business', stage: 'lead',
        value: '', assignedTo: 'unassigned', phone: '', email: '',
        licenseNumber: '', jurisdiction: '', notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const dealData = {
        name: formData.name,
        contactName: formData.contactName,
        type: formData.type,
        stage: formData.stage,
        value: Number(formData.value) || 0,
        assignedTo: formData.assignedTo,
        phone: formData.phone,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        jurisdiction: formData.jurisdiction,
        notes: formData.notes,
        updatedAt: serverTimestamp()
      };

      if (editingDeal) {
        await updateDoc(doc(db, 'crm_deals', editingDeal.id), dealData);
      } else {
        await addDoc(collection(db, 'crm_deals'), {
          ...dealData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save deal:', err);
      alert('Failed to save. Check your connection and permissions.');
    }
  };

  const handleDelete = async () => {
    if (!editingDeal) return;
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDoc(doc(db, 'crm_deals', editingDeal.id));
        setIsModalOpen(false);
      } catch (err) {
        console.error('Failed to delete deal:', err);
      }
    }
  };

  const getTypeConfig = (typeId: string) => {
    return ENTITY_TYPES.find(t => t.id === typeId) || ENTITY_TYPES[8];
  };

  const filteredDeals = deals.filter(d => {
    const n = d.name || '';
    const c = d.contactName || '';
    const s = searchTerm || '';
    return n.toLowerCase().includes(s.toLowerCase()) || 
           c.toLowerCase().includes(s.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global Pipeline ({deals.length})</h1>
          <p className="text-sm font-bold text-slate-500">Track and manage all platform relationships</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 font-medium w-64 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          
          <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer border border-slate-200">
            <Upload size={16} /> Import CSV
            <input 
              type="file" 
              accept=".csv" 
              className="hidden"
              onChange={async (e) => {
                try {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const text = await file.text();
                  const rows = text.split('\\n').filter(r => r.trim());
                  if (rows.length < 2) {
                    alert('File is empty or invalid format.');
                    return;
                  }
                  
                  const parseCSVRow = (str) => {
                    const result = [];
                    let current = '';
                    let inQuotes = false;
                    for (let i = 0; i < str.length; i++) {
                      const char = str[i];
                      if (char === '"' && str[i+1] === '"') {
                        current += '"';
                        i++;
                      } else if (char === '"') {
                        inQuotes = !inQuotes;
                      } else if (char === ',' && !inQuotes) {
                        result.push(current);
                        current = '';
                      } else {
                        current += char;
                      }
                    }
                    result.push(current);
                    return result.map(v => v.trim());
                  };
                  
                  const headers = parseCSVRow(rows[0]);
                  
                  let importCount = 0;
                  // Map over rows and call addDoc without awaiting each one sequentially
                  // This prevents the UI from hanging if Firebase network connection is slow
                  for (let i = 1; i < rows.length; i++) {
                    const values = parseCSVRow(rows[i]);
                    if (values.length < 2) continue;
                    
                    const record: any = {};
                    headers.forEach((h, idx) => { record[h] = values[idx] || ''; });
                    
                    let bName = record['Business Name'] || record['Name'] || '';
                    if (bName === 'Close' || !bName) {
                      bName = record['DBA'] || 'Unknown Business';
                    }
                    
                    const dealData = {
                      name: bName,
                      contactName: record['DBA'] && record['DBA'] !== bName ? record['DBA'] : '',
                      type: 'business',
                      stage: 'lead',
                      value: 0,
                      assignedTo: 'unassigned',
                      phone: record['Telephone'] || record['Phone'] || '',
                      email: record['Email'] || '',
                      licenseNumber: record['License Number'] || record['License'] || '',
                      jurisdiction: record['State'] || record['Jurisdiction'] || 'Oklahoma',
                      notes: record['Raw Data'] || record['Status'] || '',
                      createdAt: serverTimestamp(),
                      updatedAt: serverTimestamp()
                    };
                    
                    // Don't await - let Firebase local cache handle it instantly
                    addDoc(collection(db, 'crm_deals'), dealData).catch(err => {
                      console.error('Import failed for row', i, err);
                    });
                    importCount++;
                  }
                  alert(`Successfully imported ${importCount} leads! They are syncing in the background.`);
                } catch (error) {
                  alert(`Error during import: ${error.message}`);
                } finally {
                  e.target.value = ''; // reset input
                }
              }}
            />
          </label>

          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} /> Add Entity
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
        <div className="flex h-full gap-4 min-w-full pb-4">
          {STAGES.map(stage => (
            <div 
              key={stage.id} 
              className={cn("flex-1 min-w-[220px] max-w-[320px] flex flex-col rounded-xl border-t-4 bg-slate-100/50", stage.color)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="px-4 py-3 border-b border-slate-200/50 flex items-center justify-between bg-white/50 rounded-t-xl">
                <h3 className="font-black text-slate-700">{stage.title}</h3>
                <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-slate-100">
                  {filteredDeals.filter(d => d.stage === stage.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {filteredDeals.filter(d => d.stage === stage.id).map(deal => {
                  const TypeIcon = getTypeConfig(deal.type).icon;
                  return (
                    <div 
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => openModal(deal)}
                      className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border", getTypeConfig(deal.type).color)}>
                          <TypeIcon size={10} />
                          {getTypeConfig(deal.type).label}
                        </div>
                        <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{deal.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        {deal.contactName || 'No contact specified'}
                        {deal.jurisdiction && <span className="block mt-0.5 text-indigo-600 font-bold">{deal.jurisdiction}</span>}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-600" title={`Assigned to: ${TEAM.find(t => t.id === deal.assignedTo)?.name}`}>
                            {TEAM.find(t => t.id === deal.assignedTo)?.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div className="font-black text-sm text-slate-700">
                          {deal.value > 0 ? `$${deal.value.toLocaleString()}` : '-'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-black text-slate-800">{editingDeal ? 'Edit Record' : 'Add New Record'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Entity Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ENTITY_TYPES.map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={cn(
                          "px-3 py-2 border rounded-lg text-xs font-bold flex items-center gap-2 transition-all text-left",
                          formData.type === type.id ? type.color + ' ring-2 ring-indigo-500/50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <type.icon size={12} /> {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Assign To</label>
                    <select 
                      value={formData.assignedTo} 
                      onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    >
                      {TEAM.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Current Stage</label>
                    <select 
                      value={formData.stage} 
                      onChange={e => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    >
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Organization / Person Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="e.g. Green Leaf LLC or John Doe"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Contact Person</label>
                  <input 
                    type="text" 
                    value={formData.contactName} 
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="Main Point of Contact"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Estimated Value ($)</label>
                  <input 
                    type="number" 
                    value={formData.value} 
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">License / ID Number (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.licenseNumber} 
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="e.g. PAAA-XXXX-XXXX"
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">State / Jurisdiction</label>
                  <input 
                    type="text" 
                    value={formData.jurisdiction} 
                    onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500"
                    placeholder="e.g. Oklahoma or All States"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Internal Notes</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 resize-none"
                    placeholder="Add any relevant details, next steps, or history..."
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl shrink-0">
              {editingDeal ? (
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 font-bold text-sm rounded-lg transition-colors"
                >
                  Delete Record
                </button>
              ) : <div></div>}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-600/20 transition-colors"
                >
                  Save Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
