<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FileGuard Pro - Sistema de Gerenciamento de Servidor de Arquivos

Interface gráfica para gerenciar servidores de arquivos Debian 11 com Samba e Active Directory.

## Funcionalidades

- 🛡️ **Login Autenticado**: Acesso restrito a administradores do domínio
- 📊 **Dashboard**: Visão geral do sistema com métricas de armazenamento e segurança
- 📁 **Explorador de Arquivos**: Navegação e gerenciamento de arquivos via Samba
- 💾 **Gerenciamento de Disco**: Monitoramento e controle de uso de disco
- 🎯 **Cotas de Usuário**: Gerenciamento de quotas e limites de armazenamento
- 👥 **Gestão de Usuários**: Integração com Active Directory
- 🔐 **Controle de Permissões**: ACLs e gerenciamento de acessos
- 📋 **Logs do Sistema**: Auditoria e monitoramento de atividades

## Requisitos

- **Node.js** (v18+)
- **Linux Debian 11** (ambiente de produção)
- **Samba** instalado e configurado
- **Winbind** para integração com Active Directory
- **Active Directory** com conta de serviço para autenticação

## Configuração

**Prerequisites:** Node.js

1. Instale as dependências:
   `npm install`
2. Configure as variáveis de ambiente no arquivo `.env`:
   ```bash
   # Configuração do LDAP/Active Directory
   LDAP_URL=ldap://10.20.20.2
   LDAP_USER_DN=CN=authGuest,CN=Users,DC=inb,DC=gov,DC=br
   LDAP_PASSWORD=txnjycuL61RfB4jw
   LDAP_SUFFIX=DC=inb,DC=gov,DC=br
   LDAP_GROUP_TREE_DN=OU=Administradores,DC=inb,DC=gov,DC=br
   PORT=3001
   ```
3. Inicie o backend:
   `npm run server`
4. Inicie o frontend (ou ambos simultaneamente):
   `npm run dev` (apenas frontend)
   `npm run dev:all` (frontend + backend)

## Fluxo de Autenticação

O sistema utiliza **Active Directory** para autenticação de usuários:

1. O usuário insere suas credenciais de domínio
2. O backend valida as credenciais via LDAP
3. Verifica se o usuário pertence ao grupo de administradores: `OU=Administradores,DC=inb,DC=gov,DC=br`
4. Acesso permitido apenas para membros do grupo de administradores
5. Após login, o usuário pode acessar todas as funcionalidades do sistema

## Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes React
│   │   ├── Login.tsx       # Tela de login
│   │   ├── Dashboard.tsx   # Dashboard principal
│   │   ├── FileExplorer.tsx # Explorador de arquivos
│   │   ├── PermissionsView.tsx # Gerenciamento de permissões
│   │   ├── DiskManagement.tsx # Gerenciamento de disco
│   │   ├── QuotaManagement.tsx # Gerenciamento de quotas
│   │   └── Sidebar.tsx    # Menu lateral
│   ├── types.ts           # Tipos TypeScript
│   └── App.tsx            # Componente principal
├── server/                # Backend Express
│   └── index.ts          # API e rotas
├── .env                  # Variáveis de ambiente
└── package.json          # Dependências
```

## Endpoints da API

- `POST /api/login` - Autenticação de usuário
- `GET /api/system/disk` - Informações de disco
- `GET /api/system/quotas` - Quotas de usuário
- `GET /api/ad/users` - Lista de usuários do AD
- `GET /api/files/permissions` - Permissões de arquivos
- `POST /api/files/permissions` - Alterar permissões

## Ambiente de Desenvolvimento

Para desenvolvimento em sistemas não-Linux (Windows/macOS), o sistema utiliza **dados mockados**:

- Discos de armazenamento simulados
- Usuários do AD simulados
- Permissões ACL simuladas

Isto permite o desenvolvimento e teste sem acesso ao sistema real.

## Segurança

- 🔐 Autenticação via Active Directory
- 🔒 Permissões restritas a administradores apenas
- 🛡️ Tokens de sessão gerados no backend
- 🚫 Acesso não-autenticado bloqueado

## Licença

Apache License 2.0
