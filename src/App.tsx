/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import FileExplorer from './components/FileExplorer';
import PermissionsView from './components/PermissionsView';
import DiskManagement from './components/DiskManagement';
import QuotaManagement from './components/QuotaManagement';
import Login from './components/Login';
import type { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Users } from 'lucide-react';

function AdminListSidebar() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin-list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAdmins(data);
        }
      })
      .catch(err => console.error('Erro ao buscar admins:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col w-80 h-[600px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Administradores</h3>
          <p className="text-white/40 text-xs">Encontrados no domínio</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : admins.length > 0 ? (
          admins.map((admin, idx) => (
            <div key={idx} className="group p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-300">
              <p className="text-white font-semibold text-sm truncate">{admin.name}</p>
              <p className="text-white/30 text-[10px] font-mono mt-1 truncate">{admin.username}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-white/20 text-xs italic">Nenhum administrador listado na OU configurada.</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <p className="text-[10px] text-white/30 italic leading-relaxed">
          Esta lista é carregada via query LDAP na Unidade Organizacional definida no arquivo de configuração.
        </p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard');
  const [showPermissions, setShowPermissions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; displayName: string } | null>(null);

  // Debug: Monitorar mudanças de estado
  console.log('🔍 App state:', { isAuthenticated, user, activeScreen, showPermissions });

  useEffect(() => {
    console.log('🔍 App useEffect executado');
    // Verificar se já tem sessão ativa (opcional: implementar localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('🔍 Usuário salvo encontrado:', userData);
        setIsAuthenticated(true);
        setUser(userData);
      } catch (err) {
        console.error('❌ Erro ao carregar usuário salvo:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData: { username: string; displayName: string }) => {
    console.log('🔍 handleLogin chamado com:', userData);
    try {
      setIsAuthenticated(true);
      setUser(userData);
      // Salvar sessão
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ Login realizado com sucesso');
    } catch (err) {
      console.error('❌ Erro no handleLogin:', err);
    }
  };

  const handleLogout = () => {
    console.log('🔍 handleLogout chamado');
    try {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      console.log('✅ Logout realizado com sucesso');
    } catch (err) {
      console.error('❌ Erro no handleLogout:', err);
    }
  };

  // Helper to render current screen with animation
  const renderScreen = () => {
    console.log('🔍 renderScreen chamado para:', activeScreen);
    
    if (showPermissions) {
      console.log('🔍 Renderizando PermissionsView');
      return (
        <motion.div
          key="permissions"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="pb-24"
        >
          <div className="mb-6">
            <button 
              onClick={() => setShowPermissions(false)}
              className="text-xs font-bold text-primary hover:underline underline-offset-4 flex items-center gap-1 mb-2"
            >
              ← Back to File Explorer
            </button>
          </div>
          <PermissionsView />
        </motion.div>
      );
    }

    switch (activeScreen) {
      case 'Dashboard':
        console.log('🔍 Renderizando Dashboard');
        return <Dashboard key="dashboard" />;
      case 'File Explorer':
        console.log('🔍 Renderizando FileExplorer');
        return (
          <div key="explorer">
            <FileExplorer onOpenPermissions={() => setShowPermissions(true)} />
          </div>
        );
      case 'Disk Management':
        console.log('🔍 Renderizando DiskManagement');
        return <DiskManagement key="disk" />;
      case 'Quotas':
        console.log('🔍 Renderizando QuotaManagement');
        return <QuotaManagement key="quotas" />;
      case 'User Management':
        console.log('🔍 Renderizando User Management placeholder');
        return (
          <div key="users" className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[40px] shadow-2xl">
            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm">Interface de Gestão de Usuários</p>
          </div>
        );
      case 'System Logs':
        console.log('🔍 Renderizando System Logs placeholder');
        return (
          <div key="logs" className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[40px] shadow-2xl">
            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm">Logs de Auditoria do Sistema</p>
          </div>
        );
      default:
        console.log('⚠️ Screen não encontrada:', activeScreen);
        return null;
    }
  };

  console.log('🔍 App renderizando isAuthenticated:', isAuthenticated);

  return (
    <div className={`min-h-screen bg-surface relative overflow-hidden ${!isAuthenticated ? 'flex items-center justify-center' : 'flex'}`}>
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 backdrop-blur-[120px] pointer-events-none z-0"></div>

      {!isAuthenticated ? (
        // Login Screen
        <div className="flex w-full max-w-6xl mx-auto items-center gap-12 px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 relative z-10"
          >
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                  FileGuard <span className="text-primary">Pro</span>
                </h1>
                <p className="text-white/50 font-medium">
                  Gestão Centralizada de Servidor de Arquivos
                </p>
              </div>
              <Login onLogin={handleLogin} />
            </div>
          </motion.div>

          <AdminListSidebar />
        </div>
      ) : (
        // Main Application
        <>
          <Sidebar 
            activeScreen={activeScreen} 
            onScreenChange={(s) => {
              console.log('🔍 Screen change:', s);
              setActiveScreen(s);
              setShowPermissions(false);
            }}
            onLogout={handleLogout}
            user={user}
          />
          
          <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
            <TopBar user={user} onLogout={handleLogout} />
            
            <main className="flex-1 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPermissions ? 'perm-view' : activeScreen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
