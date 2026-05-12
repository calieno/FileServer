import { useEffect, useState } from 'react';
import { HardDrive, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { DiskInfo } from '../types';

export default function DiskManagement() {
  const [disks, setDisks] = useState<DiskInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/system/disk')
      .then(res => res.json())
      .then(data => {
        setDisks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar discos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <HardDrive size={120} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">Estado dos Discos Físicos</h2>
          
          <div className="space-y-6">
            {disks.map((disk, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-bold text-lg">{disk.device}</p>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Montado em {disk.mount}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Saudável</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white/60">Uso de Espaço</span>
                    <span className="text-white">{disk.usePercent}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: disk.usePercent }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className={`h-full rounded-full ${
                        parseInt(disk.usePercent) > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-primary to-blue-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-white/30 uppercase tracking-widest">
                    <span>{disk.used} Usados</span>
                    <span>{disk.avail} Disponíveis de {disk.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Summary */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[40px] bg-gradient-to-br from-primary/20 to-purple-500/10 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Performance IO</h3>
            <p className="text-white/40 text-sm mb-6">Velocidade média de leitura/escrita nos volumes Samba.</p>
            <div className="text-3xl font-black text-white">450 <span className="text-sm font-normal text-white/40">MB/s</span></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 border border-orange-500/30">
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Alertas S.M.A.R.T.</h3>
            <p className="text-white/40 text-sm mb-4">Nenhum erro crítico detectado nas últimas 24 horas.</p>
            <button className="text-xs font-bold text-primary hover:underline underline-offset-4">Ver Relatório Completo →</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
