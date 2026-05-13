#!/bin/zsh

# Script de depuração para o FileGuard Pro
# Executar após a atualização para verificar o estado

echo "🔍 INICIANDO DIAGNÓSTICO DO FILEGUARD PRO"
echo "========================================"

# 1. Verificar se os arquivos existem
echo "1. Verificando arquivos principais..."
if [ -f "/opt/unishell-manager/frontend/src/components/Login.tsx" ]; then
    echo "✅ Login.tsx existe"
else
    echo "❌ Login.tsx não encontrado"
fi

if [ -f "/opt/unishell-manager/frontend/src/App.tsx" ]; then
    echo "✅ App.tsx existe"
else
    echo "❌ App.tsx não encontrado"
fi

# 2. Verificar se o console.log está no Login.tsx
echo "2. Verificando logs de depuração no Login.tsx..."
if grep -q "console.log.*Login" /opt/unishell-manager/frontend/src/components/Login.tsx; then
    echo "✅ Logs de depuração encontrados no Login.tsx"
else
    echo "❌ Logs de depuração não encontrados no Login.tsx"
fi

# 3. Verificar se o console.log está no App.tsx
echo "3. Verificando logs de depuração no App.tsx..."
if grep -q "console.log.*App" /opt/unishell-manager/frontend/src/App.tsx; then
    echo "✅ Logs de depuração encontrados no App.tsx"
else
    echo "❌ Logs de depuração não encontrados no App.tsx"
fi

# 4. Verificar se o backend está rodando
echo "4. Verificando backend..."
if curl -s http://localhost:3001/api/system/disk > /dev/null 2>&1; then
    echo "✅ Backend está rodando (porta 3001)"
else
    echo "❌ Backend não está rodando ou inacessível"
fi

# 5. Verificar se o frontend está rodando
echo "5. Verificando frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend está rodando (porta 3000)"
else
    echo "❌ Frontend não está rodando ou inacessível"
fi

# 6. Verificar versão do build
echo "6. Verificando build..."
if [ -d "/opt/unishell-manager/frontend/dist" ]; then
    echo "✅ Build existe em /opt/unishell-manager/frontend/dist"
    echo "Arquivos no dist:"
    ls -la /opt/unishell-manager/frontend/dist/ | head -10
else
    echo "❌ Build não encontrado"
fi

# 7. Verificar se os arquivos estão no servidor web
echo "7. Verificando arquivos no servidor web..."
if [ -d "/var/www/html" ]; then
    echo "✅ Servidor web existe"
    echo "Arquivos em /var/www/html:"
    ls -la /var/www/html/ | head -10
else
    echo "❌ Servidor web não encontrado"
fi

# 8. Verificar permissões
echo "8. Verificando permissões..."
if [ -r "/var/www/html/index.html" ]; then
    echo "✅ index.html tem permissão de leitura"
else
    echo "❌ index.html sem permissão de leitura"
fi

echo ""
echo "🔍 PRÓXIMOS PASSOS RECOMENDADOS:"
echo "1. Abrir o navegador e acessar http://localhost:3000"
echo "2. Abrir o console do navegador (F12) e procurar logs '🔍'"
echo "3. Verificar se os logs aparecem quando a página carrega"
echo "4. Verificar se há erros no console"
echo "5. Verificar se o formulário de login aparece"
echo ""
echo "🔍 COMANDOS ÚTEIS:"
echo "tail -f /var/log/nginx/access.log  # Verificar acessos ao servidor"
echo "tail -f /var/log/nginx/error.log   # Verificar erros do servidor"
echo "ps aux | grep node                  # Verificar se Node.js está rodando"
echo "curl -I http://localhost:3000       # Testar frontend"
echo "curl -I http://localhost:3001       # Testar backend"