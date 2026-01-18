import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Radio, Lock, Activity, Terminal, ShieldAlert, 
  Binary, Power, Fingerprint, Download, Orbit, 
  Code, BookOpen, ScrollText, ChevronRight, Hash, Globe, Server,
  Loader2, CheckCircle2, AlertCircle, RefreshCw, Send
} from 'lucide-react';

export default function SovereignOS() {
  const [activeTab, setActiveTab] = useState('kernel');
  const [modelThreshold, setModelThreshold] = useState(0.65);
  const [lockdown, setLockdown] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsBooting(false), 1500);
  }, []);

  const handleSaveManifest = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 3000);
  };

  if (isBooting) return <BootSequence />;

  return (
    <div className={`min-h-screen transition-all duration-700 ${lockdown ? 'bg-[#1a0505]' : 'bg-[#020202]'} text-slate-300 font-sans p-4 md:p-10 selection:bg-blue-500`}>
      
      {/* DEPLOYMENT OVERLAY */}
      {isDeploying && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="relative mb-12">
            <div className="w-32 h-32 border-4 border-blue-500/10 rounded-full animate-spin border-t-blue-500"></div>
            <Download className="absolute inset-0 m-auto text-blue-500 animate-bounce" size={40} />
          </div>
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black italic tracking-[0.6em] text-white uppercase">Syncing Manifest</h2>
             <div className="flex gap-2 justify-center">
                {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 bg-blue-600 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
             </div>
             <p className="text-[10px] font-mono text-blue-600/60 uppercase tracking-widest mt-8">Establishing Neural Handshake with Edge Nodes...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 relative">
        
        {/* TOP HUD NAV */}
        <nav className="flex flex-wrap justify-between items-center border-b border-white/5 pb-8 gap-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('kernel')}>
            <div className={`p-4 rounded-2xl transition-all duration-500 ${lockdown ? 'bg-red-600 rotate-12' : 'bg-blue-600'} group-hover:scale-110 shadow-2xl shadow-blue-600/20`}>
              <Cpu size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Sovereign <span className={lockdown ? 'text-red-500' : 'text-blue-600'}>OS</span></h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Kernel_Active_4.0.8</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
            {['kernel', 'terminal', 'logs', 'api', 'docs'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl scale-105' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* MAIN DYNAMIC AREA */}
        <main className="min-h-[70vh] animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeTab === 'kernel' && <KernelView threshold={modelThreshold} setThreshold={setModelThreshold} lockdown={lockdown} setLockdown={setLockdown} onSave={handleSaveManifest} />}
          {activeTab === 'terminal' && <TerminalView setLockdown={setLockdown} />}
          {activeTab === 'logs' && <LogsView />}
          {activeTab === 'api' && <APIView />}
          {activeTab === 'docs' && <DocsView />}
        </main>

        {/* FOOTER */}
        <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
           <div className="flex items-center gap-8">
              <span className="text-[9px] font-mono flex items-center gap-2 italic"><Globe size={12}/> MESH_STABLE</span>
              <span className="text-[9px] font-mono flex items-center gap-2 italic"><Hash size={12}/> SESSION: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">System Protected by Sovereign Protocol X</p>
        </footer>
      </div>
    </div>
  );
}

// --- SUB-VIEWS ---

function KernelView({ threshold, setThreshold, lockdown, setLockdown, onSave }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 p-14 bg-white/[0.02] border border-white/10 rounded-[4rem] space-y-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 rotate-12 group-hover:rotate-45">
          <Binary size={400}/>
        </div>
        <div className="relative">
           <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Neural Core</h2>
           <p className="text-xs text-slate-500 mt-3 tracking-[0.3em] uppercase font-bold">Adjusting Confidence Inference Shards</p>
        </div>
        <div className="space-y-10 relative">
          <div className="flex justify-between items-end">
            <span className="text-9xl font-black text-blue-600 font-mono italic tracking-tighter drop-shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all group-hover:scale-110 origin-left">{threshold}</span>
            <button 
              onClick={onSave}
              className="px-12 py-5 bg-blue-600 hover:bg-white text-white hover:text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 flex items-center gap-4 shadow-2xl shadow-blue-600/20"
            >
              <Download size={18}/> Save Manifest
            </button>
          </div>
          <div className="relative h-4 flex items-center">
            <input 
              type="range" min="0.1" max="1.0" step="0.01" 
              value={threshold} 
              onChange={(e) => setThreshold(e.target.value)} 
              className="w-full h-2 bg-white/5 rounded-full appearance-none accent-blue-600 cursor-pointer relative z-10" 
            />
            <div className="absolute inset-0 bg-blue-600/10 blur-md rounded-full" style={{ width: `${threshold * 100}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className={`p-12 rounded-[4rem] border flex flex-col items-center justify-center text-center gap-8 transition-all duration-700 ${lockdown ? 'bg-red-600 border-red-400 shadow-[0_0_60px_rgba(220,38,38,0.3)] scale-105' : 'bg-white/[0.02] border-white/10 hover:border-red-500/40'}`}>
        <div className={`p-8 rounded-full transition-all duration-500 ${lockdown ? 'bg-white text-red-600 rotate-180' : 'bg-red-600/10 text-red-600'} shadow-2xl`}>
          <Lock size={48} className={lockdown ? '' : 'animate-pulse'} />
        </div>
        <div>
          <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Protocol X</h3>
          <p className={`text-[10px] uppercase mt-3 tracking-widest font-black leading-relaxed ${lockdown ? 'text-red-200' : 'text-slate-600'}`}>Emergency Hardware Air-Gap</p>
        </div>
        <button 
          onClick={() => setLockdown(!lockdown)} 
          className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] transition-all duration-500 ${lockdown ? 'bg-black text-white hover:bg-slate-900' : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30'}`}
        >
          {lockdown ? 'Deactivate Lockdown' : 'Engage Blackout'}
        </button>
      </div>
    </div>
  );
}

function TerminalView({ setLockdown }) {
  const [history, setHistory] = useState([
    { type: 'sys', msg: 'Sovereign Bash v2.0.4 initialized...' },
    { type: 'sys', msg: 'Kernel connected to Node: US-WEST-01' },
    { type: 'sys', msg: 'Neural handshake complete. Awaiting root input...' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newEntry = { type: 'user', msg: input };
    const cmd = input.toLowerCase().trim();
    let response = null;

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'help') {
      response = 'Available protocols: status, lockdown, mesh-sync, whoami, clear';
    } else if (cmd === 'lockdown') {
      setLockdown(true);
      response = 'PROTOCOL X ENGAGED. PHYSICAL AIR-GAP ACTIVE.';
    } else if (cmd === 'status') {
      response = 'OS: Sovereign 4.0.8 | Integrity: 100% | CPU: 12% | Temp: 42°C';
    } else if (cmd === 'whoami') {
      response = 'Authorized Root Administrator: SOV_ID_8821';
    } else if (cmd === 'mesh-sync') {
      response = 'Synchronizing shards... 14 nodes verified. Sync OK.';
    } else {
      response = `Error: Protocol '${cmd}' not found in registry.`;
    }

    setHistory(prev => [...prev, newEntry, { type: 'sys', msg: response }]);
    setInput('');
  };

  return (
    <div className="bg-black border border-white/10 rounded-[3rem] p-10 font-mono text-lg h-[650px] shadow-2xl flex flex-col">
      <div className="flex items-center gap-3 mb-10 text-blue-500/40 border-b border-white/5 pb-6">
        <Terminal size={24}/> <span className="text-[10px] font-black uppercase tracking-[0.6em]">System_Console_Access</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-hide">
        {history.map((h, i) => (
          <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300`}>
            {h.type === 'user' ? (
              <span className="text-blue-600 font-black tracking-tighter">❯ admin@sov:</span>
            ) : (
              <span className="text-slate-700 font-black">❯ sys:</span>
            )}
            <span className={h.type === 'user' ? 'text-white italic' : 'text-slate-500 font-medium'}>{h.msg}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-8 flex gap-4 items-center bg-white/[0.03] p-6 rounded-2xl border border-white/5 focus-within:border-blue-600/50 transition-all">
        <span className="text-blue-600 font-black text-xl italic tracking-tighter">❯</span>
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command... (try 'help')"
          className="bg-transparent border-none outline-none text-white w-full text-lg placeholder:text-slate-800 italic"
        />
        <Send size={20} className="text-slate-700" />
      </form>
    </div>
  );
}

function APIView() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const testRequest = () => {
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setLoading(false);
      setResponse({
        timestamp: new Date().toISOString(),
        node_id: "KERN-V5-" + Math.floor(Math.random() * 9000),
        status: "OPERATIONAL",
        mesh_integrity: (Math.random() * 5 + 95).toFixed(2) + "%",
        active_shards: ["ALPHA_01", "OMEGA_09", "SIGMA_V"],
        authorized: true
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">API Interface</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Secure JSON Mesh Hooks</p>
        </div>
        <div className="space-y-4">
          {['GET /v1/system/health', 'POST /v1/mesh/deploy', 'PATCH /v1/neural/config'].map((path, i) => (
            <div key={i} className="p-7 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-white/[0.05] hover:border-blue-500/20 transition-all cursor-pointer">
              <code className="text-blue-400 font-mono text-md tracking-tight">{path}</code>
              <ChevronRight size={18} className="text-slate-800 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
            </div>
          ))}
        </div>
        <button 
          onClick={testRequest}
          className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] transition-all hover:bg-white hover:text-black shadow-2xl shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <RefreshCw className="animate-spin" size={18}/> : <Zap size={18}/>}
          {loading ? 'Requesting Shard Data...' : 'Execute Test Sync'}
        </button>
      </div>

      <div className="bg-black border border-white/10 rounded-[3rem] p-10 flex flex-col min-h-[500px] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-orange-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-600/50"></div>
           </div>
           <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest italic">Response_Output_0.42</span>
        </div>
        <div className="flex-1 font-mono text-base text-blue-400/70 leading-relaxed overflow-auto">
          {loading ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-white/5 w-3/4 rounded"></div>
               <div className="h-4 bg-white/5 w-1/2 rounded"></div>
               <div className="h-4 bg-white/5 w-2/3 rounded"></div>
            </div>
          ) : response ? (
            <pre className="animate-in fade-in zoom-in-95 duration-500">{JSON.stringify(response, null, 2)}</pre>
          ) : (
            <div className="text-slate-800 italic flex flex-col items-center justify-center h-full gap-4">
              <Code size={40} className="opacity-20" />
              <p className="text-[10px] uppercase tracking-widest font-black">Awaiting Request Execution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogsView() {
  const mockLogs = [
    { time: '14:20:01', event: 'Neural Sharding Initialized', status: 'Success', node: 'MAIN_01' },
    { time: '14:18:44', event: 'Packet Filtering Breach', status: 'Blocked', node: 'EDGE_JP' },
    { time: '14:15:20', event: 'Manual Mesh Override', status: 'Success', node: 'ADMIN' },
    { time: '14:12:05', event: 'Latency Spike Detected', status: 'Warning', node: 'EU_WEST' },
    { id: '5', time: '13:55:12', event: 'Kernel Registry Backup', status: 'Success', node: 'COLD_STORAGE' },
  ];
  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          <tr>
            <th className="p-10">Time_Index</th>
            <th className="p-10">System_Event</th>
            <th className="p-10">Target_Node</th>
            <th className="p-10 text-right">Result</th>
          </tr>
        </thead>
        <tbody className="text-sm font-mono font-medium">
          {mockLogs.map((log, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/[0.04] transition-all group cursor-default">
              <td className="p-10 text-blue-500/60">{log.time}</td>
              <td className="p-10 text-white italic group-hover:translate-x-2 transition-transform">{log.event}</td>
              <td className="p-10 text-slate-600">{log.node}</td>
              <td className="p-10 text-right">
                <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  log.status === 'Success' ? 'bg-green-500/10 text-green-500' : 
                  log.status === 'Warning' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocsView() {
  return (
    <div className="max-w-4xl space-y-20 py-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="space-y-6 border-l-8 border-blue-600 pl-12">
        <h2 className="text-7xl font-black italic text-white tracking-tighter uppercase leading-[0.9]">Technical<br/>Whitepaper</h2>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl font-medium italic">Architecting the future of decentralized neural computation. Secure, air-gapped, and sovereign.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[3.5rem] space-y-6 group hover:bg-blue-600/5 transition-all">
          <div className="p-4 bg-blue-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><BookOpen className="text-blue-500" size={32}/></div>
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Neural Sharding</h4>
          <p className="text-sm text-slate-600 leading-relaxed font-mono">Inference confidence weights determine the model's predictive precision. Thresholds below 0.5 prioritize speed, while 0.8+ ensures cryptographic accuracy.</p>
        </div>
        <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[3.5rem] space-y-6 group hover:bg-red-600/5 transition-all">
           <div className="p-4 bg-red-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><ShieldAlert className="text-red-500" size={32}/></div>
          <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Protocol Lockdown</h4>
          <p className="text-sm text-slate-600 leading-relaxed font-mono">The air-gap protocol physically disconnects the node mesh from the global DNS, routing all traffic through local encrypted shards only.</p>
        </div>
      </div>
    </div>
  );
}

function BootSequence() {
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center font-mono p-10">
      <div className="mb-12 relative scale-150">
        <div className="w-24 h-24 border-2 border-blue-600/10 rounded-full animate-spin border-t-blue-600"></div>
        <Cpu className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={32} />
      </div>
      <div className="w-80 h-1 bg-white/5 rounded-full overflow-hidden mb-8 shadow-2xl shadow-blue-600/20">
        <div className="h-full bg-blue-600 animate-[progress_1.5s_ease-in-out]"></div>
      </div>
      <div className="text-[11px] tracking-[1em] text-blue-500 uppercase font-black animate-pulse">Initializing_Sovereign</div>
    </div>
  );
}