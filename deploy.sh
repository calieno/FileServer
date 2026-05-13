#!/bin/bash
cd /opt/unishell-manager/frontend
git pull origin main
npm install
npm run build
cp -r dist/* /var/www/html/
echo "Deploy finalizado em $(date)"
