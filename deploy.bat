@echo off
REM Script di deploy automatico per Brix-IA (Windows)

echo 🚀 Avvio deploy Brix-IA...

REM 1. Build del progetto
echo 🔨 Building del progetto...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build completata con successo!
    
    REM 2. Deploy - personalizza con il tuo metodo
    echo 📤 Upload al server...
    
    REM Esempio con Netlify CLI
    REM call npx netlify deploy --prod --dir=dist
    
    REM Esempio con SCP (se hai SSH configurato)
    REM scp -r .\dist\* user@server:/path/to/website/
    
    echo 🎉 Deploy completato!
    echo.
    echo Per personalizzare il deploy, modifica questo file con:
    echo - Netlify CLI: npx netlify deploy --prod --dir=dist
    echo - FTP: con WinSCP o simili
    echo - rsync: se hai WSL configurato
    
) else (
    echo ❌ Errore nel build!
    pause
    exit /b 1
)

pause
