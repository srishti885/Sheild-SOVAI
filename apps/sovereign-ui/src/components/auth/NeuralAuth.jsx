import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Loader2, RefreshCw, Smartphone, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = "http://localhost:5000";

export default function NeuralAuth() {
  const [sessionId, setSessionId] = useState(null);
  const [authStatus, setAuthStatus] = useState('LOADING'); 
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  const fetchSession = async () => {
    setAuthStatus('LOADING');
    try {
      const res = await fetch(`${SOCKET_URL}/api/v1/auth/session`);
      const data = await res.json();
      setSessionId(data.sessionId);
      setAuthStatus('WAITING');
      setTimeLeft(300);
      initSocket(data.sessionId);
    } catch (err) {
      console.error("[AUTH] Connection Failed");
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const initSocket = (sid) => {
    const socket = io(SOCKET_URL);
    socket.emit('request-neural-link', sid);

    socket.on('neural-auth-verified', (data) => {
      setAuthStatus('SUCCESS');
      localStorage.setItem('shield_token', 'SECURE_ACCESS_GRANTED');
      setTimeout(() => {
        socket.disconnect();
        navigate('/dashboard'); 
      }, 2000);
    });

    return () => socket.disconnect();
  };

  useEffect(() => {
    if (timeLeft > 0 && authStatus === 'WAITING') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, authStatus]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center bg-[#050505] border border-white/5 p-8 md:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
        
        {/* Left Side: Instructions */}
        <div className="space-y-8 z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
              Neural<br/><span className="text-blue-500">Gateway</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold tracking-[0.3em] uppercase mt-4">Security Protocol v2.1</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                <Smartphone className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Open Sovereign App</p>
                <p className="text-slate-500 text-xs mt-1">Initialize biometric handshake on your paired device.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                <ScanLine className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Scan & Verify</p>
                <p className="text-slate-500 text-xs mt-1">Align QR code and use fingerprint to authorize access.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: QR Terminal */}
        <div className="relative flex flex-col items-center bg-white/[0.02] border border-white/10 p-10 rounded-[3.5rem] overflow-hidden group">
          {/* Scanning Animation Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_4s_linear_infinite] z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

          <div className={`p-6 bg-white rounded-[2.5rem] transition-all duration-700 ${authStatus === 'SUCCESS' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
            {sessionId ? (
              <QRCodeSVG value={JSON.stringify({ sid: sessionId, act: 'AUTH' })} size={200} />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
              </div>
            )}
          </div>

          {authStatus === 'SUCCESS' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-500/20 backdrop-blur-sm animate-in zoom-in">
              <ShieldCheck size={80} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              <p className="mt-4 text-white font-black italic tracking-[0.3em] uppercase text-xs">Access_Granted</p>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">Session ID: {sessionId || 'Connecting...'}</span>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(timeLeft/300)*100}%` }}></div>
              </div>
              <span className="text-blue-500 font-mono text-[10px]">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}