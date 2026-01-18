import React, { useState, useEffect } from 'react';
import { 
  Cpu, Shield, Zap, Globe, Lock, BarChart3, ChevronRight, 
  Terminal, Github, Twitter, Linkedin, X, CheckCircle2, 
  Layers, Fingerprint, Network, Server, PlayCircle, Download, 
  ArrowLeft, Database, Activity, Eye, ShieldAlert, Workflow
} from 'lucide-react';

export default function GoenkaShieldPlatform() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

  // Smooth Scroll to Top on page transition
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  const handleDownload = () => {
    const content = "GOENKA ENTERPRISES - SHIELDAI PROTOCOL V4.0.8\n\nSection 1: Neural Sharding\nSection 2: Zero-Knowledge Privacy Mesh\nSection 3: Edge Inference Specs\n\n(C) 2026 Goenka Enterprises Secure Document.";
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Goenka_ShieldAI_Technical_Whitepaper.pdf";
    document.body.appendChild(element);
    element.click();
  };

  // --- 1. TECHNOLOGY DEEP-DIVE PAGE ---
  const TechnologyPage = () => (
    <div className="pt-32 px-8 pb-20 animate-in slide-in-from-bottom-10 duration-700 max-w-7xl mx-auto space-y-24">
      <header className="space-y-6 max-w-4xl">
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-[10px] hover:translate-x-[-5px] transition-transform">
          <ArrowLeft size={14}/> Back to Headquarters
        </button>
        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">The <span className="text-blue-500">Neural</span> Mesh</h1>
        <p className="text-xl text-slate-400 font-medium">Hamara proprietary architecture cloud par depend nahi karta. Hum intelligence ko hardware ke "True Edge" par deploy karte hain.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-12 bg-white/[0.03] border border-white/10 rounded-[3rem] space-y-6">
          <Cpu className="text-blue-500" size={48}/>
          <h2 className="text-3xl font-black italic uppercase italic">Sharded Inference</h2>
          <p className="text-slate-400 leading-relaxed">Tradition AI systems 100% data cloud par bhejte hain. Goenka ShieldAI model ko 512-bit shards mein divide karke nodes par distribute karta hai. Computing power client ke network mein hi rehti hai.</p>
          <ul className="space-y-4 pt-6">
            <li className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-400"><CheckCircle2 size={16}/> ARM-v9 Optimization</li>
            <li className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-400"><CheckCircle2 size={16}/> Dynamic Weight Re-balancing</li>
          </ul>
        </div>
        <div className="p-12 bg-blue-600 rounded-[3rem] space-y-6 text-white shadow-2xl shadow-blue-600/20">
          <Workflow size={48}/>
          <h2 className="text-3xl font-black italic uppercase italic">Zero Latency Mesh</h2>
          <p className="opacity-80 leading-relaxed">Processing speed is sub-10ms. Ye real-time decision making ke liye critical hai, jaise autonomous facility defense aur high-frequency traffic monitoring.</p>
          <div className="pt-10 flex gap-4">
             <div className="h-24 w-1 bg-white/20 rounded-full relative overflow-hidden"><div className="absolute top-0 w-full bg-white h-1/2 animate-pulse"></div></div>
             <div className="h-24 w-1 bg-white/20 rounded-full relative overflow-hidden"><div className="absolute top-4 w-full bg-white h-2/3 animate-pulse"></div></div>
             <div className="h-24 w-1 bg-white/20 rounded-full relative overflow-hidden"><div className="absolute top-2 w-full bg-white h-1/3 animate-pulse"></div></div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- 2. SECURITY & ENTERPRISE PAGE ---
  const SecurityPage = () => (
    <div className="pt-32 px-8 pb-20 animate-in slide-in-from-right-10 duration-700 max-w-7xl mx-auto space-y-24">
      <header className="text-center space-y-6">
        <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter">Enterprise <span className="text-blue-600">Fortress</span></h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em]">Zero Knowledge. Total Visibility.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { icon: <Lock />, title: "Quantum Resistance", desc: "Encryption that stays secure even against future quantum computing threats." },
          { icon: <Fingerprint />, title: "Identity Masking", desc: "Automatic blurring and hashing of human faces at the hardware level." },
          { icon: <ShieldAlert />, title: "Audit Chains", desc: "Immutable blockchain-based logs for every security event triggered." }
        ].map((item, i) => (
          <div key={i} className="p-10 border border-white/5 bg-white/[0.01] rounded-[2.5rem] hover:bg-blue-600/5 transition-all">
             <div className="text-blue-500 mb-6">{item.icon}</div>
             <h3 className="text-xl font-black uppercase italic mb-4">{item.title}</h3>
             <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // --- SHARED COMPONENTS ---
  const Navigation = () => (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-2xl px-12 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/40">G</div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter uppercase italic leading-none">Goenka</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Enterprises</span>
          </div>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <button onClick={() => setCurrentPage('technology')} className={`hover:text-blue-500 transition-colors ${currentPage==='technology'?'text-white':''}`}>Technology</button>
          <button onClick={() => setCurrentPage('security')} className={`hover:text-blue-500 transition-colors ${currentPage==='security'?'text-white':''}`}>Enterprise Security</button>
          <button onClick={() => setCurrentPage('home')} className="hover:text-blue-500 transition-colors">Infrastructure</button>
        </div>
        <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl">Contact Sales</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-600/40 overflow-x-hidden">
      
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5"></div>
      </div>

      <Navigation />

      <main className="relative z-10">
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="pt-64 pb-48 px-8 flex flex-col items-center text-center space-y-12">
              <div className="px-6 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                v4.0.8 Active Deployment
              </div>
              <h1 className="text-8xl md:text-[11rem] font-black italic tracking-tighter uppercase leading-[0.8] text-glow">
                Sovereign<br/><span className="text-blue-600">Shield.</span>
              </h1>
              <p className="max-w-3xl mx-auto text-slate-400 text-xl font-medium leading-relaxed">
                Goenka ShieldAI is the global gold-standard for decentralized security. We've eliminated the cloud to ensure your intelligence is private, permanent, and provable.
              </p>
              <div className="flex gap-6 pt-8">
                <button onClick={() => setIsWhitepaperOpen(true)} className="group px-12 py-6 bg-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 shadow-2xl shadow-blue-600/30">
                  <Terminal size={18}/> Read Whitepaper
                </button>
                <button onClick={() => setCurrentPage('technology')} className="px-12 py-6 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
                  Explore Architecture
                </button>
              </div>
            </section>

            {/* Feature Matrix */}
            <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-8 pb-32">
               <div className="relative group p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden hover:border-blue-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity"><Database size={180}/></div>
                  <h3 className="text-5xl font-black italic uppercase italic mb-6">True Edge</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">Data stays in your physical building. Analysis happens on-chip. No internet required for core intelligence.</p>
                  <button onClick={() => setCurrentPage('technology')} className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">Learn more <ChevronRight size={16}/></button>
               </div>
               <div className="relative group p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden hover:border-blue-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity"><Shield size={180}/></div>
                  <h3 className="text-5xl font-black italic uppercase italic mb-6">Zero Trace</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">Advanced hashing ensures that even a stolen hard drive reveals nothing. Forensic grade security for elite enterprises.</p>
                  <button onClick={() => setCurrentPage('security')} className="flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">Security Specs <ChevronRight size={16}/></button>
               </div>
            </section>
          </div>
        )}

        {currentPage === 'technology' && <TechnologyPage />}
        {currentPage === 'security' && <SecurityPage />}
      </main>

      {/* --- CORPORATE FOOTER --- */}
      <footer className="bg-black border-t border-white/5 py-24 px-12 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black">G</div>
              <span className="text-2xl font-black italic uppercase tracking-tighter">Goenka <span className="text-blue-500">Enterprises</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed italic">The future of intelligence is decentralized. We build the infrastructure for a secure, sovereign world.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Sitemap</h4>
            <ul className="space-y-4 text-xs font-bold text-slate-500">
              <li onClick={() => setCurrentPage('home')} className="hover:text-blue-500 cursor-pointer transition-colors">Home</li>
              <li onClick={() => setCurrentPage('technology')} className="hover:text-blue-500 cursor-pointer transition-colors">Technology</li>
              <li onClick={() => setCurrentPage('security')} className="hover:text-blue-500 cursor-pointer transition-colors">Enterprise</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Global Presence</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase">Silicon Valley HQ<br/>Mumbai R&D Center<br/>London Compliance Office</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 tracking-[0.4em] uppercase">
          <p>© 2026 GOENKA ENTERPRISES. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 items-center">
            <span className="text-green-500 animate-pulse">Network: Global Active</span>
            <div className="flex gap-4">
              <Github size={16} className="hover:text-white cursor-pointer"/>
              <Twitter size={16} className="hover:text-white cursor-pointer"/>
            </div>
          </div>
        </div>
      </footer>

      {/* --- WHITEPAPER OVERLAY (CONTENT INCREASED & WORKING DOWNLOAD) --- */}
      {isWhitepaperOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsWhitepaperOpen(false)}></div>
          <div className="relative w-full max-w-6xl h-full bg-[#050505] border border-blue-500/20 rounded-[4rem] shadow-[0_0_100px_rgba(59,130,246,0.1)] flex flex-col overflow-hidden">
             
             {/* Header */}
             <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30"><FileCode size={24}/></div>
                   <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter">ShieldAI Technical Protocol</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Official Release v4.0.8 // Goenka Labs</p>
                   </div>
                </div>
                <button onClick={() => setIsWhitepaperOpen(false)} className="p-4 bg-white/5 hover:bg-red-500/20 rounded-full transition-all group">
                   <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>

             {/* Deep Document Content */}
             <div className="flex-1 overflow-y-auto p-16 space-y-20 scrollbar-hide text-slate-300">
                <section className="space-y-8">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Chapter 01 // Architecture</div>
                   <h3 className="text-4xl font-black italic uppercase text-white">Neural Sharding & Mesh Distribution</h3>
                   <p className="text-lg leading-relaxed max-w-4xl">
                      Traditional AI systems architecture suffers from a 'Centralization Vulnerability'. When intelligence is hosted in a single cloud, a single breach compromises all data. ShieldAI utilizes <strong>Neural Sharding</strong>. We decompose large-scale vision models into 512 sub-weights, which are then cryptographically signed and distributed across the Goenka Mesh. 
                   </p>
                   <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] font-mono text-sm text-blue-300">
                      <code>
                        [INITIALIZING MESH_SYNC...]<br/>
                        &gt; SHARDING VECTOR DETECTED: 0x4F921B<br/>
                        &gt; DISTRIBUTING WEIGHTS ACROSS 1,024 EDGE NODES...<br/>
                        &gt; STATUS: SOVEREIGN_INTEGRITY_VERIFIED_100%
                      </code>
                   </div>
                </section>

                <section className="space-y-8">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Chapter 02 // Privacy</div>
                   <h3 className="text-4xl font-black italic uppercase text-white">Zero-Knowledge PII Redaction</h3>
                   <p className="text-lg leading-relaxed max-w-4xl">
                      The protocol uses <strong>On-Device Scrubbing</strong>. Before any video frame is analyzed, our hardware-level AI identifies Personally Identifiable Information (PII) like faces and license plates. These are replaced with anonymous mathematical vectors. 
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.01]">
                         <h4 className="text-white font-black italic uppercase mb-2">AES-256-GCM</h4>
                         <p className="text-sm text-slate-500">Every byte is encrypted before it leaves the sensor, ensuring zero leakage during transit.</p>
                      </div>
                      <div className="p-8 border border-white/10 rounded-3xl bg-white/[0.01]">
                         <h4 className="text-white font-black italic uppercase mb-2">Immutable Logs</h4>
                         <p className="text-sm text-slate-500">Logs are stored on a private, permissioned ledger that cannot be altered by administrators.</p>
                      </div>
                   </div>
                </section>
             </div>

             {/* Document Action Footer */}
             <div className="p-10 border-t border-white/5 bg-blue-600/5 flex justify-between items-center">
                <div className="flex gap-8">
                   <div className="text-center">
                      <div className="text-xl font-black italic">68 Pages</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Document Length</div>
                   </div>
                   <div className="text-center">
                      <div className="text-xl font-black italic">2.4MB</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">File Size</div>
                   </div>
                </div>
                <button 
                  onClick={handleDownload}
                  className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                   <Download size={18}/> Download Technical Manuscript
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .text-glow { text-shadow: 0 0 50px rgba(59, 130, 246, 0.3); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// Sub-component for Whitepaper Icon (Missing in lucide list sometimes)
function FileCode(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>
  );
}