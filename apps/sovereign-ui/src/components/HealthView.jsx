import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Activity, ShieldCheck, Thermometer, Database, 
  AlertTriangle, RefreshCw, Download, Terminal, ChevronRight, 
  Send, BrainCircuit, Radio, Globe, ShieldAlert, Clock, BarChart3,
  Server, Lock, Unlock, Eye, Ghost, Crosshair
} from 'lucide-react';

export default function AICommandCenter() {
  // --- CORE STATES ---
  const [metrics, setMetrics] = useState({ cpu: 42, temp: 40, ram: 3.5, stability: 99.9 });
  const [threats, setThreats] = useState({ blocked: 2840, active: false, origin: "SECURE" });
  const [logs, setLogs] = useState([
    { id: 1, text: ">> SHIELD_OS KERNEL V4.0 ONLINE", type: 'success' },
    { id: 2, text: ">> NEURAL_LINK ESTABLISHED WITH NODE_09", type: 'info' }
  ]);
  const [command, setCommand] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [uptime, setUptime] = useState(0);
  const scrollRef = useRef(null);

  // --- DERIVED UI STATES ---
  const isDanger = metrics.cpu > 85 || metrics.temp > 62;

  // --- SYSTEM BRAIN (Logic-Driven Simulation) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(u => u + 1);
      
      setMetrics(prev => {
        const isSpiking = Math.random() > 0.96;
        const targetCpu = isOptimizing ? Math.max(30, prev.cpu - 15) : 
                         isSpiking ? 92 : Math.min(80, prev.cpu + (Math.random() * 10 - 5));

        return {
          cpu: Math.floor(targetCpu),
          temp: targetCpu > 80 ? prev.temp + 2 : prev.temp > 40 ? prev.temp - 0.5 : prev.temp,
          ram: parseFloat((3.5 + Math.random() * 0.5).toFixed(1)),
          stability: targetCpu > 90 ? (85 + Math.random() * 5).toFixed(1) : 99.9
        };
      });

      if (Math.random() > 0.85) {
        const locations = ["SHANGHAI_NET", "FRANKFURT_DC", "TOKYO_EDGE", "NEOM_CORE"];
        const isCriticalAttack = Math.random() > 0.9;
        
        setThreats(prev => ({
          blocked: prev.blocked + (isCriticalAttack ? 0 : 1),
          active: isCriticalAttack,
          origin: locations[Math.floor(Math.random() * locations.length)]
        }));

        if (isCriticalAttack) {
          addLog(`ALERT: Unauthorized access attempt from ${locations[0]}`, 'error');
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isOptimizing]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // --- ACTIONS & COMMANDS ---
  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), text: `[${new Date().toLocaleTimeString()}] ${text}`, type }]);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    const cmd = command.toLowerCase().trim();
    addLog(`CMD_INPUT: ${command}`, 'user');

    if (cmd === 'optimize' || cmd === 'fix') {
      setIsOptimizing(true);
      addLog("INITIATING RESOURCE REALLOCATION...", "info");
      setTimeout(() => { setIsOptimizing(false); addLog("SYSTEM STABLE. CACHE PURGED.", "success"); }, 4000);
    } else if (cmd === 'shield --off') {
      setIsShieldActive(false);
      addLog("WARNING: SECURITY SHIELD DEACTIVATED", "error");
    } else if (cmd === 'shield --on') {
      setIsShieldActive(true);
      addLog("SECURITY SHIELD ENGAGED", "success");
    } else if (cmd === 'clear') {
      setLogs([]);
    } else {
      addLog(`ERR: Unknown command '${cmd}'`, 'error');
    }
    setCommand("");
  };

  const downloadData = () => {
    const data = `SHIELD_OS_FORENSIC_DATA\nUptime: ${uptime}s\nThreats_Blocked: ${threats.blocked}\nIntegrity: ${metrics.stability}%`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = "system_dump.log"; a.click();
  };

  return (
    <div className={`min-h-screen p-4 lg:p-10 font-sans text-white transition-all duration-700 overflow-x-hidden ${isDanger ? 'bg-red-950/30' : 'bg-[#020202]'}`}>
      
      {/* ATTACK ANIMATION LAYER (Targeting System) */}
      {threats.active && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-red-500/40 animate-ping opacity-20"></div>
          <div className="absolute top-1/2 left-2/3 w-48 h-48 border border-red-500/40 animate-pulse opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.05)_50%)] bg-[length:100%_4px] animate-scan"></div>
          <div className="absolute top-10 right-10 flex flex-col items-end gap-2 text-red-500 font-mono text-xs">
            <div className="flex items-center gap-2"><Crosshair size={14} className="animate-spin" /> TRACING ATTACKER...</div>
            <div className="bg-red-500/20 px-2 py-1 border border-red-500/50">IP_ADDR: {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.X.X</div>
          </div>
        </div>
      )}

      {/* GLITCH OVERLAY */}
      {isDanger && <div className="fixed inset-0 pointer-events-none z-[999] opacity-20 animate-pulse bg-red-600/10 mix-blend-screen"></div>}

      <div className={`max-w-[1600px] mx-auto border-2 rounded-[4rem] p-6 lg:p-12 relative transition-all duration-500 shadow-2xl overflow-hidden ${isDanger ? 'border-red-600 shadow-red-900/40 animate-bounce-subtle' : 'border-blue-600/30 shadow-blue-900/20'}`}>
        
        {/* HUD HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b border-white/5 pb-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-[2.5rem] transition-all duration-700 shadow-2xl ${isDanger ? 'bg-red-600' : 'bg-blue-600'}`}>
              <BrainCircuit size={40} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                Shield_OS <span className={isDanger ? 'text-red-500' : 'text-blue-600'}>Alpha</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">
                  <Clock size={12} /> Uptime: {Math.floor(uptime/3600)}h {Math.floor((uptime%3600)/60)}m {uptime%60}s
                </span>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${isShieldActive ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                  {isShieldActive ? 'Shield: Active' : 'Shield: OFF'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <button onClick={downloadData} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                <Download size={20} className="text-slate-400" />
             </button>
             <button onClick={() => setIsOptimizing(true)} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isDanger ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isOptimizing ? 'Executing_Purge...' : 'Force_System_Fix'}
             </button>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT: MONITORING */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'NEURAL_LOAD', val: `${metrics.cpu}%`, icon: <Cpu />, col: isDanger ? 'text-red-500' : 'text-blue-500', bg: 'bg-blue-500/5' },
                 { label: 'CORE_TEMP', val: `${metrics.temp.toFixed(0)}°C`, icon: <Thermometer />, col: metrics.temp > 60 ? 'text-red-500' : 'text-orange-400', bg: 'bg-orange-500/5' },
                 { label: 'ACTIVE_THREATS', val: threats.active ? '1' : '0', icon: <Ghost />, col: threats.active ? 'text-red-500 animate-bounce' : 'text-emerald-500', bg: 'bg-emerald-500/5' },
                 { label: 'STABILITY', val: `${metrics.stability}%`, icon: <Activity />, col: 'text-purple-500', bg: 'bg-purple-500/5' }
               ].map((stat, i) => (
                 <div key={i} className={`${stat.bg} border border-white/5 p-7 rounded-[2.5rem] hover:border-white/20 transition-all group`}>
                    <div className={`${stat.col} mb-4 transition-transform group-hover:scale-125`}>{stat.icon}</div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-2xl font-black italic mt-1 ${stat.col}`}>{stat.val}</p>
                 </div>
               ))}
            </div>

            <div className="bg-[#080808] border border-white/5 rounded-[3.5rem] p-10 min-h-[450px] relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">
                    <BarChart3 size={16} className="text-blue-500" /> Neural Waveform Frequency
                  </h3>
                  <div className="flex gap-4">
                     <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                     <span className="text-[10px] font-mono text-slate-600 tracking-tighter">DATA_SYNC: 100%</span>
                  </div>
               </div>

               <div className="flex items-end gap-2 h-48 px-4">
                 {[...Array(35)].map((_, i) => (
                   <div 
                    key={i} 
                    className={`flex-1 rounded-t-lg transition-all duration-[1.5s] ease-in-out ${isDanger ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-blue-600/40'}`}
                    style={{ 
                      height: `${Math.floor(Math.random() * (isDanger ? 40 : 60)) + (isDanger ? 60 : 10)}%`,
                      opacity: (i / 35) + 0.3
                    }}
                   ></div>
                 ))}
               </div>

               <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-[2rem] border flex items-center gap-5 transition-all ${threats.active ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-white/5 border-white/5'}`}>
                     <Globe className={threats.active ? 'text-red-500' : 'text-blue-500'} size={32} />
                     <div>
                        <p className="text-[10px] font-black uppercase text-white tracking-widest">Global Threat Map</p>
                        <p className="text-[12px] font-mono text-slate-500">{threats.origin} :: BLOCKING_MODE</p>
                     </div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-5">
                     <ShieldCheck className="text-emerald-500" size={32} />
                     <div>
                        <p className="text-[10px] font-black uppercase text-white tracking-widest">Defenses Active</p>
                        <p className="text-[12px] font-mono text-slate-500">{threats.blocked.toLocaleString()} ATTEMPTS BLOCKED</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: TERMINAL */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#080808] border border-white/5 rounded-[3.5rem] p-8 flex-1 flex flex-col min-h-[600px] shadow-inner">
               <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={16} className="text-blue-600" /> Advanced_Terminal
                  </h4>
               </div>

               <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] pr-2 custom-scrollbar">
                 {logs.map((log) => (
                   <div key={log.id} className="flex gap-3 group animate-in slide-in-from-left duration-200">
                     <ChevronRight size={12} className={`mt-0.5 shrink-0 ${log.type === 'error' ? 'text-red-500' : 'text-blue-600'}`} />
                     <p className={`leading-relaxed ${
                       log.type === 'user' ? 'text-blue-400 font-bold' : 
                       log.type === 'success' ? 'text-emerald-400' : 
                       log.type === 'error' ? 'text-red-500 animate-pulse' : 'text-slate-500'
                     }`}>
                       {log.text}
                     </p>
                   </div>
                 ))}
                 {isOptimizing && (
                   <div className="flex items-center gap-2 text-blue-500 italic animate-pulse">
                     <RefreshCw size={10} className="animate-spin" />
                     <span>OPTIMIZING_NODE_INTEGRITY...</span>
                   </div>
                 )}
               </div>

               <form onSubmit={handleCommandSubmit} className="mt-8 relative group">
                  <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="ENTER OMEGA_PROTOCOL COMMAND..."
                    className="relative w-full bg-black border border-white/10 rounded-2xl py-5 pl-6 pr-14 text-[11px] font-mono text-white outline-none focus:border-blue-500 transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl active:scale-90">
                    <Send size={16} />
                  </button>
               </form>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6 group">
               <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center">
                  <Lock className="text-white" size={24} />
               </div>
               <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest italic">Security Clearance</p>
                  <p className="text-[9px] text-blue-500 font-black uppercase mt-1">Omega_Level_Admin</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
      `}} />
    </div>
  );
}