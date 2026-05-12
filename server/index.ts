import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import ActiveDirectory from 'activedirectory2';

dotenv.config();

const execAsync = promisify(exec);
const app = express();
const port = process.env.PORT || 3001;

// Active Directory configuration
const adConfig = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_SUFFIX,
  username: process.env.LDAP_USER_DN,
  password: process.env.LDAP_PASSWORD
};

// Initialize AD connection
let ad: any = null;
try {
  ad = new ActiveDirectory(adConfig);
  console.log('Active Directory connection initialized successfully');
} catch (error) {
  console.error('Failed to initialize Active Directory:', error);
}

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

 // --- LOGIN ENDPOINT ---
 app.post('/api/login', async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
     return res.status(400).json({ error: 'Username and password are required' });
   }

   if (!ad) {
     return res.status(500).json({ error: 'Active Directory not initialized' });
   }

   try {
     // Authenticate with Active Directory
     const userDomain = username.includes('@') ? username : `${username}@inb.gov.br`;
     
     ad.authenticate(userDomain, password, (err: any, authResult: any) => {
       if (err) {
         console.error('AD Authentication error:', err);
         return res.status(401).json({ error: 'Invalid credentials' });
       }

       if (!authResult) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }

       // Check if user is in the Administrators OU
       const userDN = `${process.env.LDAP_USER_DN.split(',')[0]},${process.env.LDAP_SUFFIX}`;
       
       ad.isUserMemberOf(username, process.env.LDAP_GROUP_TREE_DN, (err: any, isMember: any) => {
         if (err) {
           console.error('Error checking group membership:', err);
           return res.status(500).json({ error: 'Error checking permissions' });
         }

         if (!isMember) {
           return res.status(403).json({ error: 'Access denied. Only administrators are allowed.' });
         }

         // Successful login - return user info
         res.json({
           success: true,
           user: {
             username: username,
             displayName: username, // In a real app, you'd fetch this from AD
             authenticated: true
           }
         });
       });
     });
   } catch (error) {
     console.error('Login error:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 });

 app.listen(port, () => {
   console.log(`Backend FileServer rodando em http://localhost:${port}`);
 });
