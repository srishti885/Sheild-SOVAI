import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Path check kar lena apne folder ke hisaab se
import { ref, onValue, update, remove } from "firebase/database";
import { Shield, UserCheck, UserX, LogOut, Activity, Clock, Zap, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminCommand() {
  const [requests, setRequests] = useState([]);
  const [systemOnline, setSystemOnline] = useState(false);
  const navigate = useNavigate();
  const adminName = "SRISHTI GOENKA";

  // Real-time Database Listener
  useEffect(() => {
    setSystemOnline(true);
    const requestsRef = ref(db, 'access_requests');
    
    // Ye function Firebase se data aate hi UI update kar dega
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Latest requests upar dikhane ke liye reverse kiya hai
        setRequests(list.reverse());
      } else {
        setRequests([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Approve ya Reject karne ka function
  const handleAction = async (userId, action) => {
    try {
      if (action === 'approve') {
        await update(ref(db, `access_requests/${userId}`), { 
          status: 'APPROVED',
          approvedAt: new Date().toISOString()
        });
        speak("Access Authorized.");
      } else {
        await remove(ref(db, `access_requests/${userId}`));
        speak("Entity purged.");
      }
    } catch (error) {
      console.error("Action Failed:", error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#00040a] text-white font-sans p-4 md:p-10 relative overflow-hidden">
      
      {/* GLOWING AMBIENCE */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>

      {/* TOP COMMAND BAR */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-6 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase tracking-[0.1em]">
              SOV<span className="text-blue-500">AI</span>_COMMAND_CENTER
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Admin: <span className="text-blue-400">{adminName}</span> | Session: Active
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-3 bg-red-500/10 text-red-500 px-6 py-3 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-[10px] tracking-[0.3em]"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> TERMINATE_COMMAND
        </button>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SECTION: LIVE FEED & REQUESTS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black tracking-[0.4em] text-blue-400 flex items-center gap-3">
              <Zap size={16} /> PENDING_AUTHORIZATIONS [{requests.length}]
            </h2>
          </div>

          {requests.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-md">
              <Monitor size={48} className="text-slate-800 mb-4" />
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">No active intrusion or access requests detected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((req) => (
                <div key={req.id} className="bg-slate-900/40 border border-white/10 p-5 rounded-[2.5rem] backdrop-blur-3xl hover:border-blue-500/50 transition-all group overflow-hidden relative">
                  
                  {/* REQUEST CARD CONTENT */}
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-5 border border-white/5">
                    <img src={req.photo} alt="Identity" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                      <Clock size={10} className="text-blue-400" />
                      <span className="text-[9px] font-mono">{new Date(req.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="px-2 mb-6">
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">{req.name}</h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">System_Status: <span className="text-yellow-500 uppercase">{req.status}</span></p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(req.id, 'approve')}
                      className="flex-1 bg-green-500 text-black font-black text-[9px] tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
                    >
                      <UserCheck size={16} /> GRANT
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'reject')}
                      className="flex-1 bg-white/5 border border-white/10 text-red-500 font-black text-[9px] tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <UserX size={16} /> PURGE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SECTION: SYSTEM STATS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-8 rounded-[3rem] backdrop-blur-xl">
            <h3 className="text-[10px] font-black tracking-[0.5em] text-blue-400 mb-8 uppercase flex items-center gap-2">
              <Activity size={16} /> Core_Metrics
            </h3>
            
            <div className="space-y-6">
              <StatRow label="Database Sync" value="REALTIME_OK" />
              <StatRow label="Neural Link" value="ENCRYPTED" />
              <StatRow label="Hardware" value="FINGERPRINT_READY" />
              <StatRow label="Admin Clear" value="LEVEL_MAX" />
            </div>

            <div className="mt-10 p-5 bg-black/40 rounded-3xl border border-white/5 font-mono">
              <p className="text-[8px] text-slate-600 mb-2 tracking-widest uppercase font-bold">Terminal_Output:</p>
              <p className="text-[10px] text-blue-300 italic leading-relaxed">
                "Welcome {adminName}. All satellite nodes are operational. No security leaks detected in current cluster."
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-3">
      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-bold text-white tracking-tighter">{value}</span>
    </div>
  );
}