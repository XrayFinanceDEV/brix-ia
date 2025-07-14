#!/bin/bash

# Script di deploy automatico per Brix-IA
echo "🚀 Avvio deploy Brix-IA..."

# 1. Sincronizza content da Strapi
echo "📥 Sincronizzazione contenuti da Strapi..."

# 2. Build del progetto
echo "🔨 Building del progetto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completata con successo!"
    
    # 3. Deploy (personalizza con il tuo metodo di upload)
    echo "📤 Upload al server..."
    
    # Esempio con rsync (personalizza con i tuoi dati)
    # rsync -avz --delete ./dist/ user@your-server:/path/to/website/
    
    # Esempio con FTP (se usi FTP)
    # lftp -c "mirror -R ./dist/ ftp://user:pass@server/public_html/"
    
    # Esempio con Netlify CLI
    # npx netlify deploy --prod --dir=dist
    
    echo "🎉 Deploy completato!"
else
    echo "❌ Errore nel build!"
    exit 1
fi
