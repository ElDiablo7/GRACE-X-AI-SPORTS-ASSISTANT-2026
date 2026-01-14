@echo off
setlocal
cd /d "%~dp0"

REM Optional first argument sets the port, default 3001
set PORT=%1
if "%PORT%"=="" set PORT=3001

REM Install dependencies on first run
if not exist node_modules (
  echo Installing dependencies...
  npm install
)

echo Starting server on port %PORT%...
start "" cmd /c "set PORT=%PORT% && npm start"

REM Open browser after a short delay
timeout /t 2 /nobreak >nul
start "" "http://localhost:%PORT%/"
