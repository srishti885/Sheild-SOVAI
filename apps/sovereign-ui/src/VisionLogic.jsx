import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  Shield, ShieldCheck, AlertTriangle, Activity, Clock, 
  Database, Lock, EyeOff, RefreshCw, Smartphone, Power, ShieldAlert,
  Fingerprint, Gauge, Crosshair, Terminal, ScanEye, UserCheck, ShieldX,
  Volume2, Radio, Zap, Users, AlertOctagon, SearchCode, Binary, ClipboardCheck,
  TrendingUp, LifeBuoy, Ghost, HardDrive, Cpu, Network, Camera
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

/**
 * SHIELDAI SOVEREIGN v2.0
 * Enterprise Data Protection & Forensic Audit Terminal
 */

// SMART SWITCH: AUTO-SELECT LOCAL OR LIVE FROM YOUR .ENV
const isLocal = window.location.hostname === 'localhost';
const BASE_URL = isLocal 
  ? import.meta.env.VITE_LOCAL_BACKEND 
  : import.meta.env.VITE_LIVE_BACKEND;

const socket = io(BASE_URL);

const riskData = [
  { time: '00:00', score: 98, traffic: 120 }, { time: '04:00', score: 95, traffic: 80 },
  { time: '08:00', score: 99, traffic: 450 }, { time: '12:00', score: 42, traffic: 900 }, 
  { time: '16:00', score: 85, traffic: 600 }, { time: '20:00', score: 92, traffic: 300 },
  { time: '23:59', score: 100, traffic: 150 },
];

