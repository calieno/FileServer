import { Database, TrendingUp, RefreshCw, ShieldAlert, Upload, Trash2, Edit3, MoreVertical } from 'lucide-react';
import type { StorageStat, ActivityLog, SecurityEvent } from '../types';
import { motion } from 'motion/react';

const storageStats: StorageStat[] = [
  { name: 'Primary SSD Array (RAID 10)', used: '1.4TB', total: '1.6TB', percentage: 84 },
  { name: 'Archive HDD Volume (SATA III)', used: '8.2TB', total: '24TB', percentage: 34 },
];

const securityEvents: SecurityEvent[] = [
  { id: '1', title: 'Multiple Failed Logins', description: 'IP: 192.168.1.104 - 12 attempts', timeLabel: '2 mins ago', type: 'error' },
  { id: '2', title: 'Permission Escalation', description: "User 'j.smith' modified 'Accounting'", timeLabel: '45 mins ago', type: 'warning' },
  { id: '3', title: 'New SSH Key Added', description: 'Administrator verified: Key-ED25519', timeLabel: '3 hours ago', type: 'info' },
];

const activityLogs: ActivityLog[] = [
  { id: '1', user: 'alice.martinez', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', operation: 'Batch Upload', filePath: '/projects/alpha/design_specs.zip', status: 'COMPLETE', timestamp: '14:22:10' },
  { id: '2', user: 'robert.brown', userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop', operation: 'File Deleted', filePath: '/temp/cached_v3_old.tmp', status: 'SUCCESS', timestamp: '14:15:55' },
  { id: '3', user: 'sam.kim', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', operation: 'Permissions Change', filePath: '/finance/q4_projections.xlsx', status: 'AUDITED', timestamp: '13:40:02' },
];

export default function Dashboard() {
  return (
    <div id="dashboard-content" className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Overview</h2>
          <p className="text-white/60 font-medium">Real-time status of Node-04 Enterprise File Server</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-white/20 bg-white/5 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors shadow-sm">Generate Report</button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/20">Server Maintenance</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Storage Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Storage Distribution</h3>
            <div className="flex items-center gap-2 text-primary font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <Database size={14} />
              84% Capacity
            </div>
          </div>

          <div className="space-y-8">
            {storageStats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-white/70">{stat.name}</span>
                  <span className="text-xs font-mono font-bold text-white/50 tracking-wider">
                    {stat.used} <span className="opacity-40">/</span> {stat.total}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full rounded-full ${i === 0 ? 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/20'}`}
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              {[
                { label: 'Active Users', value: '128', trend: '+12%', Icon: TrendingUp, trendClass: 'text-primary' },
                { label: 'Daily I/O', value: '42.8 GB', trend: 'Healthy', Icon: RefreshCw, trendClass: 'text-white/40' },
                { label: 'Avg Latency', value: '4.2ms', trend: 'Excellent', Icon: Database, trendClass: 'text-white/60' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <div className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${item.trendClass}`}>
                    <item.Icon size={12} strokeWidth={3} />
                    {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Pulse */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="col-span-12 lg:col-span-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Security Pulse</h3>
            <div className="p-2 bg-accent/10 text-accent rounded-xl border border-accent/20">
              <ShieldAlert size={20} />
            </div>
          </div>
          
          <div className="space-y-4 flex-grow">
            {securityEvents.map((event) => (
              <div 
                key={event.id} 
                className={`flex gap-4 items-start p-4 rounded-2xl border transition-all ${
                  event.type === 'error' 
                    ? 'bg-accent/10 border-accent/20 hover:bg-accent/20' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                  event.type === 'error' ? 'bg-accent animate-pulse' : 
                  event.type === 'warning' ? 'bg-amber-500' : 'bg-primary'
                }`} />
                <div>
                  <p className={`text-sm font-bold ${event.type === 'error' ? 'text-accent' : 'text-white'}`}>{event.title}</p>
                  <p className="text-xs text-white/50 font-medium mt-1">{event.description}</p>
                  <span className="text-[10px] font-mono font-bold text-white/30 mt-2 block uppercase tracking-widest">{event.timeLabel}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-8 w-full py-2.5 text-white text-sm font-bold border border-white/20 rounded-2xl hover:bg-white/5 transition-all">
            View Threat Map
          </button>
        </motion.div>

        {/* Activity Log */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Activity Log</h3>
            <select className="bg-transparent border-none text-xs font-bold text-white/50 outline-none cursor-pointer hover:text-white transition-colors">
              <option>All Operations</option>
              <option>Uploads</option>
              <option>Deletions</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/40">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Operation</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">File Path</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Timestamp</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={log.userAvatar} alt="" className="w-7 h-7 rounded-full border border-white/20 shadow-lg" />
                        <span className="text-sm font-semibold text-white">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                        {log.operation === 'Batch Upload' && <Upload size={14} className="text-primary" />}
                        {log.operation === 'File Deleted' && <Trash2 size={14} className="text-accent" />}
                        {log.operation === 'Permissions Change' && <Edit3 size={14} className="text-slate-400" />}
                        <span>{log.operation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-white/40 font-bold">
                      {log.filePath}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                        log.status === 'COMPLETE' ? 'bg-primary/20 text-primary border border-primary/20' :
                        log.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-white/30 font-medium">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-white/20 hover:text-white transition-colors rounded-lg group-hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm flex justify-center">
            <button className="text-xs font-bold text-white/60 hover:text-white hover:underline underline-offset-4 tracking-tight transition-all">
              View Full Audit Logs
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
