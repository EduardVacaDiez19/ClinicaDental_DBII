#!/bin/bash

echo "========================================"
echo "Instalador - Clínica Dental Vaca Diez"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js no está instalado"
    echo ""
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Node.js encontrado"
node --version
echo ""

# Instalar dependencias
echo -e "${YELLOW}[1/3]${NC} Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Error al instalar dependencias"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Dependencias instaladas"
echo ""

# Crear archivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}[2/3]${NC} Creando archivo de configuración..."
    cp .env.example .env
    echo -e "${GREEN}[OK]${NC} Archivo .env creado"
    echo ""
    echo -e "${YELLOW}[IMPORTANTE]${NC} Debes editar el archivo .env con tus datos:"
    echo "  - DB_PASSWORD: Tu contraseña de SQL Server"
    echo "  - JWT_SECRET: Una clave secreta aleatoria"
    echo ""
else
    echo -e "${YELLOW}[2/3]${NC} Archivo .env ya existe"
    echo ""
fi

# Verificar SQL Server
echo -e "${YELLOW}[3/3]${NC} Verificando conexión a SQL Server..."
echo ""
echo -e "${YELLOW}[IMPORTANTE]${NC} Asegúrate de haber ejecutado:"
echo "  database/setup-usuarios.sql en SQL Server"
echo ""

echo "========================================"
echo -e "${GREEN}¡Instalación completada!${NC}"
echo "========================================"
echo ""
echo "Próximos pasos:"
echo "1. Edita el archivo .env con tus credenciales"
echo "2. Ejecuta: npm start"
echo "3. Abre: public/index.html en tu navegador"
echo ""
echo "Usuarios de prueba:"
echo "  Admin: admin / admin123"
echo "  Usuario: usuario / user123"
echo ""
