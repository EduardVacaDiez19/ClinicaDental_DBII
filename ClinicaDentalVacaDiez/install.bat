@echo off
echo ========================================
echo Instalador - Clinica Dental Vaca Diez
echo ========================================
echo.

:: Verificar si Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

:: Instalar dependencias
echo [1/3] Instalando dependencias...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo [OK] Dependencias instaladas
echo.

:: Crear archivo .env si no existe
if not exist .env (
    echo [2/3] Creando archivo de configuracion...
    copy .env.example .env
    echo [OK] Archivo .env creado
    echo.
    echo [IMPORTANTE] Debes editar el archivo .env con tus datos:
    echo   - DB_PASSWORD: Tu contraseña de SQL Server
    echo   - JWT_SECRET: Una clave secreta aleatoria
    echo.
) else (
    echo [2/3] Archivo .env ya existe
    echo.
)

:: Verificar SQL Server
echo [3/3] Verificando conexion a SQL Server...
echo.
echo [IMPORTANTE] Asegurate de haber ejecutado:
echo   database/setup-usuarios.sql en SQL Server
echo.

echo ========================================
echo Instalacion completada!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Edita el archivo .env con tus credenciales
echo 2. Ejecuta: npm start
echo 3. Abre: public/index.html en tu navegador
echo.
echo Usuarios de prueba:
echo   Admin: admin / admin123
echo   Usuario: usuario / user123
echo.
pause