export default function VisionLogic() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [visualAlert, setVisualAlert] = useState(null);
  const [isVisionOn, setIsVisionOn] = useState(false);
  const [securityScore, setSecurityScore] = useState(100);
  const [scanText, setScanText] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [leakReport, setLeakReport] = useState(null);
  const [isDeadManActive, setIsDeadManActive] = useState(false);
  const [systemLoad, setSystemLoad] = useState({ cpu: 12, mem: 34, net: "OPTIMAL" });
  const [liveFrame, setLiveFrame] = useState(null);
  const [breachEvidence, setBreachEvidence] = useState(null);

  const sirenRef = useRef(null);

  const injectWatermark = (text) => {
    const watermark = "SHIELDAI_SECURE_PROPERTY_2026"; 
    const invisibleHash = "\u200B\u200C\u200D" + btoa(watermark).slice(0, 8); 
    return text + invisibleHash;
  };

  const verifyWatermark = () => {
    if (!scanText) return;
    const hasInvisibleMarker = scanText.includes("\u200B\u200C\u200D");
    if (hasInvisibleMarker) {
      setScanResult("BREACH_CONFIRMED: Sovereign Asset Detected");
      setLeakReport({
        origin: "ShieldAI Secure Tunnel",
        risk: "CRITICAL_EXFILTRATION",
        integrity: "AUTHENTIC_SIGNATURE",
        timestamp: new Date().toLocaleString()
      });
    } else {
      setScanResult("EXTERNAL_DATA: No Signature Found");
      setLeakReport({
        origin: "Unknown / Outside Perimeter",
        risk: "NOT_TRACKED",
        integrity: "UNVERIFIED",
        timestamp: "N/A"
      });
    }
  };

  useEffect(() => {
    sirenRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/industrial_alarm_loop.ogg');
    sirenRef.current.loop = true;

    const preventCapture = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 'p' || e.key === 's'))) {
        e.preventDefault();
        navigator.clipboard.writeText("REDACTED_BY_SHIELDAI");
        reportIncident("UNAUTHORIZED_CAPTURE_ATTEMPT");
        return false;
      }
    };
    window.addEventListener('keydown', preventCapture);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    
    socket.on('live-frame', (data) => setLiveFrame(data.image));
    
    return () => {
      window.removeEventListener('keydown', preventCapture);
      window.removeEventListener('contextmenu', (e) => e.preventDefault());
      socket.off('live-frame');
      if(sirenRef.current) sirenRef.current.pause();
    };
  }, []);

  const reportIncident = async (type) => {
    try {
      await axios.post(`${BASE_URL}/api/v1/alert`, { 
        type: type, 
        item: "Data Extraction Blocked",
        severity: "CRITICAL"
      });
      setSecurityScore(prev => Math.max(prev - 20, 10));
    } catch (e) { console.error(e); }
  };

  const toggleVisionSystem = async () => {
    try {
      const targetState = !isVisionOn;
      const response = await axios.post(`${BASE_URL}/api/v1/toggle-vision`, { 
        status: targetState 
      });
      if (response.data.success) {
        setIsVisionOn(targetState);
        if (!targetState) setLiveFrame(null);
      }
    } catch (e) { console.error("Vision Toggle Failure", e); }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/logs`);
      setLogs(response.data);
    } catch (error) { console.error("Log Fetch Error", error); }
  };

  useEffect(() => {
    fetchLogs();
    socket.on('security-alert', (data) => {
      if (data.type === "SILENT_DISTRESS") {
          setIsDeadManActive(true);
          setSecurityScore(15);
          setResult("VAULT_LOCKED: Redirecting exfiltration to HoneyPot_01... [ENCRYPTING_LOCAL_STORAGE]");
          return; 
      }
      const isCrowd = data.count > 2;
      const alertMsg = isCrowd ? "CRITICAL: UNAUTHORIZED GROUP GATHERING (3+ PERSONS)" : data.message;
      setVisualAlert(alertMsg);
      if (data.evidence) setBreachEvidence(data.evidence);
      setSecurityScore(prev => isCrowd ? 0 : Math.max(prev - 30, 0));
      if (sirenRef.current) {
        sirenRef.current.playbackRate = isCrowd ? 1.5 : 1.0;
        sirenRef.current.play().catch(err => console.log("Audio Play Interrupted"));
      }
      setTimeout(() => {
        setVisualAlert(null);
        setBreachEvidence(null);
        setSecurityScore(100);
        if (sirenRef.current) {
          sirenRef.current.pause();
          sirenRef.current.currentTime = 0;
        }
      }, 5000);
    });
    return () => socket.off('security-alert');
  }, []);

  const handleScrub = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/scrub`, {
        prompt: prompt,
        userId: "Authorized_Admin"
      });
      const watermarked = injectWatermark(response.data.secured);
      setResult(watermarked);
      fetchLogs();
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${visualAlert ? 'bg-slate-950' : 'bg-[#fcfdfe]'} p-4 md:p-8 font-sans`}>
      {isDeadManActive && (
        <div className="fixed top-8 right-8 z-[110] animate-bounce">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black tracking-widest border-4 border-white shadow-2xl">
            <Ghost size={16} className="animate-pulse" /> SILENT DISTRESS SIGNAL: ON
          </div>
        </div>
      )}

      {visualAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
          <div className="text-center px-4 max-w-4xl">
            <div className="relative mb-6 flex justify-center">
              <ShieldX size={100} className="text-red-600 animate-pulse" />
            </div>
            {breachEvidence && (
              <div className="mb-8 border-4 border-red-600 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-in zoom-in duration-300">
                <img src={`data:image/jpeg;base64,${breachEvidence}`} alt="Breach Evidence" className="w-full h-auto" />
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4">
                {visualAlert.includes("GROUP") ? "System Lockdown" : "Breach Detected"}
            </h1>
            <p className="text-red-500 font-mono text-sm md:text-lg tracking-[0.3em] uppercase flex items-center justify-center gap-3">
              <AlertOctagon size={24} /> {visualAlert}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative group">
             {isVisionOn && liveFrame ? (
               <img src={`data:image/jpeg;base64,${liveFrame}`} className="w-full h-full object-cover opacity-80" alt="Live Intelligence" />
             ) : (
               <div className="flex-1 flex items-center justify-center flex-col gap-4">
                  <Camera size={48} className="text-slate-700" />
                  <span className="text-[10px] font-black text-slate-500 tracking-[0.3em]">SECURE_FEED_OFFLINE</span>
               </div>
             )}
             <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isVisionOn ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{isVisionOn ? 'Live Neural Link' : 'Feed Encrypted'}</span>
             </div>
          </div>

          <div className="md:col-span-1 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4">
                <Gauge size={18} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Integrity Index</span>
             </div>
             <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tracking-tighter ${securityScore > 70 ? 'text-slate-900' : 'text-red-600'}`}>{securityScore}</span>
                <span className="text-slate-300 font-bold text-lg">%</span>
             </div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${securityScore > 70 ? 'bg-blue-600' : 'bg-red-600'}`} style={{ width: `${securityScore}%` }} />
             </div>
          </div>

          <div className="md:col-span-1 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-10"><Network size={120} /></div>
             <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black text-slate-500 uppercase">Core Load: {systemLoad.cpu}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black text-slate-500 uppercase">Vault: {systemLoad.mem}%</span>
                </div>
             </div>
             <div className="text-xs font-black italic tracking-widest text-blue-400 mt-4">Sovereign_OS v2</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
               <div className="p-5 bg-slate-900 rounded-3xl text-white shadow-2xl">
                  <ShieldCheck size={36} />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">ShieldAI <span className="text-blue-600 font-normal">Sovereign</span></h1>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded border border-blue-100 uppercase">Enterprise v2.0</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium tracking-wide mt-2 flex items-center gap-2">
                    <Activity size={14} className={isVisionOn ? "text-green-500 animate-pulse" : "text-slate-300"} /> 
                    {isVisionOn ? "NEURAL MONITORING ACTIVE" : "SYSTEM ON STANDBY"}
                  </p>
               </div>
            </div>
            <button 
              onClick={toggleVisionSystem}
              className={`px-10 py-4 rounded-2xl font-black text-xs transition-all tracking-widest flex items-center gap-3 ${isVisionOn ? 'bg-green-600 text-white shadow-lg shadow-green-100 animate-pulse' : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'}`}
            >
              {isVisionOn ? <ScanEye size={16} /> : <Power size={16} />}
              {isVisionOn ? "VISION LIVE" : "ARM SYSTEM"}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Terminal size={20} className="text-blue-600" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Data Ingress Tunnel</h2>
               </div>
               <Zap size={14} className="text-amber-400 animate-pulse" />
            </div>
            <textarea 
              className="w-full h-72 p-0 bg-transparent border-none focus:ring-0 text-slate-700 text-xl placeholder:text-slate-200 font-medium resize-none"
              placeholder="Paste raw data stream..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={handleScrub}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-sm tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 flex items-center justify-center gap-3"
            >
              <Fingerprint size={20} /> ANALYZE & WATERMARK
            </button>
          </div>

          <div className="bg-slate-950 p-10 rounded-[2.5rem] shadow-2xl relative border border-slate-800">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Crosshair size={20} className="text-cyan-400" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Sanitized Proxy Egress</h2>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-900 rounded-lg">
                  <SearchCode size={14} className="text-cyan-400" />
                  <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-tighter">QS-Watermark Active</span>
               </div>
            </div>
            <div className="h-72 overflow-auto font-mono text-cyan-400 text-sm leading-relaxed scrollbar-hide">
               {result ? (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">{result}</div>
               ) : (
                 <div className="text-slate-800 font-mono tracking-widest flex items-center gap-2">
                    <Radio size={14} className="animate-pulse" /> AWAITING_PAYLOAD_HANDSHAKE...
                 </div>
               )}
            </div>
            <div className="mt-10 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono italic">
               <div className="flex gap-4">
                 <span>TLS_1.3_SECURED</span>
                 <span>AES_256_GCM</span>
               </div>
               <div className="flex items-center gap-2 text-cyan-500 not-italic font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                 Active Proxy
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Binary size={20} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Forensic Data Origin Scanner</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <textarea 
                      className="w-full h-40 bg-slate-50 border-none rounded-3xl p-6 text-sm font-mono text-slate-600 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300"
                      placeholder="Paste suspicious text fragment to trace forensic signature..."
                      value={scanText}
                      onChange={(e) => setScanText(e.target.value)}
                  />
                  <button 
                      onClick={verifyWatermark}
                      className="w-full bg-purple-600 text-white py-5 rounded-2xl text-xs font-black tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-purple-700 transition-all shadow-xl shadow-purple-100"
                  >
                      <ClipboardCheck size={18} /> INITIATE FORENSIC SCAN
                  </button>
                </div>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-dashed border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Terminal size={12} /> Scan Report
                  </h4>
                  {leakReport ? (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Verdict</p>
                          <p className={`text-sm font-black ${scanResult.includes("AUTHENTIC") ? 'text-green-600' : 'text-red-600'}`}>
                            {scanResult.split(':')[0]}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Asset Origin</p>
                          <p className="text-xs font-bold text-slate-700">{leakReport.origin}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${scanResult.includes("AUTHENTIC") ? 'bg-green-500 animate-ping' : 'bg-slate-300'}`}></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{leakReport.integrity}</span>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-4">
                        <ScanEye size={32} className="text-slate-200 mb-2" />
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">Awaiting input for<br/>Forensic Handshake</p>
                    </div>
                  )}
                </div>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Database size={20} className="text-blue-600" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Compliance Audit Ledger</h2>
             </div>
             <button onClick={fetchLogs} className="group p-3 hover:bg-slate-50 rounded-full transition-all">
               <RefreshCw size={18} className="text-slate-300 group-hover:rotate-180 transition-all duration-500" />
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                    <th className="px-12 py-5 font-black">Event Timestamp</th>
                    <th className="px-12 py-5 font-black">Subject Identity</th>
                    <th className="px-12 py-5 font-black">Vector Source</th>
                    <th className="px-12 py-5 font-black">Status Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log._id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-12 py-6 text-[11px] font-mono text-slate-400 italic">
                        <div className="flex items-center gap-2">
                          <Clock size={12} /> {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-12 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                               <UserCheck size={14} />
                            </div>
                            <span className="text-xs font-black text-slate-800 tracking-tight">{log.userId}</span>
                         </div>
                      </td>
                      <td className="px-12 py-6">
                         <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 w-fit">
                           {log.userId === "Extension_User" ? <Smartphone size={10}/> : <Shield size={10}/>}
                           {log.userId === "Extension_User" ? "Endpoint_Agent" : "Admin_Console"}
                         </span>
                      </td>
                      <td className="px-12 py-6">
                         <div className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${log.threatsDetected.length > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                           {log.threatsDetected.length > 0 ? <Users size={10} /> : <ShieldCheck size={10} />}
                           {log.threatsDetected.length > 0 ? 'MULTIPLE_PERSONS' : 'CLEAN_PASS'}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}