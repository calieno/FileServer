import { LayoutDashboard, FolderOpen, Users, Activity, Plus, Settings, HelpCircle, LogOut } from 'lucide-react';
import type { Screen } from '../types';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'File Explorer', icon: FolderOpen },
    { name: 'User Management', icon: Users },
    { name: 'System Logs', icon: Activity },
  ] as const;

  return (
    <aside id="sidebar" className="w-64 h-screen fixed left-0 top-0 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col p-4 z-50">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">FileGuard Pro</h1>
        <p className="text-sm text-white/50 font-medium">System Administrator</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onScreenChange(item.name as Screen)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
              activeScreen === item.name
                ? 'bg-white/20 text-white font-bold border border-white/20 shadow-xl'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={20} className={activeScreen === item.name ? 'fill-white/10' : ''} />
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <button className="w-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 mb-4 hover:bg-white/30 transition-all border border-white/20 shadow-lg">
          <Plus size={16} />
          Add New Server
        </button>

        <button className="w-full flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/10 transition-all rounded-2xl text-sm">
          <Settings size={20} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-white/60 hover:text-white hover:bg-white/10 transition-all rounded-2xl text-sm">
          <HelpCircle size={20} />
          Support
        </button>

        <div className="flex items-center gap-3 p-3 mt-4 bg-white/5 rounded-2xl border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Superuser</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
