import React, { useState, useEffect } from 'react';
import { Video, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MoreVertical,
  ChevronRight,
  Plus,
  Search,
  AlertCircle, CircleCheck } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt1', patientName: 'John Doe', doctorName: 'Dr. Sarah Smith', time: '10:00 AM', date: '2026-03-27', type: 'consultation', status: 'upcoming' },
  { id: 'apt2', patientName: 'John Doe', doctorName: 'Dr. Mike Ross', time: '02:30 PM', date: '2026-03-28', type: 'follow-up', status: 'upcoming' },
  { id: 'apt3', patientName: 'John Doe', doctorName: 'Dr. Sarah Smith', time: '09:00 AM', date: '2026-03-20', type: 'consultation', status: 'completed', notes: 'Patient showing good progress on treatment plan.' },
];

export default function TeleHealthDashboard({ user }: { user: any }) {
  const [view, setView] = useState<'lobby' | 'call' | 'schedule'>('lobby');
  const [activeCall, setActiveCall] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleStartCall = (apt: Appointment) => {
    setActiveCall(apt);
    setView('call');
  };

  const handleEndCall = () => {
    setView('lobby');
    setActiveCall(null);
  };

  const renderLobby = () => (
    <div className="telehealth-lobby space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">TeleHealth Portal</h2>
          <p className="text-slate-500 mt-1">Manage your virtual consultations and medical records.</p>
        </div>
        <button 
          onClick={() => setView('schedule')}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a4731] text-white rounded-xl font-semibold hover:bg-[#235d41] transition-all shadow-lg hover:shadow-[#1a4731]/20 active:scale-95"
        >
          <Plus size={20} /> Schedule Consultation
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Next Appointment</div>
            <div className="text-lg font-bold text-slate-900">Tomorrow, 10:00 AM</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CircleCheck size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Completed</div>
            <div className="text-lg font-bold text-slate-900">12 Sessions</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Avg. Wait Time</div>
            <div className="text-lg font-bold text-slate-900">4 Minutes</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Upcoming Consultations</h3>
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'upcoming').map(apt => (
              <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#1a4731]/30 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#1a4731]/10 group-hover:text-[#1a4731] transition-colors">
                      <User size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{apt.doctorName}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock size={14} /> {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      apt.type === 'consultation' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {apt.type}
                    </span>
                    <button 
                      onClick={() => handleStartCall(apt)}
                      className="px-5 py-2.5 bg-[#1a4731] text-white rounded-lg font-bold text-sm hover:bg-[#235d41] transition-colors flex items-center gap-2"
                    >
                      <Video size={16} /> Join Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-10">Past Sessions</h3>
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'completed').map(apt => (
              <div key={apt.id} className="bg-white/60 p-5 rounded-2xl border border-dashed border-slate-200 opacity-80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CircleCheck className="text-green-500" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-700">{apt.doctorName}</h4>
                      <p className="text-sm text-slate-400">{apt.date} • {apt.type}</p>
                    </div>
                  </div>
                  <button className="text-[#1a4731] font-bold text-sm hover:underline">View Summary</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Health Tips / Recommendations */}
        <div className="space-y-6">
          <div className="bg-[#1a4731] text-white p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <h4 className="text-lg font-bold relative z-10">Prepare for your call</h4>
            <p className="text-white/80 text-sm mt-2 relative z-10">Ensure you are in a quiet room with good lighting and a stable internet connection.</p>
            <button className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold hover:bg-white/30 transition-all relative z-10">Check Equipment</button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 border-b pb-4 mb-4">Patient Guidelines</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-slate-600">
                <AlertCircle size={18} className="text-[#1a4731] shrink-0" />
                <span>Have your medical history and current prescriptions ready.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-600">
                <AlertCircle size={18} className="text-[#1a4731] shrink-0" />
                <span>Verify your identity using a state-issued ID.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-600">
                <AlertCircle size={18} className="text-[#1a4731] shrink-0" />
                <span>Sessions are recorded for regulatory compliance.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCall = () => (
    <div className="telehealth-call fixed inset-0 bg-slate-950 flex flex-col z-[100] animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="h-16 px-6 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg animate-pulse"></div>
          <div>
            <h4 className="text-white font-bold leading-none">{activeCall?.doctorName}</h4>
            <span className="text-white/50 text-xs mt-1 block">Live Consultation • Secure Channel</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/70">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-mono">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div> 00:14:23
           </div>
           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><MoreVertical size={20}/></button>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 relative p-6 flex gap-6 overflow-hidden">
        {/* Main Video (The Doctor/Provider) */}
        <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl border border-white/5 group">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center text-white/20 mb-4">
                   <User size={64}/>
                </div>
                <p className="text-slate-500 font-medium">Connecting to secure stream...</p>
              </div>
           </div>
           
           {/* Mock Video Feed Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-6 left-6 text-white">
                 <p className="font-bold">{activeCall?.doctorName}</p>
                 <p className="text-xs text-white/60">Primary Care Physician</p>
              </div>
           </div>
        </div>

        {/* Sidebar: Chat & Self View */}
        <div className="w-80 flex flex-col gap-6">
           {/* Self View */}
           <div className="aspect-video bg-slate-800 rounded-2xl relative overflow-hidden border border-white/10 shadow-xl">
              {isVideoOff ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <VideoOff className="text-white/20" size={32}/>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a4731]/20">
                   <User className="text-[#1a4731]/40" size={48}/>
                </div>
              )}
              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wider">You (Patient)</div>
           </div>

           {/* Chat Panel */}
           <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                 <h5 className="text-white font-bold text-sm">Session Chat</h5>
                 <MessageSquare size={16} className="text-white/40"/>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                 <div className="text-center py-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Secure connection established</p>
                 </div>
                 <div className="flex flex-col gap-1 items-start">
                    <span className="text-[10px] text-white/40 ml-1">Dr. Smith • 10:14 AM</span>
                    <div className="px-3 py-2 bg-white/10 text-white text-sm rounded-2xl rounded-tl-none">Hello John, how are you feeling today?</div>
                 </div>
              </div>
              <div className="p-4 pt-0">
                 <div className="bg-white/10 rounded-xl p-2 flex gap-2">
                    <input type="text" placeholder="Type a message..." className="bg-transparent border-none focus:ring-0 text-white text-sm flex-1 placeholder:text-white/20" />
                    <button className="p-1.5 bg-[#1a4731] text-white rounded-lg hover:bg-[#235d41] transition-colors">
                       <ChevronRight size={18}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-24 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-4">
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-white/5 text-white hover:bg-white/10'}`}
         >
           {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
         </button>
         <button 
           onClick={() => setIsVideoOff(!isVideoOff)}
           className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-white/5 text-white hover:bg-white/10'}`}
         >
           {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
         </button>
         <button 
           onClick={() => setIsScreenSharing(!isScreenSharing)}
           className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? 'bg-[#1a4731] text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
         >
           <Monitor size={24}/>
         </button>
         <div className="w-10"></div>
         <button 
           onClick={handleEndCall}
           className="px-8 h-14 bg-red-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
         >
            <PhoneOff size={24}/> Leave Session
         </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="telehealth-schedule animate-in fade-in slide-in-from-right-4 duration-500">
       <button onClick={() => setView('lobby')} className="text-[#1a4731] font-bold flex items-center gap-1 mb-6 hover:translate-x-[-4px] transition-transform">
          <ChevronRight className="rotate-180" size={18}/> Back to Lobby
       </button>
       
       <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[#1a4731] p-8 text-white">
             <h3 className="text-2xl font-bold">Schedule New Consultation</h3>
             <p className="text-white/70 mt-1">Select a physician and a time slot for your HIPAA-compliant virtual call.</p>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Select State Regulation</label>
                   <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a4731]/20 outline-none">
                      <option>Kansas (General Care)</option>
                      <option>Missouri (Medical Cannabis Rec)</option>
                      <option>Colorado (Advanced Health)</option>
                   </select>
                </div>
                
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Available Physicians</label>
                   <div className="space-y-3">
                      {['Dr. Sarah Smith', 'Dr. Mike Ross', 'Dr. Elena Vance'].map(doc => (
                        <div key={doc} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-[#1a4731] cursor-pointer group transition-all">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#1a4731]">{doc.split(' ')[1].charAt(0)}</div>
                              <span className="font-bold text-slate-700">{doc}</span>
                           </div>
                           <div className="w-5 h-5 border-2 border-slate-200 rounded-full group-hover:border-[#1a4731] group-hover:bg-[#1a4731]/10 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-[#1a4731] rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
                   <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a4731]/20 outline-none" defaultValue="2026-03-27" />
                </div>
                
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Available Slots</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['09:00', '10:00', '11:30', '02:00', '03:30', '04:15'].map(time => (
                        <button key={time} className="py-2.5 px-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-[#1a4731] hover:text-[#1a4731] transition-all">{time} AM</button>
                      ))}
                   </div>
                </div>
                
                <button 
                  onClick={() => {
                    const newApt: Appointment = {
                      id: `apt-${Date.now()}`,
                      patientName: 'John Doe',
                      doctorName: 'Dr. Sarah Smith',
                      time: '11:00 AM',
                      date: '2026-03-27',
                      type: 'consultation',
                      status: 'upcoming'
                    };
                    setAppointments(prev => [...prev, newApt]);
                    setView('lobby');
                  }}
                  className="w-full py-4 bg-[#1a4731] text-white rounded-xl font-bold mt-4 hover:bg-[#235d41] transition-all shadow-lg active:scale-95"
                >
                   Confirm Appointment
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {view === 'lobby' && renderLobby()}
      {view === 'call' && renderCall()}
      {view === 'schedule' && renderSchedule()}
    </div>
  );
}
