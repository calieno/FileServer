import { useEffect, useState } from 'react';
import { PieChart, UserPlus, Search, ShieldAlert, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { QuotaInfo } from '../types';

export default function QuotaManagement() {
  const [quotas, setQuotas] = useState<QuotaInfo[]>([]);
  const [adUsers, setAdUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [newLimit, setNewLimit] = useState('10');

  useEffect(() => {
    // Buscar cotas
    fetch('http://localhost:3001/api/system/quotas')
      .then(res => res.json())
      .then(data => {
        setQuotas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar cotas:', err);
        setLoading(false);
      });

    // Buscar usuários AD
    fetch('http://localhost:3001/api/ad/users')
      .then(res => res.json())
      .then(data => setAdUsers(data))
      .catch(err => console.error('Erro ao buscar usuários AD:', err));
  }, []);

  const filteredQuotas = quotas.filter(q => 
    q.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuota = () => {
    // Simulação de salvamento
    const newQuota: QuotaInfo = {
      user: newUser,
      used: '0B',
      soft: `${newLimit}GB`,
      hard: `${parseInt(newLimit) + 2}GB`,
      grace: '7 dias'
    };
    setQuotas([...quotas, newQuota]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Usuários com Cota', value: quotas.length, icon: PieChart, color: 'text-primary' },
          { label: 'Espaço Total Alocado', value: '8.4 TB', icon: Save, color: 'text-green-500' },
          { label: 'Ultrapassando Limite', value: '2', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Média por Usuário', value: '42 GB', icon: PieChart, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <stat.icon size={20} className={`${stat.color} mb-3`} />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Quota List */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Cotas de Armazenamento AD</h2>
            <p className="text-white/40 text-sm">Gerencie limites de espaço para usuários e grupos do domínio.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text"
                placeholder="Buscar usuário AD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              <UserPlus size={18} />
              Nova Cota
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Usuário / Grupo AD</th>
                <th className="px-6 py-4">Uso Atual</th>
                <th className="px-6 py-4">Limite Soft</th>
                <th className="px-6 py-4">Limite Hard</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotas.map((quota, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <td className="px-6 py-5 first:rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white/60 font-bold border border-white/10">
                        {quota.user.split('\\').pop()?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-white">{quota.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-white">{quota.used}</span>
                      <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(parseFloat(quota.used) || 0) / (parseFloat(quota.hard) || 1) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-white/60">{quota.soft}</td>
                  <td className="px-6 py-5 text-sm font-bold text-white">{quota.hard}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-tighter">
                      Normal
                    </span>
                  </td>
                  <td className="px-6 py-5 last:rounded-r-2xl">
                    <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                      Editar
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Nova Cota */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Configurar Nova Cota</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-white/40" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Usuário ou Grupo AD</label>
                  <select 
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-surface">Selecione um usuário...</option>
                    {adUsers.map(user => (
                      <option key={user} value={user} className="bg-surface">{user}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Limite Soft (GB)</label>
                  <input 
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4 items-start">
                  <ShieldAlert size={20} className="text-primary shrink-0 mt-1" />
                  <p className="text-xs text-white/60 leading-relaxed">
                    O limite "Hard" será automaticamente definido como {parseInt(newLimit) + 2}GB. 
                    O usuário será impedido de gravar arquivos após atingir este limite.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddQuota}
                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20"
                  >
                    Salvar Cota
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
    </div>
  );
}
