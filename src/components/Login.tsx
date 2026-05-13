import { useState } from 'react';
import { Shield, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: { username: string; displayName: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular login para teste
    setTimeout(() => {
      onLogin({
        username: username || 'admin',
        displayName: username || 'Administrador Teste'
      });
    }, 1000);
  };

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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verificar se o backend está online
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/system/disk', {
          method: 'GET',
          timeout: 5000
        });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        timeout: 10000
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          username: data.user.username,
          displayName: data.user.displayName || username,
        });
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  // Versão de teste para quando o backend está offline
  const handleTestLogin = () => {
    onLogin({
      username: 'admin',
      displayName: 'Administrador Teste'
    });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-xl border border-white/20">
          <div className={`w-2 h-2 rounded-full ${
            backendStatus === 'online' ? 'bg-green-400 animate-pulse' :
            backendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
          }`}></div>
          <span className="text-white/80">
            {backendStatus === 'online' ? 'Backend Online' :
             backendStatus === 'offline' ? 'Backend Offline' : 'Verificando Backend...'}
          </span>
        </div>
      </div>

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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={isLoading || !username || !password || backendStatus !== 'online'}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          {backendStatus === 'offline' && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-red-400 text-center">
                ⚠️ Backend offline. Inicie o servidor com: npm run server
              </p>
              <button
                onClick={handleTestLogin}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
              >
                Usar Modo Teste (sem autenticação)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verificar se o backend está online
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/system/disk', {
          method: 'GET',
          timeout: 5000
        });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        timeout: 10000
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          username: data.user.username,
          displayName: data.user.displayName || username,
        });
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  // Versão de teste para quando o backend está offline
  const handleTestLogin = () => {
    onLogin({
      username: 'admin',
      displayName: 'Administrador Teste'
    });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-xl border border-white/20">
          <div className={`w-2 h-2 rounded-full ${
            backendStatus === 'online' ? 'bg-green-400 animate-pulse' :
            backendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
          }`}></div>
          <span className="text-white/80">
            {backendStatus === 'online' ? 'Backend Online' :
             backendStatus === 'offline' ? 'Backend Offline' : 'Verificando Backend...'}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Shield className="w-8 h-8 text-primary" strokeWidth={2} />
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@inb.gov.br"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
            disabled={isLoading || !username || !password || backendStatus !== 'online'}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          {backendStatus === 'offline' && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-red-400 text-center">
                ⚠️ Backend offline. Inicie o servidor com: npm run server
              </p>
              <button
                onClick={handleTestLogin}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
              >
                Usar Modo Teste (sem autenticação)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verificar se o backend está online
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/system/disk', {
          method: 'GET',
          timeout: 5000
        });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        timeout: 10000
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          username: data.user.username,
          displayName: data.user.displayName || username,
        });
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Status do Backend */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-xl border border-white/20">
          <div className={`w-2 h-2 rounded-full ${
            backendStatus === 'online' ? 'bg-green-400 animate-pulse' :
            backendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
          }`}></div>
          <span className="text-white/80">
            {backendStatus === 'online' ? 'Backend Online' :
             backendStatus === 'offline' ? 'Backend Offline' : 'Verificando Backend...'}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Shield className="w-8 h-8 text-primary" strokeWidth={2} />
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@inb.gov.br"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
            disabled={isLoading || !username || !password || backendStatus !== 'online'}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          {backendStatus === 'offline' && (
            <p className="text-xs text-red-400 text-center mt-2">
              ⚠️ Backend offline. Inicie o servidor com: npm run server
            </p>
          )}
        </div>
      </div>
    </div>
  );
}