import { ChevronRight, Shield, UserPlus, History, Group, LockKeyhole, UserMinus, Folder, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface PermissionEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  access: 'Admin' | 'Read & Write' | 'Read Only' | 'No Access';
  avatar?: string;
  isGroup?: boolean;
}

const permissions: PermissionEntry[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.corp', role: 'Senior Dev', access: 'Admin', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' },
  { id: '2', name: 'Engineering_Team', email: '128 Members', role: 'Internal Security Group', access: 'Read & Write', isGroup: true },
  { id: '3', name: 'Alice Moore', email: 'alice.m@partner-corp.com', role: 'External Auditor', access: 'Read Only', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
  { id: '4', name: 'Contractors_Tier_2', email: '8 Members', role: 'Restricted External Access', access: 'No Access', isGroup: true },
];

export default function PermissionsView() {
  return (
    <div id="permissions-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">
            <span>Raiz</span>
            <ChevronRight size={12} className="opacity-40" />
            <span>Documentos</span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-primary">Docs_Confidenciais</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 tracking-tighter">
            <span className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-primary shadow-xl">
               <Shield size={32} />
            </span>
            Permissões: Docs_Confidenciais
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all shadow-xl">
            <History size={18} />
            Logs de Auditoria
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:brightness-110 rounded-2xl text-sm font-bold transition-all shadow-2xl shadow-primary/40">
            <UserPlus size={18} />
            Convidar Usuário
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="relative flex-grow max-w-md">
           <input 
            type="text" 
            placeholder="Buscar usuários ou grupos de segurança..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-4 pr-4 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
           />
        </div>
        <div className="flex items-center gap-3 text-white/40">
          <span className="text-[10px] font-bold uppercase tracking-widest">Filtrar por:</span>
          <select className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs font-bold text-white outline-none cursor-pointer focus:ring-1 focus:ring-primary transition-all">
            <option>Todas as Entidades</option>
            <option>Usuários</option>
            <option>Grupos</option>
          </select>
        </div>
      </div>

      {/* Permissions List */}
      <div className="grid grid-cols-1 gap-4">
        {permissions.map((entry, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={entry.id} 
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between hover:border-white/30 hover:bg-white/[0.12] transition-all group"
          >
            <div className="flex items-center gap-5">
              {entry.isGroup ? (
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${entry.access === 'No Access' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                  {entry.access === 'No Access' ? <LockKeyhole size={24} /> : <Group size={24} />}
                </div>
              ) : (
                <div className="relative">
                  <img src={entry.avatar} alt={entry.name} className={`w-12 h-12 rounded-full border-2 ${entry.access === 'Admin' ? 'border-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/20'}`} />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full shadow-lg"></span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{entry.name}</h3>
                <p className="text-xs font-medium text-white/40 mt-0.5">{entry.email} • {entry.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest mb-1.5">Nível de Acesso</span>
                <span className={`px-4 py-1 cursor-default rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  entry.access === 'Admin' ? 'bg-primary text-white shadow-xl' :
                  entry.access === 'Read & Write' ? 'bg-white/10 text-white border border-white/10' :
                  entry.access === 'No Access' ? 'bg-accent/10 text-accent border border-accent/20' :
                  'bg-white/5 text-white/60 border border-white/5'
                }`}>
                  {entry.access === 'Admin' ? 'Admin' :
                   entry.access === 'Read & Write' ? 'Leitura e Escrita' :
                   entry.access === 'No Access' ? 'Sem Acesso' : 'Apenas Leitura'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                {entry.access === 'Admin' && (
                   <label className="relative inline-flex items-center cursor-pointer group/toggle">
                    <input type="checkbox" className="sr-only peer" checked readOnly />
                    <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:border-white/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                    <span className="ml-3 text-xs font-bold text-white/40 group-hover/toggle:text-white transition-colors">Acesso de Escrita</span>
                  </label>
                )}

                {entry.access === 'Read Only' && (
                  <button className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10">
                    Elevar Acesso
                  </button>
                )}

                {entry.access === 'Read & Write' && (
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 border border-white/10 bg-white/5 rounded-2xl text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all">Modificar</button>
                    <button className="px-4 py-1.5 bg-accent/20 text-accent border border-accent/20 rounded-2xl text-xs font-bold hover:bg-accent hover:text-white transition-all">Revogar</button>
                  </div>
                )}

                {entry.access === 'No Access' && (
                  <button className="px-6 py-1.5 bg-primary text-white rounded-2xl text-xs font-black hover:brightness-110 shadow-2xl shadow-primary/20 transition-all uppercase tracking-tighter">Conceder Acesso</button>
                )}

                <button className="p-2 text-white/20 hover:text-accent transition-colors rounded-xl hover:bg-accent/10 px-4">
                  <UserMinus size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inheritance and Security Check - Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl">
          <h4 className="text-xl font-bold text-white mb-6 tracking-tight">Árvore de Herança de Permissões</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/10 text-primary rounded-xl border border-white/10">
                <Shield size={16} />
              </div>
              <span className="font-mono text-xs font-bold text-white/40 tracking-tight">Corporate_Root / Documents</span>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/60 uppercase tracking-widest border border-white/5">Herdado</span>
            </div>
            <div className="ml-6 border-l-2 border-white/10 pl-8 space-y-6 relative">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                   <Folder size={16} />
                </div>
                <span className="font-mono text-xs font-black text-white tracking-tight">Docs_Confidenciais</span>
                <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Atual</span>
              </div>
              <div className="ml-6 border-l-2 border-white/10 pl-8 opacity-40">
                <div className="flex items-center gap-3">
                  <FileText size={16} />
                  <span className="font-mono text-xs font-medium">Q4_Financeiro.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/40 to-blue-600/40 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2 tracking-tighter text-white">Verificação de Segurança</h4>
            <p className="text-sm font-medium text-white/70 leading-relaxed">
              Detectados 3 usuários externos com permissões de 'Escrita' neste nó. Revisão recomendada.
            </p>
          </div>
          
          <div className="space-y-4 relative z-10 pt-8">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner border border-white/10">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                className="bg-white h-full shadow-[0_0_20px_rgba(255,255,255,1)]"
               />
            </div>
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/50">
              <span>Score de Segurança</span>
              <span className="text-white">75/100</span>
            </div>
            <button className="w-full bg-white text-surface font-black py-4 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl text-xs uppercase tracking-widest">
              Executar Auditoria Agora
            </button>
          </div>

          <div className="absolute top-[-40px] right-[-40px] opacity-[0.03] pointer-events-none">
            <Shield size={240} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Unsaved Changes */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-white/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full shadow-2xl z-[60] border border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
          <span className="text-sm font-bold tracking-tight">Alterações não salvas nas permissões</span>
        </div>
        <div className="h-6 w-px bg-white/10"></div>
        <div className="flex gap-6">
          <button className="text-sm font-bold text-white/50 hover:text-white transition-colors">Descartar</button>
          <button className="bg-primary px-8 py-2 rounded-full text-sm font-black text-white hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95">Salvar Alterações</button>
        </div>
      </motion.div>
    </div>
  );
}

