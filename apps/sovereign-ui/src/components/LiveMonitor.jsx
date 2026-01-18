import React, { useState, useEffect } from 'react';
import { Target, ShieldCheck, Activity, Maximize2, Zap, Radio, AlertCircle, Github, Twitter, Linkedin, Globe, Terminal, Cpu, Database, Power, X } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  upgrade: false
});

export default function LiveMonitor({ liveFrame }) {
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false); // Terminal State
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ fps: 31.42, latency: 12 });
  const [scanProgress, setScanProgress] = useState(0);

  // --- NEW STATES FOR INTERACTIVE TYPING ---
  const [commandValue, setCommandValue] = useState('');
  const [history, setHistory] = useState([]);

  const isLockdown = alerts.some(a => a.message?.toLowerCase().includes('phone') || a.message?.toLowerCase().includes('breach'));

  // --- NEW: STOP LOGIC (Sirf ye function update kiya gaya hai) ---
  const handleStopVision = async () => {
    try {
      await fetch('http://localhost:5000/api/v1/toggle-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: false })
      });
      setIsVisionActive(false);
    } catch (err) {
      console.error("Failed to stop engine:", err);
    }
  };

  // --- UPDATED: HANDLE COMMAND SUBMISSION (BACKEND INTEGRATED) ---
  const submitCommand = async (e) => {
    if (e.key === 'Enter' && commandValue.trim()) {
      const userCmd = commandValue.trim();
      setHistory(prev => [...prev, `> ${userCmd}`]);
      setCommandValue('');

      if (userCmd.toLowerCase() === 'clear') {
        setHistory([]);
        return;
      }

      try {
        // Sending command to backend
        const response = await fetch('http://localhost:5000/api/v1/terminal-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: userCmd })
        });
        const data = await response.json();
        setHistory(prev => [...prev, data.output || `[SYSTEM]: Command executed.`]);
      } catch (err) {
        setHistory(prev => [...prev, `[ERROR]: Failed to reach Vision Core.`]);
      }
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/vision-status')
      .then(res => res.json())
      .then(data => setIsVisionActive(data.active));

    socket.on('security-alert', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev].slice(0, 3));
    });

    const interval = setInterval(() => {
      setStats({
        fps: (29 + Math.random() * 4).toFixed(2),
        latency: Math.floor(Math.random() * 5) + 10
      });
      setScanProgress(prev => (prev + 1) % 100);
    }, 2000);

    return () => {
      socket.off('security-alert');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative space-y-6 animate-in fade-in duration-1000 pb-32 select-none">
      
      {/* --- TERMINAL OVERLAY (Logic + Real Typing Effect) --- */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-10 animate-in zoom-in duration-300">
          <div className="w-full max-w-4xl h-[500px] bg-[#050505] border border-green-500/30 rounded-lg flex flex-col shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            <div className="flex justify-between items-center p-3 border-b border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-green-500" />
                <span className="text-[10px] font-mono text-green-500/80 uppercase tracking-widest">Shield_AI_Secure_Terminal_v4.2</span>
              </div>
              <button onClick={() => setIsTerminalOpen(false)} className="hover:bg-red-500/20 p-1.5 rounded-md transition-all group">
                <X size={16} className="text-green-500/50 group-hover:text-red-500" />
              </button>
            </div>
            <div className="p-6 font-mono text-[12px] text-green-500 overflow-y-auto custom-scrollbar leading-relaxed flex-1">
              <div className="space-y-1">
                <p className="opacity-50 animate-[pulse_2s_infinite]">[SYSTEM] Root access granted...</p>
                
                {/* Fixed Background Text */}
                <p className="text-blue-400 mt-4 font-black"> SHIELD_AI_KERNEL_INITIALIZED</p>
                <p className="text-green-800 uppercase text-[9px] mt-2">Uplink Status: ENCRYPTED_AES_256</p>
                <p className="text-green-500 mt-4">$ sudo python3 main_vision_core.py</p>
                <p className="text-yellow-500 italic mt-2"> Scanning environment for anomalies...</p>
                <p className="text-green-300"> Vision core: READY</p>
                
                {/* --- INTERACTIVE HISTORY AREA --- */}
                {history.map((h, i) => (
                  <p key={i} className="text-white/80">{h}</p>
                ))}

                {/* --- REAL TYPING INPUT --- */}
                <div className="mt-6 flex gap-2 border-t border-green-500/10 pt-4 items-center">
                  <span className="text-green-500 font-bold">$</span>
                  <input 
                    autoFocus
                    type="text"
                    className="bg-transparent border-none outline-none text-white w-full font-mono focus:ring-0 p-0"
                    value={commandValue}
                    onChange={(e) => setCommandValue(e.target.value)}
                    onKeyDown={submitCommand}
                    placeholder="enter command..."
                  />
                  <span className="bg-green-500 w-2 h-4 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP STATUS BAR --- */}
      <div className={`flex justify-between items-center p-4 rounded-3xl border backdrop-blur-md transition-all duration-700 ${isLockdown ? 'bg-red-600/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/[0.02] border-white/10'}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Radio className={`${isLockdown ? 'text-red-500' : 'text-blue-500'} animate-pulse`} size={20} />
            <div className={`absolute inset-0 blur-lg ${isLockdown ? 'bg-red-500' : 'bg-blue-500'} opacity-30`}></div>
          </div>
          <div>
            <h2 className={`text-[11px] font-black tracking-[0.3em] uppercase italic ${isLockdown ? 'text-red-500' : 'text-white'}`}>
                {isLockdown ? 'CRITICAL_BREACH_DETECTED' : 'Neural_Sovereign_Monitor_v4.2'}
            </h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Auth_Token: 882-X92-GLOBAL</p>
          </div>
        </div>
        <div className="flex gap-6 items-center pr-4">
            <div className="h-8 w-px bg-white/10"></div>
            <div className="text-right">
                <p className="text-[8px] text-slate-500 font-black uppercase">Uplink_Speed</p>
                <p className="text-[10px] font-mono text-green-500 font-bold">1.2 GBPS</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- MAIN MONITOR AREA --- */}
        <div className={`lg:col-span-3 relative h-[650px] bg-black rounded-[3rem] border-2 overflow-hidden transition-all duration-700 ${isLockdown ? 'border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.2)]' : 'border-white/10'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {isVisionActive && liveFrame ? (
              <img src={`data:image/jpeg;base64,${liveFrame}`} className="w-full h-full object-cover" alt="Feed" />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-[#030303]">
                 <div className={`absolute w-[400px] h-[400px] border border-blue-500/20 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center`}>
                    <div className="w-[300px] h-[300px] border border-dashed border-blue-500/40 rounded-full animate-[spin_10s_linear_reverse_infinite]"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                 </div>
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <Target size={100} className={`${isLockdown ? 'text-red-600' : 'text-blue-600'} opacity-20 animate-pulse`} />
                    <div className="mt-8 space-y-2 text-center">
                        <p className="text-[10px] font-black tracking-[1em] text-blue-500 animate-pulse">ESTABLISHING_NEURAL_LINK</p>
                        <p className="text-[9px] font-mono text-slate-600">ENCRYPT_KEY: AES_256_RSA_v2</p>
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-12 space-y-1">
                    <p className="text-[8px] font-mono text-blue-400 opacity-50">X: 44.12903</p>
                    <p className="text-[8px] font-mono text-blue-400 opacity-50">Y: -12.9023</p>
                    <p className="text-[8px] font-mono text-blue-400 opacity-50">Z: 1.0029</p>
                 </div>
              </div>
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-10 space-y-2 z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                    <Cpu size={14} className="text-blue-500" />
                    <span className="text-[10px] font-mono text-white">CPU: 42%</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                    <Database size={14} className="text-purple-500" />
                    <span className="text-[10px] font-mono text-white">MEM: 1.4GB</span>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-20">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className={`h-1 w-8 rounded-full ${scanProgress > 20 ? 'bg-blue-500' : 'bg-white/10'}`}></div>
                        <div className={`h-1 w-8 rounded-full ${scanProgress > 40 ? 'bg-blue-500' : 'bg-white/10'}`}></div>
                        <div className={`h-1 w-8 rounded-full ${scanProgress > 60 ? 'bg-blue-500' : 'bg-white/10'}`}></div>
                    </div>
                    <div className="p-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural_Mesh_Status</p>
                        <p className="text-xs font-bold italic uppercase tracking-tighter text-white">Scanning for anomalies...</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[30px] font-black italic tracking-tighter opacity-20 text-white">00:{Math.floor(scanProgress)}</p>
                </div>
            </div>
          </div>

          {(isVisionActive || true) && (
            <div className="absolute bottom-6 right-6 z-[100] pointer-events-auto">
              <button onClick={handleStopVision} className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600 border border-red-500/50 px-6 py-3 rounded-2xl transition-all duration-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Power size={16} className="text-red-500 group-hover:text-white animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] text-red-500 group-hover:text-white uppercase italic">Terminate_Vision_Core</span>
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div className="h-[310px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">Node_Distribution</h4>
                    <Globe size={14} className="text-blue-500 animate-spin-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-20 text-white"><Globe size={180} /></div>
                <div className="space-y-4 relative z-10">
                    {['NY_CLUSTER', 'LDN_GATE', 'TYO_NODE'].map((loc, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-[9px] font-black text-white">{loc}</span>
                            <span className="text-[9px] font-mono text-blue-400">ONLINE</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`h-[310px] bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 flex flex-col transition-all ${isLockdown ? 'border-red-500/50' : ''}`}>
                <h4 className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic mb-4">Neural_Events</h4>
                <div className="space-y-3 overflow-y-auto custom-scrollbar">
                    {alerts.length > 0 ? alerts.map((a, i) => (
                        <div key={i} className={`p-3 rounded-xl border text-[9px] font-bold uppercase italic ${isLockdown ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-slate-300'}`}>
                            {a.message}
                            <p className="text-[7px] opacity-50 mt-1 font-mono">{new Date().toLocaleTimeString()}</p>
                        </div>
                    )) : (<div className="flex flex-col items-center justify-center h-40 opacity-10 italic text-white"><Activity size={24} className="mb-2" /><p className="text-[8px] uppercase font-black">Waiting for Packets</p></div>)}
                </div>
            </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/5 p-6 z-[100]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-black italic text-white">SHIELD<span className="text-blue-500">AI</span></h3>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-green-500 uppercase">System_Active</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-4 text-slate-600 border-r border-white/10 pr-8">
                <Github size={16} className="hover:text-white transition-colors cursor-pointer" />
                <Twitter size={16} className="hover:text-blue-400 transition-colors cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10">
                <Globe size={14} /> PING: {stats.latency}MS
            </div>
            <button onClick={() => setIsTerminalOpen(true)} className="bg-white text-black text-[9px] font-black px-6 py-2.5 rounded-xl uppercase tracking-[0.2em] hover:bg-green-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Launch Terminal
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}