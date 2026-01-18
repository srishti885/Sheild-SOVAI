import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Fingerprint, ShieldCheck, UserPlus, ShieldAlert, Activity, 
  Globe, Map, Terminal, Github, Twitter, Linkedin, Search, Trash2, 
  ShieldX, X, Plus, CheckCircle2, AlertCircle, FileDown, BarChart3, PieChart as PieIcon
} from 'lucide-react';
// Adding Recharts for the new visual analytics feature
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function TeamView() {
  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [operators, setOperators] = useState([
    { id: '1021', name: 'Dr. Sovereign', role: 'System Architect', status: 'Authorized', loc: 'Node_01', lastActive: 'Now' },
    { id: '4492', name: 'Admin_Node_02', role: 'Security Ops', status: 'Pending', loc: 'Node_04', lastActive: '5m ago' },
    { id: '0012', name: 'Cyber_Ghost', role: 'Pen-Tester', status: 'Authorized', loc: 'Node_09', lastActive: '12m ago' },
  ]);

  // New Operator Form State
  const [newOp, setNewOp] = useState({ name: '', role: '', loc: 'Remote' });

  // --- NODE.JS BACKEND INTEGRATION ---
  const API_URL = "http://localhost:5000/api/operators";

  // --- NEW FEATURE: EXPORT TO EXCEL/CSV (Added without touching original logic) ---
  const exportRegistryData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Role,Status,Location\n"
      + operators.map(o => `${o.id},${o.name},${o.role},${o.status},${o.loc}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ShieldAI_Registry_2026.csv");
    document.body.appendChild(link);
    link.click();
    
    // Add a log for the export action
    const exportLog = { id: Date.now(), text: `DATA_EXPORT: SHIELDAI_REGISTRY_CSV`, time: new Date().toLocaleTimeString() };
    setLogs(prev => [exportLog, ...prev].slice(0, 6));
  };

  // Fetch Data on Load - CONNECTED TO REAL ROUTE
  const fetchOperators = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setOperators(data.length > 0 ? data : operators); // Fallback to initial if empty
      }
      setLoading(false);
    } catch (err) {
      console.error("Node Backend offline, using mock data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  // Live Audit Logs Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ["AUTH_SYNC", "ENCRYPT_HB", "NODE_ACCESS", "KEY_ROTATION"];
      const newLog = {
        id: Date.now(),
        text: `${actions[Math.floor(Math.random()*actions.length)]}: Node_0${Math.floor(Math.random()*9)+1}`,
        time: new Date().toLocaleTimeString()
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS - CONNECTED TO REAL ROUTE ---
  const handleAddOperator = async (e) => {
    e.preventDefault();
    const operatorData = {
      ...newOp,
      id: Math.floor(Math.random() * 9000 + 1000).toString(),
      status: 'Authorized',
      lastActive: 'Now'
    };

    // UI Update
    setOperators([operatorData, ...operators]);
    setLogs([{ id: Date.now(), text: `NEW_PERSONNEL: ${operatorData.name}`, time: 'Now' }, ...logs]);
    
    // Node.js Post Request
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operatorData)
      });
    } catch (e) { console.error("DB Save failed, local state only."); }

    setShowModal(false);
    setNewOp({ name: '', role: '', loc: 'Remote' });
  };

  const deleteOperator = async (id) => {
    setOperators(operators.filter(op => op.id !== id));
    setLogs([{ id: Date.now(), text: `REVOKED_ACCESS: ID_${id}`, time: 'Now' }, ...logs]);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) { console.error("DB Delete failed."); }
  };

  const toggleStatus = (id) => {
    setOperators(operators.map(op => 
      op.id === id ? { ...op, status: op.status === 'Authorized' ? 'Pending' : 'Authorized' } : op
    ));
  };

  const filteredOps = useMemo(() => {
    return operators.filter(op => 
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, operators]);

  // --- NEW: CHART DATA CALCULATION ---
  const chartData = useMemo(() => {
    const authCount = operators.filter(o => o.status === 'Authorized').length;
    const pendCount = operators.filter(o => o.status === 'Pending').length;
    return [
      { name: 'Authorized', value: authCount, color: '#3b82f6' },
      { name: 'Pending', value: pendCount, color: '#f97316' }
    ];
  }, [operators]);

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 py-10 px-4 relative">
      
      {/* --- ADD OPERATOR MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#0a0a0a] border border-blue-500/30 w-full max-w-md rounded-[3rem] p-10 shadow-[0_0_50px_rgba(37,99,235,0.2)] animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-8 text-slate-500 hover:text-white"><X /></button>
            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-8">Register <span className="text-blue-500">Personnel</span></h3>
            
            <form onSubmit={handleAddOperator} className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Full Name</label>
                <input required type="text" value={newOp.name} onChange={e => setNewOp({...newOp, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Agent Smith" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Designation</label>
                <input required type="text" value={newOp.role} onChange={e => setNewOp({...newOp, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Security Analyst" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                <Plus size={16}/> CONFIRM REGISTRATION
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="border-l-4 border-blue-500 pl-6">
          <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase leading-tight">Personnel <span className="text-blue-500">Registry</span></h2>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase mt-2">Biometric Clearance Level: OMEGA</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={exportRegistryData} className="bg-white/5 border border-white/10 text-slate-400 px-6 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3">
            <FileDown size={16}/> EXPORT CSV
          </button>
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input type="text" placeholder="SEARCH..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-[10px] font-black text-white focus:outline-none focus:border-blue-500 transition-all w-full md:w-64" />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center gap-3">
            <UserPlus size={16}/> ADD OPERATOR
          </button>
        </div>
      </div>

      {/* --- NEW: VISUAL ANALYTICS DASHBOARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 animate-in slide-in-from-bottom-4 duration-1000">
        <div className="lg:col-span-2 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 h-[300px]">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={18} className="text-blue-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Personnel Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center gap-3 mb-6">
            <PieIcon size={18} className="text-purple-500" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Clearance Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4">
             {chartData.map(d => (
               <div key={d.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">{d.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Sessions', val: '24', icon: <Activity className="text-blue-500"/> },
          { label: 'Verified ID', val: operators.length, icon: <ShieldCheck className="text-green-500"/> },
          { label: 'Access Requests', val: operators.filter(o => o.status === 'Pending').length, icon: <ShieldAlert className="text-red-500"/> },
          { label: 'Node Distribution', val: 'Global', icon: <Globe className="text-purple-500"/> }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white italic mt-1">{stat.val}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOps.map((user) => (
              <div key={user.id} className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center border border-white/10 group-hover:border-blue-500 transition-all">
                    <Fingerprint className={user.status === 'Authorized' ? 'text-blue-500' : 'text-orange-500'} size={32}/>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span onClick={() => toggleStatus(user.id)} className={`text-[8px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-all ${user.status === 'Authorized' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>{user.status}</span>
                    <button onClick={() => deleteOperator(user.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
                <h4 className="text-xl font-black text-white italic uppercase">{user.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">{user.role}</p>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-400">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.status === 'Authorized' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                      {user.loc}
                   </div>
                   <span className="bg-black/40 px-3 py-1 rounded-lg">ID: #{user.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-[3rem] bg-blue-600/5 border border-blue-500/10">
              <div className="flex items-center gap-3 mb-8"><Terminal size={20} className="text-blue-500" /><h3 className="text-xs font-black text-white uppercase tracking-widest italic">Live Audit Trail</h3></div>
              <div className="space-y-6">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-4 border-l-2 border-blue-500/30 pl-4 pb-2 animate-in slide-in-from-top-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                    <div><p className="text-[9px] font-black text-white uppercase">{log.text}</p><p className="text-[8px] text-slate-500 font-bold mt-0.5">{log.time}</p></div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-20 pb-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
        <p className="text-[9px] font-black text-slate-600 uppercase">© 2026 SHIELDAI TEAM REGISTRY // NODE_JS_CONNECTED</p>
        <div className="flex gap-4 text-slate-600"><Github size={16}/><Twitter size={16}/><Linkedin size={16}/></div>
      </footer>
    </div>
  );
}