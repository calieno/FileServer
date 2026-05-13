import { useState, useEffect } from 'react';
import { Shield, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: { username: string; displayName: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  // Debug: Verificar se o componente está renderizando
  console.log('🔍 Login component renderizado - Count:', renderCount);
  
  // Debug: Verificar props
  console.log('🔍 Login props:', { onLogin: typeof onLogin });

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🔍 Login useEffect executado - Render count:', renderCount + 1);
    
    // Verificar se o onLogin é uma função
    if (typeof onLogin !== 'function') {
      console.error('❌ ERRO CRÍTICO: onLogin não é uma função:', typeof onLogin, onLogin);
      setError('Erro na configuração do sistema');
    }
  }, [onLogin, renderCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 handleSubmit chamado');
    
    setIsLoading(true);
    setError('');

    // Simular login para teste
    setTimeout(() => {
      console.log('🔍 Login simulado iniciado');
      try {
        const userData = {
          username: username || 'admin',
          displayName: username || 'Administrador Teste'
        };
        console.log('🔍 Enviando dados para onLogin:', userData);
        onLogin(userData);
        console.log('🔍 onLogin chamado com sucesso');
      } catch (err) {
        console.error('❌ ERRO ao chamar onLogin:', err);
        setError('Erro ao processar login');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Debug: Verificar estado do componente
  console.log('🔍 Estado do Login:', { username, password, isLoading, error });

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-500" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Acesso Administrativo
        </h1>
        <p className="text-white/60">
          Login restrito a administradores do domínio
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
              Usuário
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/40" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  console.log('🔍 username changed:', e.target.value);
                  setUsername(e.target.value);
                }}
                placeholder="admin@inb.gov.br"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  console.log('🔍 password changed:', e.target.value);
                  setPassword(e.target.value);
                }}
                placeholder="********"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Autenticando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            Acesso restrito a membros do grupo: OU=Administradores,DC=inb,DC=gov,DC=br
          </p>
          <p className="text-xs text-yellow-400 text-center mt-2">
            🔧 Modo de teste: clique em "Entrar" para acessar
          </p>
        </div>
      </div>
    </div>
  );
}