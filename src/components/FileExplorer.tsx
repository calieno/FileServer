import { ChevronRight, Upload, FolderPlus, HardDrive, Share2, ShieldCheck, Folder, FileText, FileArchive, Image as ImageIcon, ChevronLeft, Lock, CheckCircle, Info, MoreVertical } from 'lucide-react';
import type { FileItem } from '../types';
import { motion } from 'motion/react';

const files: FileItem[] = [
  { id: '1', name: 'Source_Assets', type: 'folder', size: '--', owner: 'Admin', ownerInitial: 'JS', lastModified: 'Oct 24, 2023, 10:45 AM' },
  { id: '2', name: 'Contract_Final_v2.pdf', type: 'pdf', size: '2.4 MB', owner: 'Sarah A.', ownerInitial: 'SA', lastModified: 'Today, 09:12 AM' },
  { id: '3', name: 'Archive_Assets.zip', type: 'zip', size: '412.0 MB', owner: 'Admin', ownerInitial: 'AD', lastModified: 'Oct 22, 2023, 04:30 PM' },
  { id: '4', name: 'Landing_Hero_Mockup.png', type: 'image', size: '8.1 MB', owner: 'Admin', ownerInitial: 'JS', lastModified: 'Oct 21, 2023, 11:15 AM' },
  { id: '5', name: 'Financial_Reports', type: 'folder', size: '--', owner: 'HR Dept', ownerInitial: 'HR', lastModified: 'Oct 20, 2023, 09:00 AM', readOnly: true },
];

interface FileExplorerProps {
  onOpenPermissions: (fileName: string) => void;
}

export default function FileExplorer({ onOpenPermissions }: FileExplorerProps) {
  return (
    <div id="file-explorer-content" className="space-y-6">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <button className="text-white/60 hover:text-white transition-colors font-medium">Início</button>
          <ChevronRight size={14} className="text-white/30" />
          <button className="text-white/60 hover:text-white transition-colors font-medium">Projetos</button>
          <ChevronRight size={14} className="text-white/30" />
          <span className="text-white font-bold">Cliente_A</span>
        </nav>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-sm">
            <Upload size={16} />
            Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-sm">
            <FolderPlus size={16} />
            Nova Pasta
          </button>
        </div>
      </div>

      {/* Directory Stats Panel */}
      <div className="grid grid-cols-12 gap-4">
        {[
          { icon: HardDrive, label: 'Espaço Usado', value: '12.4 GB', progress: 45, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Share2, label: 'Pastas Compartilhadas', value: '8', subValue: 'Acessos Ativos', color: 'text-white/40', bg: 'bg-white/5' },
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-3 p-5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${stat.bg} rounded-xl border border-white/10 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            {stat.progress ? (
              <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                />
              </div>
            ) : (
              <p className="text-xs text-primary mt-2 font-bold">{stat.subValue}</p>
            )}
          </div>
        ))}
        
        <div className="col-span-12 md:col-span-6 p-5 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl flex justify-between items-center relative overflow-hidden group shadow-2xl">
          <div className="relative z-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest leading-relaxed">Saúde do Diretório</span>
            <p className="text-3xl font-bold text-white mt-1">Otimizado</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></span>
              <span className="text-xs font-medium text-white/60">Todos os protocolos de backup verificados</span>
            </div>
          </div>
          <div className="opacity-[0.05] absolute right-[-20px] top-[-20px] transform group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={160} />
          </div>
          <button className="relative z-10 px-6 py-2.5 bg-primary text-white text-xs font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 mt-auto uppercase tracking-tighter">
            Rodar Otimização
          </button>
        </div>
      </div>

      {/* File List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/30">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Nome</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Tamanho</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Proprietário</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Última Modificação</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-white/40 group-hover:text-primary transition-colors">
                        {file.type === 'folder' && <Folder size={18} className="fill-current/20" />}
                        {file.type === 'pdf' && <FileText size={18} className="text-accent" />}
                        {file.type === 'zip' && <FileArchive size={18} className="text-amber-500" />}
                        {file.type === 'image' && <ImageIcon size={18} className="text-primary" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{file.name}</span>
                        {file.readOnly && (
                          <span className="px-2 py-0.5 bg-white/10 text-white/40 text-[9px] rounded-full uppercase font-bold tracking-widest border border-white/10">Somente Leitura</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono font-bold text-white/40">{file.size}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                        {file.ownerInitial}
                      </div>
                      <span className="text-xs font-semibold text-white/60">{file.owner}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono font-bold text-white/20">{file.lastModified}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPermissions(file.name);
                      }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-white/60 hover:text-white hover:border-white/30 transition-all"
                    >
                      Permissões
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex items-center justify-between bg-white/5 border-t border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-bold text-white/20 tracking-tight">Mostrando 5 de 42 itens</span>
          <div className="flex gap-2">
            <button className="p-2 border border-white/10 rounded-2xl bg-white/5 text-white/20 disabled:opacity-30 transition-all" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-white/10 rounded-2xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Additional Card (Bento Style) */}
      <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/10 group-hover:border-primary/50 transition-all">
            <Info size={28} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Propriedades da Seleção</h4>
            <p className="text-sm font-medium text-white/40">Selecione um arquivo para ver metadados detalhados e histórico de acesso.</p>
          </div>
        </div>
        <div className="flex gap-8 pr-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest mb-2">Criptografado</span>
            <Lock size={20} className="text-green-500 fill-green-500/10" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest mb-2">Indexado</span>
            <CheckCircle size={20} className="text-primary fill-primary/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
