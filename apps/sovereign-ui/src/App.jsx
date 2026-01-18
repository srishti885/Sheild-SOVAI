import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
//import { io } from 'socket.io-client';
import VisionLogic from './VisionLogic';
import { 
  LayoutDashboard, Camera, ShieldAlert, Settings, 
  LogOut, Activity, Users, CreditCard, Globe, Headset,
  ShieldCheck, AlertOctagon, Terminal, Cpu, Database, Github, Twitter, Linkedin, ChevronRight, X, FileSearch,
  Fingerprint, Shield, PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE IMPORTS ---
import { db } from './firebase';
import { ref, onValue, push, set } from "firebase/database";

// Core Components Imports
import MobileRegistration from './components/MobileRegistration';

import DashboardView from './components/DashboardView';
import LiveMonitor from './components/LiveMonitor';
import IncidentVault from './components/IncidentVault';
import SettingsView from './components/SettingsView';
import LandingPage from './components/LandingPage';
import HealthView from './components/HealthView';
import TeamView from './components/TeamView';
import BillingView from './components/BillingView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import GovernanceView from './components/GovernanceView';
import AuditDashboard from './components/AuditDashboard';
import DemoPage from './components/DemoPage';

//const socket = io('http://localhost:5000');

// --- 1. THE ROOT CONSOLE ---
const RootConsoleModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { t: ">>> KERNEL_SHIELD_V4.2_BOOT: SUCCESS", type: "system" },
    { t: ">>> AUTHORIZED_OPERATOR: Designed by SRISHTI_GOENKA", type: "success" },
    { t: ">>> READY_FOR_UPLINK...", type: "info" }
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const autoMessages = ["Bypassing_Firewall...", "Injecting_Neural_Patch...", "Shield_Integrity: 99.9%"];
    const timer = setInterval(() => {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
      setLogs(prev => [...prev.slice(-15), { t: `[AUTO] ${msg}`, type: "info" }]);
    }, 2500);
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === 'exit') onClose();
    setLogs([...logs, { t: `root@shieldai:~# ${input}`, type: "user" }]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-10">
          <motion.div className="w-full max-w-5xl h-[600px] bg-[#020202] border border-blue-500/20 rounded-[3rem] flex flex-col overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-blue-500 tracking-[0.4em] uppercase">Shield_Root_Console</span>
              <button onClick={onClose}><X size={20} className="text-white"/></button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto font-mono text-sm space-y-3 custom-scrollbar">
              {logs.map((l, i) => <p key={i} className={l.type === 'user' ? 'text-white' : 'text-blue-500'}>{l.t}</p>)}
            </div>
            <form onSubmit={handleCommand} className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
              <input autoFocus className="bg-transparent outline-none text-white w-full font-mono" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="execute_protocol..." />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- 2. MAIN SYSTEM CORE ---
function MainDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation(); // To track where we are

  const [liveFrame, setLiveFrame] = useState(null);
  const [visualAlert, setVisualAlert] = useState(null);
  const [breachEvidence, setBreachEvidence] = useState(null);
  const [securityScore, setSecurityScore] = useState(100);
  const [forensicLogs, setForensicLogs] = useState([]); 

  const sendToAudit = async (action, type, status) => {
    try {
      const auditRef = ref(db, 'security_logs');
      await set(push(auditRef), {
        identity: "ADMIN_SRISHTI",
        type, status, timestamp: new Date().toISOString(), activity: action
      });
    } catch (e) { console.warn("Audit Sync Failed"); }
  };

  // --- 🔥 UPDATED SYNC LOGIC (TOUCH-FREE INTEGRATION) ---
  useEffect(() => {
    // 1. Check Mobile Sync Sessions
    const syncId = localStorage.getItem('active_sync_id');
    if (syncId) {
      const syncRef = ref(db, `sync_sessions/${syncId}`);
      onValue(syncRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.status === 'COMPLETED') {
          setIsAuthorized(true);
          setActiveTab('LIVE');
          sendToAudit(`Identity Verified: ${data.name}`, "BIO_AUTH", "SUCCESS");
        }
      });
    }

    // 2. Keep the original Admin Approval listener
    const authRef = ref(db, 'access_requests');
    onValue(authRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach(request => {
          if (request.status === 'APPROVED') setIsAuthorized(true);
        });
      }
    });
  }, []);

  const handleSystemStart = () => {
    setIsInitializing(true);
    setTimeout(() => { 
      setIsAuthorized(true); 
      setIsInitializing(false); 
      setActiveTab('LIVE'); 
      sendToAudit("System Booted", "SYSTEM_EVENT", "SUCCESS");
    }, 2000); 
  };

  const navItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={18}/>, label: 'OVERVIEW' },
    { id: 'LIVE', icon: <Camera size={18}/>, label: 'VISION' },
    { id: 'VAULT', icon: <ShieldAlert size={18}/>, label: 'FORENSICS' },
    { id: 'AUDIT_LOGS', icon: <FileSearch size={18}/>, label: 'AUDIT_LOGS', path: '/audit' },
    { id: 'DEMO', icon: <PlayCircle size={18}/>, label: 'SANDBOX', path: '/demo' },
    { id: 'HEALTH', icon: <Activity size={18}/>, label: 'NODES' },
    { id: 'TEAM', icon: <Users size={18}/>, label: 'TEAM' },
    { id: 'GOVERNANCE', icon: <ShieldCheck size={18}/>, label: 'COMPLIANCE' },
    { id: 'BILLING', icon: <CreditCard size={18}/>, label: 'BILLING' },
    { id: 'ABOUT', icon: <Globe size={18}/>, label: 'VISION/ABOUT' },
    { id: 'CONTACT', icon: <Headset size={18}/>, label: 'SUPPORT' },
    { id: 'SETTINGS', icon: <Settings size={18}/>, label: 'CONFIG' },
  ];

  if (!isAuthorized && location.pathname === '/') {
    return <LandingPage onEnter={handleSystemStart} loading={isInitializing} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden text-white font-sans bg-[#020617]">
      <div className="hidden"><VisionLogic /></div>
      
      {visualAlert && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/98 backdrop-blur-3xl border-[20px] border-red-600/10">
          <div className="text-center p-10">
            <AlertOctagon size={140} className="text-red-600 mx-auto mb-8 animate-bounce" />
            <h1 className="text-8xl font-black italic tracking-tighter mb-4 uppercase">Lockdown</h1>
            <p className="text-red-500 font-mono text-xl tracking-[0.4em] uppercase">{visualAlert}</p>
          </div>
        </div>
      )}

      <aside className="w-20 md:w-72 h-full bg-[#030712]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col py-10 z-20">
        <div className="px-8 flex items-center gap-5 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-xl">S</div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-black tracking-tighter italic uppercase">Sovereign</h1>
            <p className="text-[8px] text-blue-400 font-black tracking-[0.4em] uppercase">Neural_Core_v4.2</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { 
                if(item.path) navigate(item.path);
                else setActiveTab(item.id); 
              }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all group ${activeTab === item.id ? 'bg-blue-600' : 'text-slate-500 hover:text-white'}`}>
              {item.icon}
              <span className="hidden md:block text-[10px] font-black tracking-[0.2em] uppercase italic">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-[#020617]">
        <div className="max-w-7xl mx-auto px-10 py-12 pb-44">
          {activeTab === 'DASHBOARD' && <DashboardView securityScore={securityScore} />}
          {activeTab === 'LIVE' && <LiveMonitor liveFrame={liveFrame} />}
          {activeTab === 'VAULT' && <IncidentVault logs={forensicLogs} />}
          {activeTab === 'HEALTH' && <HealthView />}
          {activeTab === 'TEAM' && <TeamView />}
          {activeTab === 'BILLING' && <BillingView />}
          {activeTab === 'GOVERNANCE' && <GovernanceView />}
          {activeTab === 'ABOUT' && <AboutView />}
          {activeTab === 'CONTACT' && <ContactView />}
          {activeTab === 'SETTINGS' && <SettingsView />}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-[#010309]/95 backdrop-blur-3xl border-t border-white/10 p-6 z-[100] px-12 flex items-center justify-between">
          <button onClick={() => setIsAuthorized(false)} className="text-red-600/40 hover:text-red-500 font-black text-[10px] tracking-[0.3em] uppercase italic flex items-center gap-3">
            <LogOut size={16} /> Terminate_Session
          </button>
          <h3 className="text-xl font-black italic tracking-tighter uppercase">SHIELD<span className="text-blue-500">AI</span></h3>
          <button onClick={() => setIsConsoleOpen(true)} className="bg-white text-black text-[10px] font-black px-10 py-3 rounded-full uppercase tracking-[0.2em]">
            Root_Console
          </button>
        </footer>
      </main>
      <RootConsoleModal isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
    </div>
  );
}

// --- 3. GLOBAL ROUTER WRAPPER ---
export default function App() {
  return (
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/audit" element={<AuditDashboard />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<MainDashboard />} />
        <Route path="/mobile-reg" element={<MobileRegistration />} />
      </Routes>
  );
}