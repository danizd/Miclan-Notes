@echo off
chcp 65001 >nul
title Miclan Notes

echo.
echo ========================================
echo     Iniciando Miclan Notes...
echo ========================================
echo.

cd /d "%~dp0"

if not exist backend\.env (
    echo ERROR: No existe el archivo backend\.env
    echo Copia .env.example a backend\.env y configura tus rutas
    pause
    exit /b 1
)

if not exist backend\node_modules (
    echo [1/5] Instalando dependencias del backend...
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
    echo [2/5] Instalando dependencias del frontend...
    cd frontend
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias del frontend
        pause
        exit /b 1
    )
    cd ..
)

if not exist backend\public\index.html (
    echo [3/5] Compilando frontend...
    cd frontend
    call npm run build
    if errorlevel 1 (
        echo ERROR: Fallo al compilar el frontend
        pause
        exit /b 1
    )
    cd ..
    
    echo [4/5] Copiando frontend compilado...
    if not exist backend\public mkdir backend\public
    xcopy /E /I /Y frontend\dist\* backend\public\
) else (
    echo [3/5] Frontend ya compilado
    echo [4/5] Frontend ya copiado
)

echo [5/5] Iniciando servidor backend...
start "Miclan Notes - Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

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
