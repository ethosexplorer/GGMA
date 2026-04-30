import React, { useState, useEffect } from 'react';
import { Brain, Trash2, Shield, Plus, Info, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { LarryMedCardChatbot } from '../App'; // Importing the chatbot directly

interface Memory {
  timestamp: number;
  content: string;
}

export const AITrainingTab = ({ userProfile }: { userProfile: any }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMemories = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_training_matrix') || '[]');
      setMemories(stored);
    } catch (e) {
      setMemories([]);
    }
  };

  useEffect(() => {
    loadMemories();
    
    // Poll for updates in case the chatbot modifies it
    const interval = setInterval(loadMemories, 2000);
    return () => clearInterval(interval);
  }, []);

  const deleteMemory = (timestamp: number) => {
    const newMemories = memories.filter(m => m.timestamp !== timestamp);
    localStorage.setItem('ai_training_matrix', JSON.stringify(newMemories));
    setMemories(newMemories);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear the entire AI memory matrix? This cannot be undone.')) {
      localStorage.setItem('ai_training_matrix', '[]');
      setMemories([]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6">
      {/* Left Side: Training & Memory Matrix */}
      <div className="w-1/3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-900 text-white">
          <h2 className="text-xl font-black flex items-center gap-3">
            <Brain size={24} className="text-purple-400" />
            AI Memory Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">Manage the persistent knowledge base for your Executive Personal Assistant.</p>
        </div>

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
            {memories.length > 0 && (
              <button onClick={clearAll} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest">Clear All</button>
            )}
          </div>

          {memories.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <Brain size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-500">No custom directives yet.</p>
              <p className="text-xs text-slate-400 mt-1">Train your AI to see them here.</p>
            </div>
          ) : (
            memories.map((mem) => (
              <div key={mem.timestamp} className="bg-slate-50 border border-slate-200 rounded-xl p-4 group relative">
                <button 
                  onClick={() => deleteMemory(mem.timestamp)}
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
        {/* We reuse the LarryMedCardChatbot component but pass a prop to force it inline and avoid it looking like a popup modal */}
        <div className="absolute inset-0">
          <LarryMedCardChatbot 
            userProfile={userProfile} 
            onNavigate={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
