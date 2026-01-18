import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, MapPin, Send, Headset, ShieldCheck, 
  Activity, Globe, Zap, Cpu, Server, Terminal, Github, 
  Twitter, Linkedin, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export default function ContactView() {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [liveData, setLiveData] = useState([
    { val: 400 }, { val: 700 }, { val: 500 }, { val: 900 }, { val: 600 }, { val: 800 }, { val: 950 }
  ]);

  // Real-time chart update logic
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const newData = [...prev.slice(1), { val: Math.floor(Math.random() * 600) + 400 }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulating Secure Uplink
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-600/40">
      <div className="max-w-7xl mx-auto py-24 px-8 space-y-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        
        {/* --- TOP HEADER: ACTIVE STATUS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <p className="text-blue-500 font-mono text-[10px] tracking-[0.5em] uppercase">Uplink Status: Active</p>
             </div>
             <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
               Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Control</span>
             </h2>
          </div>
          <div className="hidden md:flex gap-12 text-right font-mono">
             <div className="space-y-1">
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Global Nodes</p>
                <p className="text-xl font-bold text-white">1,024/1,024</p>
             </div>
             <div className="space-y-1">
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Encryption</p>
                <p className="text-xl font-bold text-green-500 italic">AES-256</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: TELEMETRY & INTEL */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Interactive Cards */}
            <div className="space-y-4">
              {[
                { icon: <Mail size={20}/>, label: 'Secure Email', val: 'ops@goenka.ai', color: 'group-hover:text-blue-400' },
                { icon: <Terminal size={20}/>, label: 'Node Relay', val: 'relay-08.sovereign.mesh', color: 'group-hover:text-cyan-400' },
                { icon: <MapPin size={20}/>, label: 'HQ Geo-Location', val: '37.7749° N, 122.4194° W', color: 'group-hover:text-purple-400' }
              ].map((c, i) => (
                <div key={i} className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center transition-all ${c.color}`}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.label}</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{c.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE LOAD MONITOR */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12"><Activity size={80}/></div>
               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> Live Infrastructure Load
               </h4>
               <div className="h-32 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={liveData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="stepAfter" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                     <p className="text-[8px] text-slate-500 font-black uppercase">Ingress Speed</p>
                     <p className="text-lg font-black italic">1.2 GB/S</p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                     <p className="text-[8px] text-slate-500 font-black uppercase">Active Synapse</p>
                     <p className="text-lg font-black italic">94.8%</p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: SECURE DISPATCH TERMINAL */}
          <div className="lg:col-span-8 relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
            <div className="relative p-12 md:p-16 rounded-[4rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden">
               
               {/* Success Overlay */}
               {isSent && (
                 <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                       <CheckCircle size={40} />
                    </div>
                    <div className="text-center">
                       <h3 className="text-3xl font-black italic uppercase">Transmission Complete</h3>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Payload has been successfully relayed to Goenka HQ</p>
                    </div>
                    <button onClick={() => setIsSent(false)} className="px-8 py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5">New Dispatch</button>
                 </div>
               )}

               <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Secure <span className="text-blue-500 text-glow">Dispatcher</span></h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">End-to-End Encrypted Communication</p>
                  </div>
                  <ShieldCheck size={32} className="text-blue-600" />
               </div>

               <form onSubmit={handleDispatch} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="group space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Operator Full Name</label>
                       <input required type="text" className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-bold focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-800" placeholder="E.G. JOHN DOE" />
                    </div>
                    <div className="group space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Digital Signature (Email)</label>
                       <input required type="email" className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-bold focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-800" placeholder="OPERATOR@GOENKA.AI" />
                    </div>
                  </div>

                  <div className="group space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Data Payload (Your Message)</label>
                    <textarea required rows="6" className="w-full bg-black/40 border border-white/5 rounded-[3rem] px-8 py-8 text-sm font-bold focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none placeholder:text-slate-800" placeholder="ENTER MESSAGE CONTENT FOR ENCRYPTION..."></textarea>
                  </div>

                  <button 
                    disabled={isSending}
                    className="w-full py-8 bg-blue-600 hover:bg-white hover:text-black rounded-[2.5rem] font-black tracking-[0.6em] uppercase flex items-center justify-center gap-4 transition-all shadow-[0_30px_60px_rgba(37,99,235,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSending ? (
                      <>Uplink In Progress <Loader2 className="animate-spin" size={20}/></>
                    ) : (
                      <>Dispatch Payload <Send size={20} className="group-hover:translate-x-2 transition-transform"/></>
                    )}
                  </button>
               </form>
            </div>
          </div>
        </div>

        {/* --- SYSTEM INFRASTRUCTURE --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { icon: <Zap/>, label: 'Power Grid', val: 'Fusion Core', status: 'Stable' },
             { icon: <Globe/>, label: 'Mesh Network', val: '142 Countries', status: 'Encrypted' },
             { icon: <Server/>, label: 'Vault Storage', val: 'Immortal Ledgers', status: 'Online' },
             { icon: <Cpu/>, label: 'Neural Sync', val: 'Quantum Link', status: 'Synced' }
           ].map((item, i) => (
             <div key={i} className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.03] transition-colors">
                <div className="text-blue-500 mb-6">{item.icon}</div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-black italic uppercase mt-1">{item.val}</p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">{item.status}</span>
                </div>
             </div>
           ))}
        </div>

        {/* --- FOOTER: ENTERPRISE LEVEL --- */}
        <footer className="pt-24 pb-12 border-t border-white/5 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-2 space-y-8">
               <h3 className="text-3xl font-black italic tracking-tighter uppercase">ShieldAI <span className="text-blue-500">Sovereign.</span></h3>
               <p className="text-slate-500 text-xs font-bold uppercase leading-loose tracking-[0.2em] max-w-sm">
                 Architecting the first decentralized defense protocol for the sovereign enterprise. 
                 Owned by Goenka, protected by math.
               </p>
               <div className="flex gap-6">
                  <div className="p-4 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Github size={20}/></div>
                  <div className="p-4 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Twitter size={20}/></div>
                  <div className="p-4 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Linkedin size={20}/></div>
               </div>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry</h4>
               <ul className="text-[10px] font-black text-slate-600 space-y-4 uppercase tracking-widest cursor-pointer">
                  <li className="hover:text-blue-500 transition-colors">Terms of Uplink</li>
                  <li className="hover:text-blue-500 transition-colors">Privacy Neural-Net</li>
                  <li className="hover:text-blue-500 transition-colors">Compliance Docs</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white">System Logs</h4>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                  <p className="text-[8px] font-mono text-green-500">SYSTEM READY: 100%</p>
                  <p className="text-[8px] font-mono text-blue-500">NODE STATUS: OPTIMAL</p>
                  <p className="text-[8px] font-mono text-slate-700">VERSION: 4.0.8-ALPHA</p>
               </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-slate-700 tracking-[0.5em] uppercase">
            <p>© 2026 GOENKA ENTERPRISES // GLOBAL SOVEREIGN UNIT</p>
            <p className="flex items-center gap-2">Base: Silicon Valley <MapPin size={10}/></p>
          </div>
        </footer>
      </div>

      <style>{`
        .text-glow { text-shadow: 0 0 30px rgba(37, 99, 235, 0.5); }
        input:focus::placeholder, textarea:focus::placeholder { opacity: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>
    </div>
  );
}