import React, { useState, useEffect } from 'react';
import { Brain, Trash2, Shield, Plus, Info, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { LarryMedCardChatbot } from './LarryMedCardChatbot';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

interface Memory {
  id: string;
  timestamp: number;
  content: string;
}

export const AITrainingTab = ({ userProfile, onNavigate }: { userProfile: any; onNavigate?: (tabId: string) => void }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // ── Load memories from Firebase (real-time) ──
  useEffect(() => {
    if (!userProfile?.uid) {
      // Fallback to localStorage if no uid
      try {
        const stored = JSON.parse(localStorage.getItem('ai_training_matrix') || '[]');
        setMemories(stored.map((m: any, i: number) => ({ ...m, id: m.id || `local_${i}` })));
      } catch {
        setMemories([]);
      }
      return;
    }

    const memRef = collection(db, 'users', userProfile.uid, 'ai_memory');
    const unsub = onSnapshot(memRef, (snap) => {
      const mems = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          timestamp: data.createdAt?.toDate?.()?.getTime() || Date.now(),
          content: data.content || '',
        };
      });
      mems.sort((a, b) => b.timestamp - a.timestamp);
      setMemories(mems);
      setIsSynced(true);
    }, (err) => {
      console.error('Failed to load AI memory:', err);
      setIsSynced(false);
    });

    return () => unsub();
  }, [userProfile?.uid]);

  // ── Migrate localStorage memories to Firebase ──
  const migrateLocalToFirebase = async () => {
    if (!userProfile?.uid) return;
    try {
      const stored = JSON.parse(localStorage.getItem('ai_training_matrix') || '[]');
      if (stored.length === 0) return;

      const memRef = collection(db, 'users', userProfile.uid, 'ai_memory');
      for (const mem of stored) {
        await addDoc(memRef, {
          content: mem.content,
          createdAt: serverTimestamp(),
          createdBy: userProfile.displayName || userProfile.email || 'Executive',
          migratedFrom: 'localStorage',
        });
      }
      localStorage.removeItem('ai_training_matrix');
      alert(`✅ Migrated ${stored.length} directives to Firebase (cloud-synced).`);
    } catch (err) {
      console.error('Migration failed:', err);
      alert('❌ Migration failed. Please try again.');
    }
  };

  const deleteMemory = async (memId: string) => {
    if (!userProfile?.uid) {
      // localStorage fallback
      const newMemories = memories.filter(m => m.id !== memId);
      localStorage.setItem('ai_training_matrix', JSON.stringify(newMemories));
      setMemories(newMemories);
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userProfile.uid, 'ai_memory', memId));
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const clearAll = async () => {
    if (!confirm('Are you sure you want to clear the entire AI memory matrix? This cannot be undone.')) return;

    if (!userProfile?.uid) {
      localStorage.setItem('ai_training_matrix', '[]');
      setMemories([]);
      return;
    }

    try {
      const memRef = collection(db, 'users', userProfile.uid, 'ai_memory');
      const snap = await getDocs(memRef);
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch (err) {
      console.error('Failed to clear memories:', err);
    }
  };

  const addManualDirective = async () => {
    const content = prompt('Enter a directive for Sylara to memorize:');
    if (!content?.trim()) return;

    if (!userProfile?.uid) {
      const newMem = { id: `local_${Date.now()}`, timestamp: Date.now(), content: content.trim() };
      const updated = [newMem, ...memories];
      localStorage.setItem('ai_training_matrix', JSON.stringify(updated));
      setMemories(updated);
      return;
    }

    try {
      await addDoc(collection(db, 'users', userProfile.uid, 'ai_memory'), {
        content: content.trim(),
        createdAt: serverTimestamp(),
        createdBy: userProfile.displayName || userProfile.email || 'Executive',
      });
    } catch (err) {
      console.error('Failed to add directive:', err);
    }
  };

  // Check for localStorage memories to migrate
  const hasLocalMemories = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_training_matrix') || '[]');
      return stored.length > 0 && userProfile?.uid;
    } catch { return false; }
  })();

  return (
    <div className="flex h-full w-full gap-6 min-h-0">
      {/* Left Side: Training & Memory Matrix */}
      <div className="w-1/3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
          <h2 className="text-xl font-black flex items-center gap-3">
            <Brain size={24} className="text-purple-400" />
            AI Memory Matrix
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-slate-400 font-medium flex-1">Persistent knowledge base for your Executive AI.</p>
            <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
              isSynced ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            )}>
              {isSynced ? <Cloud size={10} /> : <CloudOff size={10} />}
              {isSynced ? 'Cloud Synced' : 'Local Only'}
            </div>
          </div>
        </div>

        {hasLocalMemories && (
          <div className="p-3 bg-amber-50 border-b border-amber-100">
            <button
              onClick={migrateLocalToFirebase}
              className="w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
            >
              <Cloud size={14} /> Migrate Local Directives to Cloud
            </button>
          </div>
        )}

        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <h3 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Info size={12} /> How to Train
          </h3>
          <p className="text-xs text-indigo-900 font-medium">
            In the chat, start any message with <strong>Train:</strong>, <strong>Learn:</strong>, or <strong>Remember:</strong> followed by the rule you want her to memorize.
          </p>
          <div className="mt-2 text-[10px] bg-white p-2 rounded border border-indigo-200 font-mono text-slate-600">
            Train: The safe code is 8842.
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Stored Directives ({memories.length})</h3>
            <div className="flex items-center gap-2">
              <button onClick={addManualDirective} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">
                <Plus size={12} /> Add
              </button>
              {memories.length > 0 && (
                <button onClick={clearAll} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest">Clear All</button>
              )}
            </div>
          </div>

          {memories.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <Brain size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-500">No custom directives yet.</p>
              <p className="text-xs text-slate-400 mt-1">Train your AI to see them here.</p>
            </div>
          ) : (
            memories.map((mem) => (
              <div key={mem.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 group relative">
                <button
                  onClick={() => deleteMemory(mem.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Forget this rule"
                >
                  <Trash2 size={16} />
                </button>
                <p className="text-xs text-slate-400 font-bold mb-1">
                  {new Date(mem.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-slate-700 font-medium pr-6">{mem.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side: Full Chat Interface */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0">
          <LarryMedCardChatbot
            userProfile={userProfile}
            inline={true}
            onNavigate={(view: string) => {
              if (onNavigate) {
                onNavigate(view);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
