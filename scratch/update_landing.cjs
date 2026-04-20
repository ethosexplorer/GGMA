const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Update Hero Search to feature Sylara AI Call Center
const oldSearch = `<div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search state laws, statutes, or business regulati..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#a3b18a] hover:bg-[#8da9c4] text-white rounded-xl text-sm font-bold transition-all">
              Quick Search
            </button>
          </div>`;

const newSearch = `<div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Bot className="text-purple-600" size={24} />
            </div>
            <input
              type="text"
              placeholder="Ask Sylara: Type a question, search state laws, or request a call..."
              className="w-full pl-14 pr-[180px] py-4 bg-white border border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all text-slate-800 text-lg"
            />
            <div className="absolute right-2 top-2 bottom-2 flex gap-2">
              <button onClick={() => onNavigate('support')} className="px-5 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                <MessageSquare size={16} /> Text
              </button>
              <button onClick={() => alert('Initiating voice call with Sylara AI Call Center Agent...')} className="px-5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                <Smartphone size={16} /> Call
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-4">
            <Sparkles size={14} className="inline text-purple-600 mr-1" /> 
            Sylara is our 24/7 AI Call Center Agent. She handles compliance, applications, and routing.
          </p>`;

c = c.replace(oldSearch, newSearch);

// Also add a floating Sylara Call Center widget to the LandingPage
const oldEnd = `        </div>
      </section>
    </div>
  );
};`;

const newEnd = `        </div>
      </section>

      {/* Floating Sylara Call Center Agent Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => onNavigate('support')}
          className="bg-purple-700 text-white p-4 rounded-full shadow-2xl hover:bg-purple-800 hover:scale-105 transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner">
            <img src="/larry-logo.png" alt="Sylara" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block text-left pr-2">
            <div className="text-sm font-bold leading-tight">Sylara AI Agent</div>
            <div className="text-[11px] text-white/80">Call or Text 24/7</div>
          </div>
        </button>
      </div>

    </div>
  );
};`;

c = c.replace(oldEnd, newEnd);

fs.writeFileSync('src/App.tsx', c);
console.log('Landing page updated with Sylara Call Center agent');
