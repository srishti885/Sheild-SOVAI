import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Zap, Crown, CheckCircle2, ShieldAlert, Activity, 
  ArrowUpRight, X, Lock, Fingerprint, Github, Twitter, 
  Globe, Terminal, ShieldCheck, Cpu, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShieldAIContainer() {
  const [currentView, setCurrentView] = useState('billing');
  const [currentPlanId, setCurrentPlanId] = useState('free');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stats, setStats] = useState({ cpu: 12, latency: 12 });

  // Real-time stats simulation (Touch nahi kiya)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * (25 - 5) + 5),
        latency: Math.floor(Math.random() * (20 - 10) + 10)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    { id: 'free', plan: 'Shadow Node', price: '0', features: ['1 Local Node', '24-Hour Buffer', 'Basic Detection'], icon: <Fingerprint size={32}/>, color: 'text-slate-500', glow: 'group-hover:shadow-slate-500/20' },
    { id: 'pro', plan: 'Sovereign Pro', price: '199', features: ['10 AI Nodes', 'Unlimited Vault', 'OS Lockdown', 'Priority Mesh'], icon: <Crown size={32}/>, color: 'text-blue-400', popular: true, glow: 'group-hover:shadow-blue-500/30' },
    { id: 'enterprise', plan: 'Titan Cluster', price: '999', features: ['Global Clusters', 'Dedicated Support', 'On-Premise AI', 'Zero Latency Sync'], icon: <ShieldAlert size={32}/>, color: 'text-purple-400', glow: 'group-hover:shadow-purple-500/30' },
  ];

  const handlePayment = (e) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setCurrentPlanId(selectedPlan.id);
        setSelectedPlan(null);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. ULTRA NAV */}
      <nav className="sticky top-0 z-[100] bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.5)]">
               <Zap size={20} className="fill-white" />
             </div>
             <h1 className="text-2xl font-black italic tracking-tighter">SHIELD<span className="text-blue-600">AI</span></h1>
          </div>
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {['dashboard', 'billing'].map((view) => (
              <button 
                key={view}
                onClick={() => setCurrentView(view)} 
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentView === view ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-20 px-6 pb-40">
        <AnimatePresence mode="wait">
          {currentView === 'billing' ? (
            <motion.div 
              key="billing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Choose Your <span className="text-blue-600">Armor</span></h2>
                <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Decentralized Intelligence License Protocols</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p) => (
                  <div 
                    key={p.id} 
                    className={`group p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[3rem] transition-all hover:scale-[1.02] ${currentPlanId === p.id ? 'from-blue-600' : ''}`}
                  >
                    <div className={`h-full p-10 rounded-[2.9rem] bg-[#080808] transition-all group-hover:bg-[#0c0c0c] flex flex-col relative overflow-hidden shadow-2xl ${p.glow}`}>
                      {p.popular && <div className="absolute top-8 right-[-35px] rotate-45 bg-blue-600 text-[8px] font-black px-10 py-1 shadow-lg">POPULAR</div>}
                      
                      <div className={`${p.color} mb-8 p-4 bg-white/5 w-fit rounded-2xl`}>{p.icon}</div>
                      <h4 className="text-3xl font-black italic mb-2 uppercase tracking-tight">{p.plan}</h4>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-5xl font-black">${p.price}</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ Month</span>
                      </div>

                      <div className="space-y-4 flex-1 mb-10 border-t border-white/5 pt-8">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                            <CheckCircle2 size={14} className={currentPlanId === p.id ? "text-green-500" : "text-blue-600"}/> {f}
                          </div>
                        ))}
                      </div>

                      <button 
                        disabled={currentPlanId === p.id}
                        onClick={() => setSelectedPlan(p)}
                        className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${currentPlanId === p.id ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-white hover:text-black hover:shadow-blue-500/40'}`}
                      >
                        {currentPlanId === p.id ? 'Active Protocol' : 'Initialize Upgrade'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- UPGRADED LIVE DASHBOARD --- */
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* 1. NEURAL UPLINK VISUALIZER (Large Section) */}
              <div className="lg:col-span-2 p-1 bg-gradient-to-br from-blue-600/20 to-transparent rounded-[3rem]">
                <div className="h-full bg-[#080808] border border-white/5 rounded-[2.9rem] p-10 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-4xl font-black italic uppercase tracking-tighter">Neural Uplink</h3>
                      <p className="text-[10px] text-blue-500 font-mono font-bold tracking-[0.4em] mt-1 uppercase">Active Stream: Shard_04</p>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [10, 30, 10] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-1 bg-blue-600 rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  {/* LIVE WAVEFORM ANIMATION */}
                  <div className="relative h-64 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full opacity-10">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    
                    <div className="z-10 text-center">
                      <motion.h2 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-9xl font-black italic text-white tracking-tighter uppercase"
                      >
                        {stats.cpu < 18 ? 'Stable' : 'High Load'}
                      </motion.h2>
                      <div className="flex justify-center gap-10 mt-6 font-mono">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Integrity</p>
                          <p className="text-xl font-black italic text-blue-500">99.98%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network</p>
                          <p className="text-xl font-black italic text-blue-500">{stats.latency}ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SECURITY RADAR & STATS (Sidebar Section) */}
              <div className="space-y-8">
                {/* SCANNING RADAR */}
                <div className="p-8 bg-[#080808] border border-white/5 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-6">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                      />
                      <div className="absolute inset-4 border border-white/5 rounded-full" />
                      <ShieldCheck size={40} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
                    </div>
                    <h4 className="text-lg font-black italic uppercase tracking-tighter">Sentinel Scan</h4>
                    <p className="text-[9px] text-green-500 font-mono font-black mt-1">NO BREACHES DETECTED</p>
                  </div>
                </div>

                {/* LIVE GRID METRICS */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    <Cpu size={20} className="mx-auto text-slate-500 mb-2" />
                    <p className="text-[8px] font-black text-slate-500 uppercase">Core Load</p>
                    <p className="text-xl font-black italic text-white">{stats.cpu}%</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    <Radio size={20} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-[8px] font-black text-slate-500 uppercase">Mesh Status</p>
                    <p className="text-xl font-black italic text-green-500">Live</p>
                  </div>
                </div>

                {/* DATA FLOW PREVIEW */}
                <div className="p-6 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-600/20">
                   <div className="flex justify-between items-center text-black">
                      <span className="text-[10px] font-black uppercase tracking-widest italic font-mono">Quantum_Sync</span>
                      <ArrowUpRight size={20} />
                   </div>
                   <div className="mt-4 h-1 w-full bg-black/20 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="h-full w-1/2 bg-white"
                      />
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. PAYMENT MODAL (Touch nahi kiya) */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[3rem] p-12 relative shadow-[0_0_100px_rgba(37,99,235,0.2)]"
            >
              <AnimatePresence>
                {paymentSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-600 flex flex-col items-center justify-center z-50 text-center p-10"
                  >
                    <div className="p-6 bg-white rounded-full mb-6">
                      <ShieldCheck size={60} className="text-blue-600" />
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Access Granted</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">Syncing Neural Shards...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={() => setSelectedPlan(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-blue-600/10 rounded-2xl mb-4 text-blue-500"><CreditCard size={32} /></div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">Secure Checkout</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Upgrade to {selectedPlan.plan}</p>
              </div>

              <form onSubmit={handlePayment} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Card Credentials</label>
                  <input required placeholder="•••• •••• •••• ••••" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-mono outline-none focus:border-blue-600 focus:bg-white/[0.05] transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <input required placeholder="MM/YY" className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-mono outline-none focus:border-blue-600 transition-all" />
                  <input required placeholder="CVC" className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm font-mono outline-none focus:border-blue-600 transition-all" />
                </div>
                <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10 flex justify-between items-center mt-4">
                   <span className="text-xs font-black uppercase text-slate-400">Total Charge</span>
                   <span className="text-2xl font-black italic">${selectedPlan.price}</span>
                </div>
                <button className="group relative w-full bg-blue-600 overflow-hidden py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
                   <span className="relative z-10">{isPaying ? 'Verifying Node...' : 'Authorize Transaction'}</span>
                   {isPaying && <motion.div layoutId="loader" className="absolute inset-0 bg-blue-500 animate-pulse" />}
                </button>
              </form>
              <p className="text-[8px] text-slate-600 text-center mt-8 uppercase font-black tracking-widest flex items-center justify-center gap-2"><Lock size={10}/> 256-Bit Quantum Encryption Active</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DYNAMIC HUD FOOTER (Touch nahi kiya) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-3xl border-t border-white/5 p-6 z-[100]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col text-left">
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">System Core</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 italic"><Radio size={12} className="animate-pulse"/> ENCRYPTED_MESH</div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                 <p className="text-[8px] text-slate-500 font-black uppercase text-left">CPU Load</p>
                 <div className="flex items-center gap-2">
                   <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div animate={{ width: `${stats.cpu}%` }} className="h-full bg-blue-600" />
                   </div>
                   <span className="text-[9px] font-mono">{stats.cpu}%</span>
                 </div>
              </div>
              <div className="space-y-1 text-right">
                 <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest text-left">Latency</p>
                 <span className="text-[10px] font-black text-blue-500 italic flex items-center gap-1"><Globe size={12}/> {stats.latency}ms</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 text-slate-600 mr-4">
              <Github size={18} className="hover:text-white transition-colors cursor-pointer"/> 
              <Twitter size={18} className="hover:text-blue-400 transition-colors cursor-pointer"/>
            </div>
            <button className="group flex items-center gap-2 bg-white text-black text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              <Terminal size={14} /> Open Terminal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}