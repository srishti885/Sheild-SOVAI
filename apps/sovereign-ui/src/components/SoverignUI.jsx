import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Camera, Activity, Zap, Cpu, Server, Globe, 
  Terminal, Github, Twitter, Linkedin, X, ChevronRight,
  ShieldCheck, Lock, Fingerprint, Crown, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. GLOBAL TERMINAL COMPONENT (The Root Console) ---
const RootConsole = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { text: ">>> SOVEREIGN_OS KERNEL BOOT SUCCESSFUL", type: "system" },
    { text: ">>> ROOT_ACCESS: GRANTED", type: "success" },
    { text: ">>> TYPE 'HELP' FOR COMMAND LIST", type: "info" }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.toLowerCase().trim();
    const newHistory = [...history, { text: `root@sovereign:~# ${input}`, type: "user" }];

    if (cmd === 'help') {
      newHistory.push({ text: "CMDS: SCAN_NODES, CLEAR, STATUS, EXIT, OVERRIDE", type: "info" });
    } else if (cmd === 'scan_nodes') {
      newHistory.push({ text: "INTERROGATING GLOBAL MESH...", type: "system" });
      setTimeout(() => setHistory(prev => [...prev, { text: "SHARDS: 14 ACTIVE / 0 BREACHED", type: "success" }]), 800);
    } else if (cmd === 'clear') { setHistory([]); setInput(''); return; }
    else if (cmd === 'exit') { onClose(); }
    else { newHistory.push({ text: `ERR: UNKNOWN_PROTOCOL_${cmd}`, type: "error" }); }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] p-4 md:p-10 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="w-full max-w-4xl h-[600px] bg-[#050505] border border-blue-500/30 rounded-[2.5rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] flex flex-col overflow-hidden"
          >
            {/* Console Header */}
            <div className="bg-white/5 px-8 py-5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-blue-400">Root_Console_v4.0</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all"><X size={20}/></button>
            </div>

            {/* Logs Area */}
            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto font-mono text-sm space-y-3 selection:bg-blue-500/30">
              {history.map((line, i) => (
                <p key={i} className={`
                  ${line.type === 'user' ? 'text-white/90' : ''}
                  ${line.type === 'system' ? 'text-blue-500 font-bold' : ''}
                  ${line.type === 'success' ? 'text-green-500' : ''}
                  ${line.type === 'error' ? 'text-red-500' : ''}
                  ${line.type === 'info' ? 'text-slate-500 italic' : ''}
                `}>{line.text}</p>
              ))}
              <div className="w-2 h-5 bg-blue-500 animate-pulse inline-block align-middle" />
            </div>

            {/* Command Input */}
            <form onSubmit={handleCommand} className="p-6 bg-black border-t border-white/5 flex items-center gap-4">
              <ChevronRight size={20} className="text-blue-600" />
              <input 
                autoFocus className="bg-transparent border-none outline-none text-white w-full font-mono text-lg"
                value={input} onChange={(e) => setInput(e.target.value)} placeholder="execute_protocol..."
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- 2. MAIN APP CONTROLLER ---
export default function ShieldAIApp() {
  const [view, setView] = useState('dashboard');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Shadow');

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      
      {/* GLOBAL HUD HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Zap size={20} className="fill-white" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">SHIELD<span className="text-blue-600">AI</span></h1>
        </div>
        
        {/* Navigation Switcher */}
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {['dashboard', 'billing'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}>
              {v}
            </button>
          ))}
        </div>
      </nav>

      {/* RENDER VIEW CONTENT */}
      <main className="pt-32 pb-40 px-8 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <DashboardContent plan={currentPlan} onOpenConsole={() => setIsConsoleOpen(true)} />
          ) : (
            <BillingContent currentPlan={currentPlan} setPlan={setCurrentPlan} />
          )}
        </AnimatePresence>
      </main>

      {/* --- GLOBAL ROOT CONSOLE FLOATING BUTTON --- */}
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsConsoleOpen(true)}
        className="fixed bottom-28 right-8 z-[100] bg-blue-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-3 border border-white/20 group"
      >
        <Terminal size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] pr-2">Launch_Root_Console</span>
      </motion.button>

      {/* GLOBAL FOOTER */}
      <footer className="fixed bottom-0 w-full z-50 bg-black/90 backdrop-blur-3xl border-t border-white/5 p-6 px-10">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-3">
              <Radio size={14} className="text-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global_Mesh: Stable</span>
            </div>
            <div className="hidden lg:flex gap-6 text-slate-600">
               <Github size={18} className="hover:text-white cursor-pointer" />
               <Twitter size={18} className="hover:text-blue-400 cursor-pointer" />
            </div>
          </div>
          <button 
            onClick={() => setIsConsoleOpen(true)}
            className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 hover:text-white transition-all"
          >
            <Terminal size={14} /> System_Terminal_Execute
          </button>
        </div>
      </footer>

      {/* THE CONSOLE OVERLAY */}
      <RootConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
    </div>
  );
}

