import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Zap, Cpu, Globe, AlertTriangle, Power, Loader2, Terminal as TerminalIcon, X, ChevronRight, Download, Wifi, WifiOff, BarChart3, ShieldAlert, Database } from 'lucide-react';

export default function DashboardView() {
  const [stats, setStats] = useState({
    neural_load: 0,
    active_nodes: 0,
    integrity: 99.9,
    uptime: "00:00:00"
  });
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([{ text: "SHIELDAI_PRO_v5.0_STABLE_LOADED", type: "sys" }]);
  const termScrollRef = useRef(null);

  // --- LOGIC: THREAT DETECTION ---
  const isLockdown = logs.some(log => 
    log.threatsDetected?.some(t => 
      t.toLowerCase().includes('smartphone') || t.toLowerCase().includes('threat') || t.toLowerCase().includes('breach') || t.toLowerCase().includes('attack')
    )
  );

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'THREATS') return log.threatsDetected && log.threatsDetected.length > 0;
    if (logFilter === 'SYSTEM') return !log.threatsDetected || log.threatsDetected.length === 0;
    return true;
  });

  // --- EXPORT LOGIC ---
  const exportForensicReport = () => {
    const reportHeader = `--- SHIELD AI FORENSIC ANALYSIS REPORT ---\nGenerated: ${new Date().toISOString()}\nStatus: ${isLockdown ? 'CRITICAL' : 'STABLE'}\n------------------------------------------\n\n`;
    const reportData = logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] [SOURCE: ${l.source}] -> ${l.threatsDetected?.join(', ') || 'NOMINAL_ACTIVITY'}`).join('\n');
    const blob = new Blob([reportHeader + reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShieldAI_Report_${Date.now()}.log`;
    a.click();
  };

  // --- TERMINAL HANDLER ---
  const handleTerminalCmd = async (e) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      const cmd = terminalInput.trim();
      setTerminalHistory(prev => [...prev, { text: `admin@shieldai:~# ${cmd}`, type: "user" }]);
      setTerminalInput('');
      try {
        const res = await fetch('http://localhost:5000/api/v1/terminal-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cmd })
        });
        const data = await res.json();
        setTerminalHistory(prev => [...prev, { text: `[SYSTEM_OUT]: ${data.output}`, type: "resp" }]);
      } catch (err) {
        setTerminalHistory(prev => [...prev, { text: "ERR_EXECUTION: Core link unavailable. Running in local sandbox.", type: "err" }]);
      }
    }
  };

  useEffect(() => {
    if (termScrollRef.current) termScrollRef.current.scrollTop = termScrollRef.current.scrollHeight;
  }, [terminalHistory]);

  const handleFinalReset = async () => {
    setShowConfirm(false);
    setIsResetting(true); 
    try {
      await fetch('http://localhost:5000/api/v1/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'SYSTEM_PURGE', timestamp: new Date().toISOString() })
      });
    } catch (err) { console.error("Reset signal failed"); }
    setTimeout(() => window.location.reload(), 2500);
  };

  // --- DATA ENGINE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:5000/api/v1/sys-stats');
        const statsData = await statsRes.json();
        setIsConnected(true);
        setStats({
          neural_load: statsData?.neural_load || Math.floor(Math.random() * 40 + 20),
          active_nodes: statsData?.active_nodes || 124,
          integrity: statsData?.integrity_score || 99.9,
          uptime: statsData?.uptime_seconds ? new Date(statsData.uptime_seconds * 1000).toISOString().substr(11, 8) : stats.uptime
        });

        const logsRes = await fetch('http://localhost:5000/api/v1/logs');
        const logsData = await logsRes.json();
        setLogs(Array.isArray(logsData) ? logsData.slice(0, 12) : []);
      } catch (err) {
        setIsConnected(false);
        const productMocks = [
          { source: "FIREWALL_v4", threatsDetected: ["Brute Force Attempt: 192.168.1.45"], timestamp: new Date() },
          { source: "NEURAL_NODE", threatsDetected: [], timestamp: new Date() },
          { source: "GATEWAY_ALPHA", threatsDetected: ["Packet Sniffing Detected in Sector 4"], timestamp: new Date() },
          { source: "CORE_DB", threatsDetected: [], timestamp: new Date() }
        ];
        setLogs(prev => [productMocks[Math.floor(Math.random() * 4)], ...prev].slice(0, 12));
        setStats(prev => ({ ...prev, neural_load: Math.floor(Math.random() * 20 + 40) }));
      }
    };

    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen p-6 relative transition-all duration-1000 ${isLockdown ? 'bg-red-950/20 animate-pulse-emergency' : 'bg-[#030303]'} text-white font-sans overflow-x-hidden`}>
      {/* Background Grid Layer */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Status Bar */}
      <div className="fixed top-6 right-8 z-[100] flex gap-4">
        <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-red-500 animate-pulse shadow-[0_0_12px_#ef4444]'}`}></div>
           <span className="text-[9px] font-black tracking-[0.2em] uppercase">{isConnected ? 'Link_Online' : 'Fail_Safe_Mode'}</span>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showTerminal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowTerminal(false)}></div>
          <div className="relative bg-[#020617] border-2 border-blue-500/30 w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-blue-500/5">
              <div className="flex items-center gap-3 text-blue-400">
                <TerminalIcon size={18} />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">Sovereign_Root_Console_v5.0</span>
              </div>
              <button onClick={() => setShowTerminal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div ref={termScrollRef} className="h-[550px] overflow-y-auto p-10 font-mono text-[13px] space-y-3 custom-scrollbar bg-black/40">
              {terminalHistory.map((h, i) => (
                <div key={i} className={`${h.type === 'user' ? 'text-emerald-400' : h.type === 'err' ? 'text-red-500 font-bold' : h.type === 'resp' ? 'text-blue-400' : 'text-slate-500 italic'}`}>
                  {h.text}
                </div>
              ))}
            </div>
            <div className="p-8 bg-[#010409] flex items-center gap-4 border-t border-white/5">
              <ChevronRight size={20} className="text-blue-500" />
              <input autoFocus className="bg-transparent border-none outline-none w-full text-white font-mono text-base uppercase tracking-[0.2em] placeholder:text-slate-800" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} onKeyDown={handleTerminalCmd} placeholder="ENTER_SYSTEM_COMMAND..." />
            </div>
          </div>
        </div>
      )}

      {isResetting && (
        <div className="fixed inset-0 z-[6000] bg-black/98 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-blue-600/20 animate-pulse"></div>
                <Loader2 size={100} className="text-blue-500 animate-spin relative" />
            </div>
            <h2 className="mt-10 text-2xl font-black italic tracking-[1.2em] animate-pulse uppercase text-white">System_Purging</h2>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#020617] border-2 border-red-500/50 p-16 rounded-[4rem] max-w-xl w-full text-center shadow-[0_0_100px_rgba(239,68,68,0.2)] animate-in zoom-in">
            <ShieldAlert size={80} className="text-red-500 mx-auto mb-8 animate-bounce" />
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Critical Override</h3>
            <p className="text-slate-500 text-xs tracking-widest uppercase mb-10">This will initiate a full neural flush and reset all active security nodes.</p>
            <div className="flex gap-6">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Cancel_Abort</button>
              <button onClick={handleFinalReset} className="flex-1 py-5 rounded-2xl bg-red-600 font-black uppercase text-[10px] tracking-widest shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-105 transition-all">Confirm_Purge</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className={`p-12 rounded-[4rem] border flex justify-between items-center transition-all duration-700 ${isLockdown ? 'bg-red-950/40 border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.2)]' : 'bg-white/[0.02] border-white/10 shadow-2xl'}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className={`px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isLockdown ? 'bg-red-600' : 'bg-blue-600'}`}>Security_Core_v5</div>
               <span className="text-slate-600 font-mono text-[10px] tracking-widest uppercase italic">Node_Status: {isConnected ? 'Synchronized' : 'Standalone'}</span>
            </div>
            <h2 className={`text-7xl font-black italic tracking-tighter uppercase leading-none ${isLockdown ? 'text-red-500 animate-glitch' : 'text-white'}`}>
              {isLockdown ? 'BREACH_DETECTED' : 'SYSTEM_ENCRYPTED'}
            </h2>
            <div className="flex gap-8 items-center pt-2">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active_Uptime</span>
                  <span className="text-xl font-mono font-bold text-blue-500">{stats.uptime}</span>
               </div>
               <button onClick={() => setShowTerminal(true)} className="group flex items-center gap-3 bg-blue-600/5 border border-blue-500/20 px-6 py-3 rounded-2xl text-blue-500 text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-500/20">
                 <TerminalIcon size={16} /> Access_System_Root
               </button>
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)} className={`flex items-center gap-4 px-12 py-8 rounded-[2rem] font-black tracking-[0.2em] uppercase italic text-[12px] transition-all group ${isLockdown ? 'bg-red-600 hover:bg-white hover:text-red-600 animate-pulse shadow-2xl' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>
            <Power className="group-hover:rotate-90 transition-transform duration-500" size={24} /> Force_Reboot
          </button>
        </header>

        {/* Stats Grid - Full Expansion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Card 1: Integrity */}
           <div className={`relative overflow-hidden p-10 rounded-[3.5rem] border transition-all duration-500 group ${isLockdown ? 'bg-red-950/20 border-red-500' : 'bg-white/[0.02] border-white/5 hover:border-blue-500/40 shadow-xl'}`}>
              <div className="scanner-line"></div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-[11px] font-black text-slate-500 tracking-[0.4em] uppercase">Core_Integrity</p>
                <ShieldCheck size={20} className={isLockdown ? 'text-red-500' : 'text-blue-500'} />
              </div>
              <div className="flex items-baseline gap-3 text-8xl font-black italic text-white group-hover:scale-105 transition-transform">
                <span className={isLockdown ? 'text-red-500' : ''}>{isLockdown ? 'LOW' : stats.integrity}</span>
                <span className="text-blue-500 text-2xl font-bold font-mono">%</span>
              </div>
              <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isLockdown ? 'bg-red-600 w-[15%]' : 'bg-blue-600 w-[99.9%]'}`}></div>
              </div>
           </div>

           {/* Card 2: Neural Load */}
           <div className="relative overflow-hidden p-10 rounded-[3.5rem] border bg-white/[0.02] border-white/5 hover:border-blue-500/40 shadow-xl group transition-all duration-500">
              <div className="scanner-line"></div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-[11px] font-black text-slate-500 tracking-[0.4em] uppercase">Neural_Processing</p>
                <Cpu size={20} className="text-blue-500 group-hover:rotate-180 transition-transform duration-1000" />
              </div>
              <div className="flex items-baseline gap-3 text-8xl font-black italic text-white group-hover:text-blue-500 transition-all">
                <span>{stats.neural_load}</span>
                <span className="text-slate-600 text-2xl font-bold font-mono">%</span>
              </div>
              <div className="mt-8 flex gap-1 h-8 items-end">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${i/12 * 100 < stats.neural_load ? 'bg-blue-600' : 'bg-white/5'}`} style={{ height: `${Math.random() * 100}%` }}></div>
                ))}
              </div>
           </div>

           {/* Card 3: Global Nodes */}
           <div className="relative overflow-hidden p-10 rounded-[3.5rem] border bg-white/[0.02] border-white/5 hover:border-blue-500/40 shadow-xl group transition-all duration-500">
              <div className="scanner-line"></div>
              <div className="flex justify-between items-start mb-6">
                <p className="text-[11px] font-black text-slate-500 tracking-[0.4em] uppercase">Global_Nodes</p>
                <Globe size={20} className="text-blue-500 animate-[spin_8s_linear_infinite]" />
              </div>
              <div className="flex items-baseline gap-3 text-8xl font-black italic text-white group-hover:text-blue-500 transition-all">
                <span>{stats.active_nodes}</span>
                <span className="text-blue-500 text-3xl font-black italic">ACT</span>
              </div>
              <div className="mt-8 flex items-center gap-4 text-[10px] font-bold tracking-tighter text-slate-500">
                 <div className="flex-1 border-t border-white/10"></div>
                 <span className="uppercase">Satellite_Uplink_Active</span>
                 <div className="flex-1 border-t border-white/10"></div>
              </div>
           </div>
        </div>

        {/* Telemetry Section - Product Level */}
        <div className={`p-12 rounded-[4rem] border transition-all h-[550px] flex flex-col shadow-2xl overflow-hidden ${isLockdown ? 'border-red-500/40 bg-red-950/10' : 'bg-[#050505] border-white/5'}`}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em] flex items-center gap-4">
                <Activity size={20} className={isLockdown ? 'text-red-500 animate-pulse' : 'text-blue-500'} /> Forensic_Intelligence_Feed
              </h3>
              <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase">Real-time threat monitoring and packet analysis</p>
            </div>
            
            <div className="flex gap-6">
               <button onClick={exportForensicReport} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10 hover:bg-emerald-400 hover:text-black transition-all">
                 <Download size={16} /> Generate_Report
               </button>
               <div className="flex gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                 {['ALL', 'THREATS', 'SYSTEM'].map(f => (
                   <button key={f} onClick={() => setLogFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${logFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}>{f}</button>
                 ))}
               </div>
            </div>
          </div>

          <div className="flex-1 font-mono text-[13px] space-y-5 overflow-y-auto pr-8 custom-scrollbar">
            {logs.length > 0 ? filteredLogs.map((log, i) => (
              <div key={i} className={`group pb-5 border-b border-white/5 flex justify-between items-start animate-in slide-in-from-bottom duration-500 delay-${i*100}`}>
                <div className="flex gap-8">
                  <div className={`px-3 py-1 rounded bg-white/5 text-[10px] font-bold ${log.threatsDetected?.[0] ? 'text-red-500' : 'text-blue-500'}`}>0x{Math.floor(Math.random()*999)}</div>
                  <div className="flex flex-col">
                    <span className={`${log.threatsDetected?.[0] ? 'text-red-500 font-black' : 'text-blue-400'} uppercase tracking-widest`}>[{log.source}]</span>
                    <span className={`text-[11px] mt-1 ${log.threatsDetected?.[0] ? 'text-red-200 animate-pulse' : 'text-slate-500'}`}>
                      {log.threatsDetected?.[0] || 'DATA_FLOW_STABLE: Monitoring packets for anomalies...'}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <span className="text-[11px] text-slate-700 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   <span className="text-[9px] text-slate-800 uppercase mt-1">Status: OK</span>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                 <Loader2 className="text-slate-800 animate-spin" size={40} />
                 <span className="text-slate-700 italic text-xs tracking-[1em] uppercase">Syncing_Neural_Caches</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        
        .scanner-line { 
          position: absolute; top: -100%; left: 0; width: 100%; height: 100%; 
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent); 
          animation: scan 5s linear infinite; pointer-events: none; 
        }

        @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
        @keyframes pulse-emergency { 0%, 100% { background-color: rgba(3,3,3,1); } 50% { background-color: rgba(60, 0, 0, 0.3); } }
        .animate-pulse-emergency { animation: pulse-emergency 3s infinite; }
        
        .animate-glitch { animation: glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite; }
        @keyframes glitch {
          0% { transform: translate(0) }
          25% { transform: translate(-2px, 2px) skew(2deg) }
          50% { transform: translate(2px, -2px) skew(-2deg) }
          75% { transform: translate(-1px, -1px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
}