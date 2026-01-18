import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Share2, FileText, Cpu, EyeOff, ShieldAlert, 
  Download, Activity, Mail, CheckCircle2, Zap, Clock, Calendar, Users, X, Bell
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip, XAxis, YAxis } from 'recharts';

export default function GovernanceView() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scrubStats, setScrubStats] = useState({ total: 142, data: [] });
  
  // Scheduler State
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'Weekly',
    recipients: 'compliance-team@company.com',
    includeLogs: true,
    includePrivacy: true
  });

  useEffect(() => {
    const mockLogs = [
      { time: '14:20:01', node: 'Edge-West-01', action: 'NODE_RECONFIG', status: 'SUCCESS' },
      { time: '13:45:12', node: 'Cloud-Gateway', action: 'VAULT_ACCESS', status: 'ENCRYPTED' },
      { time: '12:10:55', node: 'Edge-East-04', action: 'NEURAL_WARMUP', status: 'STABLE' },
    ];
    setAuditLogs(mockLogs);
    setScrubStats({
      total: 142,
      data: [
        { type: 'Emails', count: 45, color: '#3b82f6' },
        { type: 'Phone', count: 32, color: '#6366f1' },
        { type: 'SSN/ID', count: 12, color: '#ef4444' },
        { type: 'Faces', count: 53, color: '#a855f7' }
      ]
    });
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className={`space-y-10 animate-in fade-in duration-700 max-w-6xl mx-auto py-6 pb-32 transition-all ${showScheduler ? 'blur-md scale-[0.98]' : ''}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Enterprise <span className="text-blue-500 text-glow">Governance</span></h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">Status: SOC2 Type II Certified</span>
              <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[8px] text-green-500 font-black">LIVE AUDIT ACTIVE</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <button 
               onClick={() => setShowScheduler(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all shadow-lg shadow-blue-500/5"
             >
                <Clock size={14}/> Config Scheduler
             </button>
             <button 
               onClick={() => { setIsExporting(true); setTimeout(() => { setIsExporting(false); alert("On-demand report generated."); }, 1500); }}
               className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all"
             >
                {isExporting ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <FileText size={14} className="text-white"/>}
                <span className="text-[9px] font-black uppercase tracking-widest text-white">Manual Export</span>
             </button>
          </div>
        </div>

        {/* RISK & PRIVACY CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border-white/5">
            <div className="absolute top-4 right-4 text-orange-500/20"><Zap size={40}/></div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-orange-500" /> AI Risk Guard
            </h4>
            <p className="text-4xl font-black text-white italic">0.02%</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest leading-relaxed">System-wide Threat Neutralization</p>
          </div>

          <div className="lg:col-span-3 glass-card p-8 rounded-[3rem] border-white/5 h-[220px]">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Privacy scrubbing: Real-time intercept</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={scrubStats.data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" stroke="#475569" fontSize={9} width={60} fontWeight="900" tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#000', border: 'none', fontSize: '10px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                  {scrubStats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="glass-card p-10 rounded-[3rem] border-white/5">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <FileText size={16} className="text-blue-500" /> Master Audit Trail
              </h4>
              <div className="flex gap-4 text-[9px] font-black text-slate-500 uppercase">
                <span>Active Nodes: 12</span>
                <span className="text-blue-500">Uptime: 99.9%</span>
              </div>
           </div>
           <div className="space-y-4">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-bold border-b border-white/5 pb-4 last:border-0 hover:bg-white/[0.02] transition-all px-4 py-2 rounded-xl group cursor-default">
                  <span className="text-slate-500 font-mono w-24 group-hover:text-blue-400">{log.time}</span>
                  <span className="text-white uppercase italic tracking-tighter w-32">{log.node}</span>
                  <span className="text-slate-400 uppercase tracking-widest flex-1 font-medium">{log.action}</span>
                  <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter">{log.status}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- USEFUL SCHEDULER SIDE PANEL --- */}
      {showScheduler && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setShowScheduler(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[70] shadow-2xl animate-in slide-in-from-right duration-500 p-8">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Bell size={20}/></div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Report Scheduler</h3>
              </div>
              <button onClick={() => setShowScheduler(false)} className="text-slate-500 hover:text-white transition-colors"><X/></button>
            </div>

            <div className="space-y-8">
              {/* Frequency Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" /> Reporting Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                    <button 
                      key={freq}
                      onClick={() => setScheduleConfig({...scheduleConfig, frequency: freq})}
                      className={`py-2 text-[10px] font-black rounded-lg border transition-all ${scheduleConfig.frequency === freq ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} className="text-blue-500" /> Target Recipients
                </label>
                <input 
                  type="email" 
                  value={scheduleConfig.recipients}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, recipients: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Enter email addresses..."
                />
              </div>

              {/* Data Inclusions */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Include in Report</label>
                <div className="space-y-3">
                  {[
                    { id: 'includeLogs', label: 'Master Audit Logs (JSON/PDF)', icon: <FileText size={14}/> },
                    { id: 'includePrivacy', label: 'PII Scrubbing Analytics', icon: <EyeOff size={14}/> },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">{item.icon}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase">{item.label}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={scheduleConfig[item.id]} 
                        onChange={() => setScheduleConfig({...scheduleConfig, [item.id]: !scheduleConfig[item.id]})}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  alert(`Automation Enabled: ${scheduleConfig.frequency} reports will be sent to ${scheduleConfig.recipients}`);
                  setShowScheduler(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-600/20 mt-4"
              >
                Activate Automation
              </button>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); }
        .text-glow { text-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
      `}} />
    </div>
  );
}