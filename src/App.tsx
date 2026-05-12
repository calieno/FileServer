/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import FileExplorer from './components/FileExplorer';
import PermissionsView from './components/PermissionsView';
import DiskManagement from './components/DiskManagement';
import QuotaManagement from './components/QuotaManagement';
import type { Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Dashboard');
  const [showPermissions, setShowPermissions] = useState(false);

  // Helper to render current screen with animation
  const renderScreen = () => {
    if (showPermissions) {
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
        return <Dashboard key="dashboard" />;
      case 'File Explorer':
        return (
          <div key="explorer">
            <FileExplorer onOpenPermissions={() => setShowPermissions(true)} />
          </div>
        );
      case 'Disk Management':
        return <DiskManagement key="disk" />;
      case 'Quotas':
        return <QuotaManagement key="quotas" />;
      case 'User Management':
        return (
          <div key="users" className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[40px] shadow-2xl">
            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm">Interface de Gestão de Usuários</p>
          </div>
        );
      case 'System Logs':
        return (
          <div key="logs" className="flex items-center justify-center h-64 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[40px] shadow-2xl">
            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm">Logs de Auditoria do Sistema</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 backdrop-blur-[120px] pointer-events-none z-0"></div>

      <Sidebar 
        activeScreen={activeScreen} 
        onScreenChange={(s) => {
          setActiveScreen(s);
          setShowPermissions(false);
        }} 
      />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <TopBar />
        
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
    </div>
  );
}
