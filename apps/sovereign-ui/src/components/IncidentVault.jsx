import React, { useState, useEffect, useMemo } from 'react';
import { Eye, ShieldAlert, Cpu, HardDrive, Download, Fingerprint, Image as ImageIcon, X, Activity, Database, Server, Github, Twitter, Linkedin, Terminal, ShieldCheck, Lock, Trash2, Search, Share2, AlertTriangle, CheckCircle2, ScanFace, Zap, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// Firebase imports
import { db } from '../firebase'; 
import { ref, onValue, remove, query, orderByChild, equalTo } from "firebase/database"; // Added query utils

export default function IncidentVault({ breachEvidence }) {
  const [capturedIncidents, setCapturedIncidents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [discoveredEvidence, setDiscoveredEvidence] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(false);

  // --- UPDATED: FIREBASE SELECTIVE SYNC (No lines removed) ---
  useEffect(() => {
    // 1. Determine User Role & Identity
    const currentSession = localStorage.getItem('sov_session_id');
    const loggedInUID = localStorage.getItem('user_uid'); // For registered users
    const isAdmin = localStorage.getItem('user_role') === 'ADMIN'; 

    const accessRequestsRef = ref(db, 'security_logs'); 
    
    // 2. Apply Filter Logic (Multi-User Support)
    let vaultQuery;
    if (isAdmin) {
      vaultQuery = accessRequestsRef; // Admin sees everything
    } else if (loggedInUID) {
      // Registered User: Filter by userID
      vaultQuery = query(accessRequestsRef, orderByChild('userID'), equalTo(loggedInUID));
    } else {
      // Guest User: Filter by sessionID
      vaultQuery = query(accessRequestsRef, orderByChild('sessionID'), equalTo(currentSession || 'GUEST_UNDEFINED'));
    }

    const unsubscribe = onValue(vaultQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseIncidents = Object.keys(data).map(key => ({
          id: key.substring(1, 8).toUpperCase(),
          firebaseKey: key,
          type: data[key].type || 'Security Log',
          time: new Date(data[key].timestamp).toLocaleTimeString(),
          risk: data[key].status === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM',
          conf: '100%',
          status: data[key].status || 'LOGGED',
          vector: data[key].sessionID ? `SID: ${data[key].sessionID.substring(0,8)}` : 'REMOTE_NODE',
          img: data[key].photo
        }));
        setCapturedIncidents(firebaseIncidents);
      } else {
        setCapturedIncidents([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const chartData = [
    { name: 'Critical', value: 45, color: '#ef4444' },
    { name: 'High', value: 25, color: '#f97316' },
    { name: 'Low', value: 30, color: '#3b82f6' },
  ];

  const staticIncidents = useMemo(() => [
    { id: 'SEC-091', type: 'Buffer Overflow Attempt', time: '14:20:05', risk: 'CRITICAL', conf: '98.2%', status: 'Quarantined', vector: 'PORT_8080', img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&auto=format&fit=crop" },
    { id: 'SEC-088', type: 'Brute Force Signature', time: '12:15:30', risk: 'HIGH', conf: '85.4%', status: 'Logged', vector: 'SSH_AUTH', img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop" },
    { id: 'SEC-082', type: 'Packet Sniffing Det.', time: '09:45:12', risk: 'MEDIUM', conf: '91.0%', status: 'Suppressed', vector: 'WLAN_INT', img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop" },
  ], []);

  // DOWNLOAD FUNCTION FIX
  const handleDownload = (e, imgSource) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); 
    }
    try {
      const link = document.createElement('a');
      link.href = imgSource.startsWith('data') || imgSource.startsWith('http') ? imgSource : `data:image/jpeg;base64,${imgSource}`;
      link.download = `SHIELD_IMAGE_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("IMAGE SAVED TO DOWNLOADS");
    } catch (err) { showToast("DOWNLOAD ERROR"); }
  };

  useEffect(() => {
    if (autoDeleteEnabled && capturedIncidents.length > 0) {
      const timer = setTimeout(() => {
        showToast("AUTO-PURGE SIMULATED");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [capturedIncidents, autoDeleteEnabled]);

  const exportVault = () => {
    setIsExporting(true);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allIncidents));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vault_export_" + new Date().getTime() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setTimeout(() => { setIsExporting(false); showToast("VAULT ARCHIVE EXPORTED"); }, 1000);
  };

  const deleteIncident = async (e, id, firebaseKey) => {
    e.stopPropagation();
    if (window.confirm(`⚠️ PURGE ${id}?`)) {
      if (firebaseKey) {
        await remove(ref(db, `security_logs/${firebaseKey}`)); // Updated path
      }
      setDiscoveredEvidence(prev => prev.filter(item => item.id !== id));
      showToast(`ARCHIVE ${id} PURGED`);
    }
  };

  const shareIncident = (e, log) => {
    e.stopPropagation();
    const text = `SHIELD_AI BREACH REPORT: [${log.id}] Type: ${log.type}`;
    navigator.clipboard.writeText(text);
    showToast("REPORT COPIED TO CLIPBOARD");
  };

  useEffect(() => {
    const fetchRealEvidence = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/vault-discovery');
        const data = await response.json();
        if (data && Array.isArray(data)) setDiscoveredEvidence(data);
      } catch (err) {
        if (discoveredEvidence.length === 0) {
            setDiscoveredEvidence([{ id: 'OFF-001', type: 'Database Shadow Copy', time: 'OFFLINE', risk: 'LOW', conf: '100%', status: 'Local_Cached', vector: 'FALLBACK_NODE', img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" }]);
        }
      }
    };
    fetchRealEvidence();
  }, []);

  const allIncidents = useMemo(() => 
    [...capturedIncidents, ...discoveredEvidence, ...staticIncidents].filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    ), [capturedIncidents, discoveredEvidence, staticIncidents, searchQuery]);

  // UI remains exactly the same as your design
  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 px-4 bg-black text-white relative min-h-screen select-none">
      
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] bg-blue-600 text-white px-8 py-4 rounded-full font-black text-[10px] tracking-widest shadow-2xl uppercase flex items-center gap-2">
          <Zap size={14} /> {toast}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 bg-black p-4 flex items-center justify-center border-r border-white/5 min-h-[400px]">
              <img 
                src={selectedImage.startsWith('data') || selectedImage.startsWith('http') ? selectedImage : `data:image/jpeg;base64,${selectedImage}`} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                alt="Evidence"
              />
            </div>
            <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-zinc-950">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <ShieldCheck className="text-emerald-500" size={40} />
                    <button onClick={() => setSelectedImage(null)} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-all shadow-xl active:scale-90">
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-black italic uppercase leading-none tracking-tighter">Forensic_View</h2>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Encrypted forensic stream</p>
                </div>
                <button onClick={(e) => handleDownload(e, selectedImage)} className="w-full py-5 bg-blue-600 rounded-xl text-[10px] font-black tracking-widest text-white uppercase shadow-lg hover:bg-blue-500 transition-all">
                Download_Asset
                </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16 pt-10">
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 font-black text-blue-500 text-[9px] tracking-widest uppercase">
                <Lock size={12} /> Level 4 Clearance
              </div>
              <h2 className="text-8xl font-black italic text-white tracking-tighter uppercase leading-[0.8]">Incident<br/><span className="text-blue-600">Vault</span></h2>
          </div>
          <div className="bg-zinc-950/50 rounded-[2.5rem] border border-white/5 p-6 h-56 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xl font-black italic">98.4%</p>
                <p className="text-[7px] font-black text-slate-600 tracking-widest uppercase">Integrity</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-56">
              <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Intelligence</p>
                  <p className="text-2xl font-black italic text-blue-500">{allIncidents.length + 4800}</p>
              </div>
              <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Storage</p>
                  <p className="text-2xl font-black italic text-emerald-500">1.2TB</p>
              </div>
              <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Threats</p>
                  <p className="text-2xl font-black italic text-red-500">{allIncidents.length}</p>
              </div>
              <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sub-Nodes</p>
                  <p className="text-2xl font-black italic text-purple-500">08</p>
              </div>
          </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center border-l-4 border-blue-600 pl-8 gap-6">
        <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">System_Logs</h3>
        <div className="flex gap-3">
            <button onClick={() => setAutoDeleteEnabled(!autoDeleteEnabled)} className={`px-6 py-4 rounded-2xl text-[10px] font-black border transition-all ${autoDeleteEnabled ? 'bg-red-600/10 border-red-600 text-red-500' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                {autoDeleteEnabled ? "PURGE: ON" : "PURGE: OFF"}
            </button>
            <button onClick={exportVault} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all text-white">
                Export_JSON
            </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#050505] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Vault_Explorer</h3>
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input type="text" placeholder="SEARCH ID..." onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 text-[10px] text-white outline-none" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Confidence</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allIncidents.map((log, index) => (
                <tr key={index} className="group hover:bg-blue-600/[0.03] transition-all">
                  <td className="px-12 py-8 text-[10px] font-mono text-blue-500 font-black">{log.id}</td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:scale-105 transition-all" onClick={() => log.img && setSelectedImage(log.img)}>
                        {log.img ? <img src={log.img.startsWith('data') || log.img.startsWith('http') ? log.img : `data:image/jpeg;base64,${log.img}`} className="w-full h-full object-cover" alt="Log" /> : <ImageIcon size={20} className="m-auto mt-5 text-slate-800"/>}
                      </div>
                      <div>
                        <p className="text-base font-black text-white italic uppercase tracking-tight">{log.type}</p>
                        <p className="text-[9px] text-slate-600 font-black uppercase mt-1 tracking-tighter">{log.vector} • {log.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-center">
                      <span className="text-[10px] font-mono text-blue-400 font-black">{log.conf}</span>
                      <div className="w-20 h-1 bg-white/5 rounded-full mx-auto mt-2"><div className="h-full bg-blue-600" style={{width: log.conf}}></div></div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => log.img && setSelectedImage(log.img)} className="p-4 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Eye size={20}/></button>
                      <button onClick={(e) => log.img && handleDownload(e, log.img)} className="p-4 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"><Download size={20}/></button>
                      <button onClick={(e) => shareIncident(e, log)} className="p-4 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all"><Share2 size={20}/></button>
                      <button onClick={(e) => deleteIncident(e, log.id, log.firebaseKey)} className="p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 size={20}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer remains same */}
      <footer className="pt-24 pb-16 border-t border-white/5 mt-32">
        <div className="flex flex-col lg:flex-row justify-between gap-16">
          <div className="max-w-xl space-y-8">
            <h3 className="text-4xl font-black text-white italic uppercase">ShieldAI <span className="text-blue-600">Vault</span></h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] leading-relaxed">Immutable forensic archive. System hardware signature verified. All access logs are permanent.</p>
            <div className="flex gap-6 text-slate-600">
                <Github size={20} className="hover:text-white cursor-pointer transition-all"/> 
                <Twitter size={20} className="hover:text-white cursor-pointer transition-all"/> 
                <Linkedin size={20} className="hover:text-white cursor-pointer transition-all"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Navigation</h4>
                  <ul className="text-[9px] text-slate-600 space-y-2 font-black uppercase">
                      <li className="hover:text-blue-500 cursor-pointer">Archive_Root</li>
                      <li className="hover:text-blue-500 cursor-pointer">Neural_Stream</li>
                      <li className="hover:text-blue-500 cursor-pointer">API_Control</li>
                  </ul>
              </div>
              <div className="bg-blue-600/5 p-8 rounded-[2rem] border border-blue-500/10 flex flex-col justify-center">
                    <p className="text-[10px] text-blue-500 font-black flex items-center gap-2 uppercase tracking-widest animate-pulse"><Activity size={12}/> Core_Active</p>
                    <p className="text-[8px] text-slate-700 mt-2 font-black uppercase tracking-widest">Secure Sync: 100%</p>
              </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/[0.02] flex justify-between items-center text-[8px] font-black text-slate-800 uppercase tracking-widest">
            <p>© 2026 SHIELD_AI_TECHNOLOGIES</p>
            <p>DESIGN_VERSION_4.0.5</p>
        </div>
      </footer>
    </div>
  );
}