// --- SUB-VIEWS: DASHBOARD & BILLING ---
const DashboardContent = ({ plan, onOpenConsole }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
    <div className="flex justify-between items-end border-b border-white/5 pb-10">
      <div>
        <p className="text-blue-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-3">Sovereign_Node // Encrypted_Uplink</p>
        <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Security <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Hub</span></h2>
      </div>
      <div className="text-right bg-white/5 p-5 rounded-3xl border border-white/10">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Protocol</p>
        <p className="text-2xl font-black italic uppercase text-blue-500">{plan} Access</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[#080808] border border-white/10 rounded-[3rem] h-[450px] flex flex-col items-center justify-center space-y-4 group relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <Camera size={50} className="text-slate-800 group-hover:text-blue-900 transition-colors duration-700" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">Vision_Stream_Inactive</p>
      </div>
      <div className="space-y-8">
        <div className="p-10 bg-blue-600 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <Activity size={30} className="mb-6 opacity-40 group-hover:rotate-12 transition-transform" />
          <p className="text-[11px] font-black uppercase opacity-60">System Health</p>
          <p className="text-8xl font-black italic tracking-tighter">98<span className="text-3xl">%</span></p>
        </div>
        <div onClick={onOpenConsole} className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] cursor-pointer hover:border-blue-500/50 transition-all flex justify-between items-center group">
          <div className="flex items-center gap-4">
             <Terminal size={24} className="text-blue-500" />
             <span className="text-[11px] font-black uppercase tracking-widest">Quick_Console</span>
          </div>
          <ChevronRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </motion.div>
);

const BillingContent = ({ currentPlan, setPlan }) => {
  const plans = [
    { id: 'Shadow', price: '0', icon: <Fingerprint/>, features: ['1 Node', 'Standard Enc.'] },
    { id: 'Sovereign', price: '199', icon: <Crown/>, color: 'text-blue-500', features: ['10 Nodes', 'Neural Bypass'] },
    { id: 'Titan', price: '999', icon: <ShieldAlert/>, color: 'text-purple-500', features: ['Global Sync', 'Quantum Lock'] }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">License <span className="text-blue-600">Protocols</span></h2>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">Choose your neural architecture</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(p => (
          <div key={p.id} className={`p-10 rounded-[3rem] border-2 transition-all ${currentPlan === p.id ? 'bg-blue-600/5 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.15)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}>
            <div className={`mb-8 p-4 bg-white/5 w-fit rounded-2xl ${p.color || 'text-slate-600'}`}>{p.icon}</div>
            <h4 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">{p.id} Node</h4>
            <div className="text-5xl font-black mb-10">${p.price}<span className="text-xs text-slate-500">/MO</span></div>
            <button onClick={() => setPlan(p.id)} className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentPlan === p.id ? 'bg-white/10 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-white hover:text-black shadow-xl shadow-blue-600/20'}`}>
              {currentPlan === p.id ? 'ACTIVE' : 'INITIALIZE'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};