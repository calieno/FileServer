import { Bell, Cloud, Search } from 'lucide-react';

interface TopBarProps {
  user?: { username: string; displayName: string };
  onLogout?: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header id="top-bar" className="h-16 w-full sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-white">Explorador do Servidor</span>
        <nav className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex gap-6 text-sm font-medium">
          <button className="text-white/60 hover:text-white transition-colors">Rede</button>
          <button className="text-white font-bold transition-all relative">
            Armazenamento
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#3b82f6]"></span>
          </button>
          <button className="text-white/60 hover:text-white transition-colors">Backups</button>
        </nav>
      </div>

       <div className="flex items-center gap-6 flex-grow justify-end max-w-2xl">
         <div className="relative flex-grow max-w-md group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={18} />
           <input
             type="text"
             placeholder="Buscar diretórios, usuários ou logs..."
             className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-inner"
           />
         </div>

         <div className="flex items-center gap-4 text-white/40 border-l border-white/10 pl-6">
           <button className="hover:text-primary transition-colors relative">
             <Bell size={22} />
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0f172a] animate-pulse"></span>
           </button>
           <button className="hover:text-primary transition-colors">
             <Cloud size={22} />
           </button>
           <div className="flex items-center gap-3 border-l border-white/10 pl-6">
             <div className="h-8 w-8 rounded-full border border-white/20 overflow-hidden bg-white/10 cursor-pointer hover:border-primary transition-all shadow-lg">
               <img
                 src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                 alt="Perfil"
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="text-right">
               <div className="text-sm font-medium text-white">
                 {user?.displayName || 'Usuário'}
               </div>
               <div className="text-xs text-white/40">
                 {user?.username || 'admin@inb.gov.br'}
               </div>
             </div>
             {onLogout && (
               <button
                 onClick={onLogout}
                 className="ml-3 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
               >
                Sair
               </button>
             )}
           </div>
         </div>
       </div>
    </header>
  );
}
