#!/bin/zsh

# Cores para o terminal (estilo Unishell)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /opt/unishell-manager/frontend

echo "${BLUE}==> Iniciando sincronização com GitHub...${NC}"
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "${GREEN}==> Mudanças detectadas! Baixando código...${NC}"
    git pull origin main
    
    echo "${BLUE}==> Instalando dependências (npm install)...${NC}"
    npm install
    
    echo "${BLUE}==> Gerando novo build (npm run build)...${NC}"
    npm run build
    
    echo "${BLUE}==> Publicando no servidor web...${NC}"
    cp -r dist/* /var/www/html/
    systemctl restart nginx
    
    echo "${GREEN}✔ Sistema atualizado com sucesso!${NC}"
else
    echo "ℹ O sistema já está na versão mais recente."
fi
