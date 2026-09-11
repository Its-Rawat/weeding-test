@echo off
title Didi Wedding Website Launcher
echo ========================================================
echo   Starting Didi Wedding Full-Stack Website
echo   Spring Boot Backend + React Three.js Frontend
echo ========================================================

echo.
echo [1/2] Starting Spring Boot REST Backend on port 8080...
start "Didi Wedding Backend" cmd /k "cd /d %~dp0backend && java -jar target\didi-wedding-backend-1.0.0.jar"

timeout /t 6 /nobreak >nul

echo.
echo [2/2] Starting React + Three.js Frontend on port 5173...
start "Didi Wedding Frontend" cmd /k "cd /d %~dp0frontend && node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul

echo.
echo Opening Wedding Website in your browser...
start http://127.0.0.1:5173

echo.
echo ========================================================
echo Website running at: http://127.0.0.1:5173
echo Backend API at:     http://localhost:8080/api/wedding-info
echo Database:           MySQL (Database: 'wedding', User: 'root')
echo ========================================================
echo Press any key to exit this launcher window (servers stay running in background windows).
pause >nul
