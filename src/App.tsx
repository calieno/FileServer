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
    <div className="flex min-h-screen bg-surface">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 backdrop-blur-[120px] pointer-events-none z-0"></div>

      {!isAuthenticated ? (
        // Login Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="flex items-center justify-center min-h-screen bg-surface"
        >
          <div className="w-full max-w-md p-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                FileGuard Pro
              </h1>
              <p className="text-white/60">
                Sistema de Gerenciamento de Servidor de Arquivos
              </p>
            </div>
            <Login onLogin={handleLogin} />
          </div>
        </motion.div>
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
