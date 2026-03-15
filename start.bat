@echo off
chcp 65001 >nul
title Miclan Notes

echo.
echo ========================================
echo     Iniciando Miclan Notes...
echo ========================================
echo.

cd /d "%~dp0"

if not exist .env (
    echo ERROR: No existe el archivo .env
    echo Copia .env.example a .env y configura tus rutas
    pause
    exit /b 1
)

if not exist backend\node_modules (
    echo [1/4] Instalando dependencias del backend...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias del backend
        pause
        exit /b 1
    )
    cd ..
)

if not exist frontend\node_modules (
    echo [2/4] Instalando dependencias del frontend...
    cd frontend
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias del frontend
        pause
        exit /b 1
    )
    cd ..
)

echo [3/4] Iniciando servidor backend...
start "Miclan Notes - Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

echo [4/4] Iniciando servidor frontend...
start "Miclan Notes - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   Miclan Notes iniciado!
echo ========================================
echo.
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo.
echo   Presiona cualquier tecla para salir...
echo.

pause >nul
