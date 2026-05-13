import { Database, TrendingUp, RefreshCw, ShieldAlert, Upload, Trash2, Edit3, MoreVertical, Activity } from 'lucide-react';
import type { StorageStat, ActivityLog, SecurityEvent, DiskInfo } from '../types';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const securityEvents: SecurityEvent[] = [
  { id: '1', title: 'Falhas de Login Múltiplas', description: 'IP: 192.168.1.104 - 12 tentativas', timeLabel: '2 min atrás', type: 'error' },
  { id: '2', title: 'Escalação de Privilégio', description: "Usuário 'j.smith' modificou 'Contabilidade'", timeLabel: '45 min atrás', type: 'warning' },
  { id: '3', title: 'Nova Chave SSH Adicionada', description: 'Administrador verificado: Key-ED25519', timeLabel: '3 horas atrás', type: 'info' },
];

const activityLogs: ActivityLog[] = [
  { id: '1', user: 'alice.martinez', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', operation: 'Batch Upload', filePath: '/projects/alpha/design_specs.zip', status: 'COMPLETE', timestamp: '14:22:10' },
  { id: '2', user: 'robert.brown', userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop', operation: 'File Deleted', filePath: '/temp/cached_v3_old.tmp', status: 'SUCCESS', timestamp: '14:15:55' },
  { id: '3', user: 'sam.kim', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', operation: 'Permissions Change', filePath: '/finance/q4_projections.xlsx', status: 'AUDITED', timestamp: '13:40:02' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [disks, setDisks] = useState<DiskInfo[]>([]);

  useEffect(() => {
    // Fetch disk details (legacy)
    fetch('/api/system/disk')
      .then(res => res.json())
      .then(data => setDisks(data))
      .catch(err => console.error(err));

    // Fetch comprehensive stats
    const fetchStats = () => {
      fetch('/api/system/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Update every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="dashboard-content" className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Visão Geral do Sistema</h2>
          <p className="text-white/60 font-medium">Status em tempo real do Servidor de Arquivos Debian 11</p>
        </div>
        <div className="flex gap-2 text-xs font-mono text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          UPTIME: <span className="text-primary font-bold">{stats?.uptime || '---'}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Real-time Metrics */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {[
            { label: 'Uso de CPU', value: (stats?.cpu || '0') + '%', trend: 'Healthy', Icon: Activity, color: 'text-primary' },
            { label: 'Memória RAM', value: stats?.memory?.percent + '%', trend: `${stats?.memory?.used} / ${stats?.memory?.total}`, Icon: RefreshCw, color: 'text-white' },
            { label: 'Disco (Root)', value: stats?.disk?.percent + '%', trend: `${stats?.disk?.used} usados`, Icon: Database, color: 'text-white' },
            { label: 'Rede (RX/TX)', value: stats?.network?.rx || '0', trend: stats?.network?.tx || '0', Icon: TrendingUp, color: 'text-accent' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{item.label}</p>
                <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                  <item.Icon size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">{item.value}</p>
              <p className="text-xs font-medium text-white/40">{item.trend}</p>
              
              <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: item.value.includes('%') ? item.value : '50%' }}
                  className={`h-full ${item.color.replace('text-', 'bg-')}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Storage Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Partições do Sistema</h3>
            <div className="flex items-center gap-2 text-primary font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <Database size={14} />
              {stats?.disk?.percent || '0'}% em Uso
            </div>
          </div>

          <div className="space-y-8">
            {disks.map((disk, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-white/70">{disk.device} ({disk.mount})</span>
                  <span className="text-xs font-mono font-bold text-white/50 tracking-wider">
                    {disk.used} <span className="opacity-40">/</span> {disk.size}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: disk.usePercent }}
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
            <h3 className="text-lg font-bold text-white">Pulso de Segurança</h3>
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
            Ver Mapa de Ameaças
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
            <h3 className="text-lg font-bold text-white">Log de Atividades Recentes</h3>
            <select className="bg-transparent border-none text-xs font-bold text-white/50 outline-none cursor-pointer hover:text-white transition-colors">
              <option>Todas as Operações</option>
              <option>Uploads</option>
              <option>Exclusões</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/40">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Usuário</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Operação</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Caminho do Arquivo</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest">Horário</th>
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
              Ver Logs de Auditoria Completos
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
