@echo off
title National Trade Portal (NIPP) Launcher
echo ==============================================
echo   LAUNCHING NATIONAL INDIAN TRADE PORTAL
echo   (User Centered Design MERN Stack Project)
echo ==============================================
echo.

:: Check for node_modules in backend
if not exist "backend\node_modules\" (
    echo [INFO] Installing backend dependencies...
    cd backend && call npm install && cd ..
)

:: Check for node_modules in frontend
if not exist "frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

echo [INFO] Starting Backend Server (Port 5000) in a new window...
start "NIPP Backend Server" cmd /k "cd backend && npm run dev"

echo [INFO] Starting Frontend React Client (Port 5173) in a new window...
start "NIPP Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================
echo   Application Launcher has completed.
echo   - Backend API: http://localhost:5000
echo   - Frontend UI: http://localhost:5173
echo ==============================================
pause
