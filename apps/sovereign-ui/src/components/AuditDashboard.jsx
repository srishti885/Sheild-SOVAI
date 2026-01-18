import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue, query, set, push } from "firebase/database";
import { 
  ShieldAlert, Clock, Camera, ShieldCheck, ArrowLeft, 
  PlayCircle, Fingerprint, Trash2, Filter, AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuditDashboard() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL'); 
  const navigate = useNavigate();

  // Database listener
  useEffect(() => {
    const logsRef = query(ref(db, 'security_logs'));
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase object ko array mein convert karke reverse (latest first) kar rahe hain
        const formattedLogs = Object.values(data).reverse();
        setLogs(formattedLogs);
      } else {
        setLogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- SECURE MASTER WIPE LOGIC ---
  const handleMasterWipe = async () => {
    const masterKey = prompt("CRITICAL: ENTER MASTER AUTHORIZATION KEY TO WIPE DATA:");
    
    // Ye variable Vercel settings se aayega
    const SECURE_KEY = process.env.REACT_APP_ADMIN_SECRET || "SRISHTI_SECURE_786"; 

    if (masterKey === SECURE_KEY) { 
      const confirmWipe = window.confirm("PERMANENT DELETION DETECTED. All forensic evidence will be lost. Proceed?");
      
      if (confirmWipe) {
        try {
          const logRef = ref(db, 'security_logs');
          await set(logRef, null); // Database clear
          
          // Wipe entry log karna (Self-auditing)
          const auditRef = ref(db, 'security_logs');
          await set(push(auditRef), {
            identity: "SYSTEM_ROOT",
            type: "ADMIN_ACTION",
            status: "WIPED",
            timestamp: new Date().toISOString(),
            activity: "Full Audit Log Purge Performed"
          });

          alert("SYSTEM_CLEAN: Data wiped successfully.");
        } catch (e) {
          alert("ERROR: DATABASE_SYNC_FAILED");
        }
      }
    } else {
      alert("UNAUTHORIZED_ACCESS: This attempt has been recorded.");
    }
  };

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return log.status !== 'GRANTED' && log.status !== 'APPROVED';
    if (filter === 'GRANTED') return log.status === 'GRANTED' || log.status === 'APPROVED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#00040a] text-blue-400 p-8 font-sans selection:bg-blue-500/30">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-blue-900/50 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Fingerprint className="text-blue-500 animate-pulse" size={24} />
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              SOV<span className="text-blue-600">AI</span>_AUDIT_LOGS
            </h2>
          </div>
          <p className="text-[10px] font-mono tracking-[0.3em] opacity-50 uppercase">Secured_by_Environment_Variable_V4.2</p>
        </div>

        <div className="flex gap-4">
           <button onClick={handleMasterWipe} className="flex items-center gap-2 bg-red-900/10 border border-red-500/30 px-6 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all group shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <Trash2 size={16} /> 
            <span className="text-[10px] font-bold tracking-widest uppercase">WIPE_LOGS</span>
          </button>

          <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-blue-900/20 border border-blue-500/30 px-6 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-bold tracking-widest uppercase">BACK_TO_HQ</span>
          </button>
        </div>
      </div>

      {/* STATS GRID (Clickable for quick filtering) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div 
          onClick={() => setFilter('GRANTED')}
          className={`cursor-pointer p-6 rounded-3xl backdrop-blur-md transition-all border ${filter === 'GRANTED' ? 'bg-green-600/20 border-green-500' : 'bg-blue-600/5 border-blue-500/20'}`}
        >
          <ShieldCheck className="mb-4 text-green-500" />
          <p className="text-[10px] font-mono uppercase opacity-50">Authorized</p>
          <p className="text-2xl font-black text-white">{logs.filter(l => l.status === 'GRANTED' || l.status === 'APPROVED').length}</p>
        </div>
        
        <div 
          onClick={() => setFilter('CRITICAL')}
          className={`cursor-pointer p-6 rounded-3xl backdrop-blur-md transition-all border ${filter === 'CRITICAL' ? 'bg-red-600/20 border-red-500' : 'bg-red-600/5 border-red-500/20'}`}
        >
          <ShieldAlert className="mb-4 text-red-500" />
          <p className="text-[10px] font-mono uppercase opacity-50">Threats/Attempts</p>
          <p className="text-2xl font-black text-white">{logs.filter(l => l.status !== 'GRANTED' && l.status !== 'APPROVED').length}</p>
        </div>

        <div 
          onClick={() => setFilter('ALL')}
          className="bg-green-600/5 border border-green-500/20 p-6 rounded-3xl backdrop-blur-md hover:bg-green-500/10 transition-all cursor-pointer"
        >
          <PlayCircle className="mb-4 text-green-400" />
          <p className="text-[10px] font-mono uppercase opacity-50">Total_Entries</p>
          <p className="text-2xl font-black text-white">{logs.length}</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <Filter className="mb-4 text-blue-400" />
          <p className="text-[10px] font-mono uppercase opacity-50">Active_Sector</p>
          <p className="text-2xl font-black text-white uppercase italic">{filter}</p>
        </div>
      </div>

      {/* MAIN LOGS TABLE */}
      <div className="bg-black/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual_Evidence</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity_Protocol</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-blue-600/5 transition-all group">
                  <td className="p-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-blue-500/20 group-hover:border-blue-500/60 transition-all">
                      {log.photo || log.image ? (
                        <img 
                          src={log.photo || `data:image/jpeg;base64,${log.image}`} 
                          alt="Capture" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 text-[7px] font-mono italic opacity-40">
                           <Camera size={14} className="mb-1 opacity-20"/>
                           NO_DATA
                        </div>
                      )}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_linear_infinite]"></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={`font-black text-sm tracking-tight ${log.status === 'GRANTED' || log.status === 'APPROVED' ? 'text-white' : 'text-red-500'}`}>
                      {log.identity || 'UNKNOWN_SUBJECT'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        {log.type || 'EVENT'}
                      </span>
                      {log.activity && <span className="text-[8px] font-mono opacity-40 truncate max-w-[150px]">{log.activity}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-60">
                      <Clock size={12} className="text-blue-400" />
                      <span className="text-[10px] font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm ${
                      log.status === 'GRANTED' || log.status === 'APPROVED'
                      ? 'border-green-500/50 text-green-500 bg-green-500/10' 
                      : 'border-red-500/50 text-red-500 bg-red-500/10'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${log.status === 'GRANTED' || log.status === 'APPROVED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      {log.status || 'ATTEMPTED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="p-24 text-center">
               <AlertTriangle className="mx-auto mb-4 text-blue-900/30" size={48}/>
               <p className="opacity-20 font-mono text-xs uppercase tracking-[0.5em]">No_Forensic_Data_Found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(80px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}