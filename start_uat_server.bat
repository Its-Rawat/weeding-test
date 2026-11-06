@echo off
title Wedding Website UAT View-Only Local Server
color 0E
echo ======================================================================
echo    CHANDRIKA ^& XUDONG WEDDING WEBSITE - LOCAL UAT PREVIEW (VIEW ONLY)
echo ======================================================================
echo.
echo Starting local UAT server on http://localhost:3000 ...
echo [Protected]: Production MySQL database will NOT be touched.
echo [Streaming]: Video and audio streaming fully supported (HTTP 206).
echo.
cd /d "%~dp0"
python uat_server.py 3000
pause
