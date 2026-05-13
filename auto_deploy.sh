#!/bin/zsh

# Cores para o terminal (estilo Unishell)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

DEPLOY_PATH="/opt/unishell-manager/frontend"
NGINX_HTML_PATH="/var/www/html"
FORCE=false

if [[ "$1" == "--force" ]]; then
    FORCE=true
fi

cd $DEPLOY_PATH

echo "${BLUE}==> Verificando atualizações...${NC}"
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
HAS_LOCAL_CHANGES=$(git status --porcelain)

if [ "$LOCAL" != "$REMOTE" ] || [ -n "$HAS_LOCAL_CHANGES" ] || [ "$FORCE" = true ]; then
    if [ -n "$HAS_LOCAL_CHANGES" ]; then
        echo "${BLUE}==> Mudanças locais detectadas.${NC}"
    elif [ "$LOCAL" != "$REMOTE" ]; then
        echo "${GREEN}==> Novas mudanças no repositório remoto!${NC}"
        git pull origin main
    fi
    
    if [ "$FORCE" = true ]; then
        echo "${BLUE}==> Forçando deploy...${NC}"
    fi

    echo "${BLUE}==> Instalando dependências (npm install)...${NC}"
    npm install
    
    echo "${BLUE}==> Gerando novo build (npm run build)...${NC}"
    npm run build
    
    if [ -d "dist" ]; then
        echo "${BLUE}==> Publicando no servidor web (/var/www/html)...${NC}"
        # Sincroniza com a pasta padrão do Nginx caso o config aponte para lá
        cp -r dist/* $NGINX_HTML_PATH/
        
        echo "${BLUE}==> Reiniciando nginx...${NC}"
        systemctl restart nginx
        
        echo "${GREEN}✔ Sistema atualizado com sucesso!${NC}"
    else
        echo "${RED}❌ Erro: Pasta 'dist' não encontrada após o build.${NC}"
        exit 1
    fi
else
    echo "ℹ O sistema já está na versão mais recente e não há mudanças locais."
    echo "Use --force para forçar o redeploy."
fi
