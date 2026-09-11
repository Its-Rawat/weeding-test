@echo off
title Didi Wedding Frontend (React + Three.js)
cd /d "%~dp0frontend"
echo ========================================================
echo   Starting Didi Wedding Frontend on http://127.0.0.1:5173
echo ========================================================
echo.
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
pause
