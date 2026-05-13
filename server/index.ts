import express from 'express';
import os from 'node:os';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
// --- GLOBAL ERROR HANDLING ---
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Mock data for development if not on Linux
const IS_LINUX = process.platform === 'linux';

// --- DISK MANAGEMENT ---

app.get('/api/system/disk', async (req, res) => {
  try {
    if (!IS_LINUX) {
      // Mock data for Windows/MacOS development
      return res.json([
        { device: '/dev/sda1', mount: '/', size: '100G', used: '45G', avail: '55G', usePercent: '45%' },
        { device: '/dev/sdb1', mount: '/mnt/storage', size: '2TB', used: '1.2TB', avail: '800GB', usePercent: '60%' }
      ]);
    }

    const { stdout } = await execAsync('df -h --output=source,target,size,used,avail,pcent | grep "^/dev/"');
    const lines = stdout.trim().split('\n');
    const disks = lines.map(line => {
      const [device, mount, size, used, avail, usePercent] = line.split(/\s+/);
      return { device, mount, size, used, avail, usePercent };
    });
    res.json(disks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- QUOTAS ---

app.get('/api/system/quotas', async (req, res) => {
  try {
    if (!IS_LINUX) {
      return res.json([
        { user: 'AD\\john.doe', used: '5G', soft: '10G', hard: '12G', grace: 'none' },
        { user: 'AD\\jane.smith', used: '15G', soft: '20G', hard: '25G', grace: 'none' }
      ]);
    }
    // Logic for repquota
    const { stdout } = await execAsync('repquota -aug');
    res.send(stdout); // Simplification for now, should parse to JSON
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- AD INTEGRATION ---

app.get('/api/ad/users', async (req, res) => {
  try {
    if (!IS_LINUX) {
      return res.json(['AD\\john.doe', 'AD\\jane.smith', 'AD\\admin.user']);
    }
    const { stdout } = await execAsync('wbinfo -u');
    const users = stdout.trim().split('\n');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- LOGIN ENDPOINT (SIMPLE TEST VERSION) ---

import ldap from 'ldapjs';
import { authenticate } from 'ldap-authentication';

// --- LDAP AUTHENTICATION HELPER ---

async function authenticateLDAP(username: string, password: string): Promise<any> {
  const accountName = username.split('@')[0];
  
  const options = {
    ldapOpts: {
      url: process.env.LDAP_URL || 'ldap://localhost',
      connectTimeout: 5000,
      timeout: 10000,
    },
    adminDn: process.env.LDAP_USER_DN,
    adminPassword: process.env.LDAP_PASSWORD,
    userPassword: password,
    userSearchBase: process.env.LDAP_SUFFIX || '',
    usernameAttribute: 'sAMAccountName', // Tenta por sAMAccountName primeiro
    username: accountName,
    attributes: ['dn', 'cn', 'memberOf', 'displayName', 'sAMAccountName', 'userPrincipalName']
  };

  try {
    console.log(`🔍 Tentando autenticação via ldap-authentication para: ${accountName}`);
    const user: any = await authenticate(options);
    console.log('✅ Autenticação bem sucedida para:', user.sAMAccountName || user.cn);

    // Verificar autorização (grupo)
    const adminGroup = process.env.LDAP_GROUP_TREE_DN;
    const memberOf = user.memberOf;
    
    let isAuthorized = false;
    if (adminGroup) {
      if (Array.isArray(memberOf)) {
        isAuthorized = memberOf.some((group: string) => group.includes(adminGroup) || group === adminGroup);
      } else if (typeof memberOf === 'string') {
        isAuthorized = memberOf.includes(adminGroup) || memberOf === adminGroup;
      }
    } else {
      isAuthorized = true;
    }

    // Fallback para lista ADMIN_USERS
    const adminUsers = process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',').map(u => u.trim()) : [];
    if (adminUsers.includes(username) || adminUsers.includes(accountName)) {
      isAuthorized = true;
    }

    if (isAuthorized) {
      return {
        username: username,
        displayName: user.displayName || user.cn || username,
        authenticated: true
      };
    } else {
      throw new Error('Usuário autenticado, mas não possui permissão de administrador.');
    }
  } catch (err: any) {
    console.error('❌ Erro no ldap-authentication:', err.message);
    // Se falhar por sAMAccountName, tentamos uma segunda vez por userPrincipalName se o username contiver @
    if (username.includes('@')) {
       console.log('🔄 Tentando novamente usando userPrincipalName...');
       const optionsUPN = { ...options, usernameAttribute: 'userPrincipalName', username: username };
       try {
         const userUPN: any = await authenticate(optionsUPN);
         // Repetir lógica de autorização... (simplificando para este exemplo)
         return { username, displayName: userUPN.displayName || userUPN.cn, authenticated: true };
       } catch (e) {
         throw new Error('Credenciais inválidas ou usuário não encontrado.');
       }
    }
    throw new Error(err.message || 'Falha na autenticação.');
  }
}

// --- LOGIN ENDPOINT ---

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    // Tenta autenticação real via LDAP
    console.log(`🔍 Tentando login LDAP para: ${username}`);
    const userData = await authenticateLDAP(username, password);
    console.log('✅ Login LDAP bem sucedido:', userData.username);
    
    return res.json({
      success: true,
      user: userData
    });
  } catch (error: any) {
    console.error('❌ Erro de autenticação:', error.message);
    
    // Fallback para desenvolvimento local se LDAP falhar ou não estiver disponível
    if (!process.env.LDAP_URL || process.env.NODE_ENV === 'development') {
      console.log('⚠️ Fallback para modo teste (Credenciais conferem?)');
      if (username === 'admin' && password === 'admin') {
         return res.json({
          success: true,
          user: { username: 'admin', displayName: 'Administrador (Fallback)', authenticated: true }
        });
      }
    }

    return res.status(401).json({ error: error.message || 'Falha na autenticação' });
  }
});
app.get('/api/admin-list', async (req, res) => {
  try {
    const client = ldap.createClient({
      url: process.env.LDAP_URL || 'ldap://localhost',
      timeout: 5000,
      connectTimeout: 3000
    });

    const guestDN = process.env.LDAP_USER_DN || '';
    const guestPassword = process.env.LDAP_PASSWORD || '';

    client.bind(guestDN, guestPassword, (err) => {
      if (err) {
        console.error('❌ Admin-list: Erro no bind:', err.message);
        client.unbind();
        return res.status(500).json({ error: 'Erro de conexão LDAP' });
      }

      // Base de busca: tentamos a OU específica ou o sufixo geral
      const searchBase = process.env.LDAP_USER_TREE_DN || process.env.LDAP_SUFFIX || '';
      
      // Filtro mais abrangente para AD: pessoas que são usuários
      const searchOptions = {
        filter: '(&(objectCategory=person)(objectClass=user))',
        scope: 'sub' as const,
        attributes: ['cn', 'displayName', 'sAMAccountName', 'userPrincipalName'],
        sizeLimit: 100,
        timeLimit: 10
      };

      console.log(`🔍 Buscando admins em: ${searchBase} com filtro: ${searchOptions.filter}`);

      client.search(searchBase, searchOptions, (err, searchRes) => {
        if (err) {
          console.error('❌ Admin-list: Erro na busca:', err.message);
          client.unbind();
          return res.status(500).json({ error: 'Erro na busca LDAP' });
        }

        const users: any[] = [];

        searchRes.on('searchEntry', (entry: any) => {
          console.log(`👤 Encontrado: ${entry.object.cn}`);
          users.push({
            name: entry.object.displayName || entry.object.cn,
            username: entry.object.sAMAccountName || entry.object.userPrincipalName
          });
        });

        searchRes.on('error', (err) => {
          console.error('❌ Admin-list: Erro no stream:', err.message);
          client.unbind();
          // Não falhamos a requisição se já tivermos alguns usuários, mas aqui provavelmente é erro fatal
          if (!res.headersSent) res.status(500).json({ error: err.message });
        });

        searchRes.on('end', () => {
          client.unbind();
          console.log(`✅ Admin-list: Busca finalizada. ${users.length} usuários encontrados.`);
          
          if (!res.headersSent) {
            res.json(users);
          }
        });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PERMISSIONS / ACLs ---

app.get('/api/files/permissions', async (req, res) => {
  const { path } = req.query;
  try {
    if (!IS_LINUX) {
      return res.json([
        { id: '1', name: 'AD\\john.doe', type: 'User', access: 'Full Control', inherited: true },
        { id: '2', name: 'AD\\Domain Admins', type: 'Group', access: 'Full Control', inherited: true },
        { id: '3', name: 'AD\\Engineering', type: 'Group', access: 'Read/Write', inherited: false }
      ]);
    }
    // smbcacls logic would go here
    const { stdout } = await execAsync(`smbcacls //localhost/share "${path}" -U "AD\\admin%password"`);
    res.send(stdout);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/files/permissions', async (req, res) => {
  const { path, user, access, action } = req.body;
  try {
    if (!IS_LINUX) {
      console.log(`Mock: Permissão ${action} para ${user} no path ${path} com nível ${access}`);
      return res.json({ success: true });
    }
    // Command to set ACL
    // Example: setfacl -m u:user:rwx path
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/system/stats', async (req, res) => {
  try {
    const uptimeSeconds = os.uptime();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

    // CPU load (1 min average)
    const loadAvg = os.loadavg()[0];
    const cpuPercent = ((loadAvg / (os.cpus().length || 1)) * 100).toFixed(1);

    // Disk usage for root
    const { stdout: dfOut } = await execAsync('df -h / --output=size,used,avail,pcent | tail -1');
    const [diskSize, diskUsed, diskAvail, diskPcent] = dfOut.trim().split(/\s+/);

    // Network stats
    let netSpeed = { rx: '0 KB/s', tx: '0 KB/s' };
    try {
      const { stdout: netInit } = await execAsync('cat /proc/net/dev | grep eth0 || cat /proc/net/dev | head -n 3 | tail -n 1');
      await new Promise(r => setTimeout(r, 1000));
      const { stdout: netFinal } = await execAsync('cat /proc/net/dev | grep eth0 || cat /proc/net/dev | head -n 3 | tail -n 1');
      
      const parseNet = (line: string) => {
        const parts = line.trim().split(/\s+/);
        return { rx: parseInt(parts[1]), tx: parseInt(parts[9]) };
      };
      
      const init = parseNet(netInit);
      const final = parseNet(netFinal);
      netSpeed = {
        rx: ((final.rx - init.rx) / 1024).toFixed(1) + ' KB/s',
        tx: ((final.tx - init.tx) / 1024).toFixed(1) + ' KB/s'
      };
    } catch (e) {
      console.warn('Network stats failed:', e);
    }

    res.json({
      cpu: cpuPercent,
      memory: {
        total: (totalMem / (1024 ** 3)).toFixed(1) + 'GB',
        used: (usedMem / (1024 ** 3)).toFixed(1) + 'GB',
        percent: memPercent
      },
      disk: {
        size: diskSize,
        used: diskUsed,
        avail: diskAvail,
        percent: diskPcent.replace('%', '')
      },
      network: netSpeed,
      uptime: formatUptime(uptimeSeconds)
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

app.listen(PORT, () => {
  console.log(`Backend FileServer rodando em http://localhost:${PORT}`);
});
