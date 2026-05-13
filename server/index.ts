import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3001;

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

// --- LDAP AUTHENTICATION HELPER ---

async function authenticateLDAP(username: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: process.env.LDAP_URL || 'ldap://localhost'
    });

    // Em AD, o username geralmente precisa do domínio ou DN completo
    // Se o usuário passar apenas 'usuario', concatenamos com o sufixo se necessário
    const userPrincipalName = username.includes('@') ? username : `${username}@${(process.env.LDAP_SUFFIX || '').replace('DC=', '').replace(',DC=', '.')}`;
    
    client.bind(userPrincipalName, password, (err) => {
      if (err) {
        client.unbind();
        return reject(err);
      }

      // Se o bind funcionou, agora verificamos se o usuário pertence ao grupo de administradores
      // No AD, podemos buscar o próprio usuário e ver o atributo memberOf
      const searchOptions = {
        filter: `(userPrincipalName=${userPrincipalName})`,
        scope: 'sub' as const,
        attributes: ['dn', 'cn', 'memberOf', 'displayName']
      };

      client.search(process.env.LDAP_SUFFIX || '', searchOptions, (err, res) => {
        if (err) {
          client.unbind();
          return reject(err);
        }

        let userFound: any = null;

        res.on('searchEntry', (entry: any) => {
          userFound = entry.object;
        });

        res.on('error', (err) => {
          client.unbind();
          reject(err);
        });

        res.on('end', (result) => {
          client.unbind();
          if (!userFound) {
            return reject(new Error('Usuário não encontrado após bind bem sucedido.'));
          }

          // Verificar se o grupo está no memberOf
          // LDAP_GROUP_TREE_DN="OU=Administradores,DC=inb,DC=gov,DC=br"
          const adminGroup = process.env.LDAP_GROUP_TREE_DN;
          const memberOf = userFound.memberOf;
          
          let isAuthorized = false;
          if (adminGroup) {
            if (Array.isArray(memberOf)) {
              isAuthorized = memberOf.some((group: string) => group.includes(adminGroup) || group === adminGroup);
            } else if (typeof memberOf === 'string') {
              isAuthorized = memberOf.includes(adminGroup) || memberOf === adminGroup;
            }
          } else {
            // Se não houver grupo definido, apenas o login com sucesso basta
            isAuthorized = true;
          }

          // Fallback para lista hardcoded se necessário
          const adminUsers = process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',').map(u => u.trim()) : [];
          if (adminUsers.includes(username)) {
            isAuthorized = true;
          }

          if (isAuthorized) {
            resolve({
              username: username,
              displayName: userFound.displayName || userFound.cn || username,
              authenticated: true
            });
          } else {
            reject(new Error('Usuário autenticado, mas não possui permissão de administrador.'));
          }
        });
      });
    });
  });
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

app.listen(port, () => {
  console.log(`Backend FileServer rodando em http://localhost:${port}`);
});
