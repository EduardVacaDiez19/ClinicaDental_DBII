# 📚 Índice de Archivos - Clínica Dental Vaca Diez

## 🎯 ¿Por dónde empezar?

### 1️⃣ Primero: Lee esto
📄 **[RESUMEN_PROYECTO.md](computer:///mnt/user-data/outputs/RESUMEN_PROYECTO.md)** - Visión general completa del proyecto

### 2️⃣ Instalación Rápida
📋 **[INICIO_RAPIDO.md](computer:///mnt/user-data/outputs/INICIO_RAPIDO.md)** - Guía paso a paso para ejecutar

### 3️⃣ Referencia Visual
🎨 **[GUIA_VISUAL.md](computer:///mnt/user-data/outputs/GUIA_VISUAL.md)** - Cómo debe verse el sistema

---

## 📦 Archivos Principales

### Proyecto Completo
🗜️ **[clinica-dental-vacadiez.tar.gz](computer:///mnt/user-data/outputs/clinica-dental-vacadiez.tar.gz)** - Todo el código fuente (30 MB)
- Backend (Node.js + Express)
- Frontend (React + Vite)
- Configuración completa
- README técnico detallado

**Para extraer:**
```bash
tar -xzf clinica-dental-vacadiez.tar.gz
cd clinica-dental-vacadiez
```

---

## 🗄️ Scripts de Base de Datos

⚠️ **Ejecutar EN ESTE ORDEN:**

1. **[CreacionDeTablas_ClinicaDentalVacaDiez.sql](computer:///mnt/user-data/outputs/CreacionDeTablas_ClinicaDentalVacaDiez.sql)**
   - Crea la base de datos
   - Define 12 tablas
   - Inserta datos de prueba (1000 pacientes, 10 odontólogos, etc.)

2. **[CreacionDeIndices_ClinicaDentalVacaDiez.sql](computer:///mnt/user-data/outputs/CreacionDeIndices_ClinicaDentalVacaDiez.sql)**
   - Crea índices para optimización
   - Mejora el rendimiento de consultas

3. **[storedprocedures_ClinicaDentalVacaDiez.sql](computer:///mnt/user-data/outputs/storedprocedures_ClinicaDentalVacaDiez.sql)**
   - 5 Stored Procedures
   - Lógica de negocio (agendar citas, pacientes, etc.)

4. **[Transacciones_ClinicaDentalVacaDiez.sql](computer:///mnt/user-data/outputs/Transacciones_ClinicaDentalVacaDiez.sql)**
   - 3 Transacciones complejas
   - Operaciones atómicas (cancelar citas, eliminar pacientes, etc.)

5. **[Triggers_ClinicaDentalVacaDiez.sql](computer:///mnt/user-data/outputs/Triggers_ClinicaDentalVacaDiez.sql)**
   - 4 Triggers
   - Validaciones automáticas y auditoría

6. ⚠️ **[InsertUsuariosPrueba.sql](computer:///mnt/user-data/outputs/InsertUsuariosPrueba.sql)** - **¡MUY IMPORTANTE!**
   - Crea usuarios de prueba
   - Admin: `admin` / `admin123`
   - Usuario: `usuario` / `usuario123`
   - ⚠️ **Sin esto no podrás iniciar sesión**

---

## 🔧 Scripts de Instalación

### Para Windows
🪟 **[install.bat](computer:///mnt/user-data/outputs/install.bat)**
```cmd
install.bat
```

### Para Linux/Mac
🐧 **[install.sh](computer:///mnt/user-data/outputs/install.sh)**
```bash
chmod +x install.sh
./install.sh
```

**Estos scripts:**
- Verifican Node.js
- Instalan dependencias backend
- Instalan dependencias frontend
- Muestran instrucciones para continuar

---

## 📖 Estructura del Sistema

### Backend (Node.js + Express)
- **Puerto:** 3001
- **API RESTful:** 15+ endpoints
- **Autenticación:** JWT
- **Base de datos:** SQL Server

### Frontend (React + Vite)
- **Puerto:** 5173
- **Framework:** React 18
- **Router:** React Router v6
- **HTTP:** Axios
- **Iconos:** Lucide React

### Base de Datos (SQL Server)
- **12 Tablas:** Pacientes, Odontólogos, Citas, Tratamientos, etc.
- **5 Stored Procedures**
- **4 Triggers**
- **3 Transacciones**
- **Índices optimizados**

---

## 🎨 Características del Diseño

- ✨ Moderno y minimalista
- 🎨 Gradiente púrpura (#667eea → #764ba2)
- 📱 Totalmente responsive
- 🖱️ Animaciones suaves
- 🎯 Interfaz intuitiva

---

## 👥 Sistema de Roles

### 🔑 Administrador
- Dashboard con estadísticas
- CRUD completo de pacientes
- CRUD completo de citas (incluye cancelar)
- Ver odontólogos y tratamientos
- Crear nuevos usuarios

### 👤 Usuario
- Gestionar pacientes
- Agendar y ver citas
- Ver odontólogos y tratamientos

---

## 🚀 Inicio Rápido (3 pasos)

### Paso 1: Base de Datos
Ejecutar los 6 scripts SQL en orden en SQL Server

### Paso 2: Configuración
Editar `.env` con tus credenciales:
```
DB_USER=sa
DB_PASSWORD=TuContraseña
```

### Paso 3: Ejecutar
```bash
# Terminal 1
node server.js

# Terminal 2
cd client && npm run dev
```

**Acceder a:** http://localhost:5173

---

## 📞 Ayuda

### 🐛 Problemas Comunes

**"Cannot connect to database"**
- Verifica que SQL Server esté corriendo
- Confirma credenciales en `.env`

**"Cannot find module"**
- Ejecuta `npm install` en raíz y en `/client`

**"Login failed"**
- ¿Ejecutaste `InsertUsuariosPrueba.sql`?
- Verifica los hashes de contraseñas

### 📚 Documentación Completa

Dentro del proyecto descomprimido:
- `README.md` - Documentación técnica completa
- Comentarios en el código fuente

---

## ✅ Checklist de Instalación

- [ ] Extraer `clinica-dental-vacadiez.tar.gz`
- [ ] SQL Server instalado y corriendo
- [ ] Ejecutar 6 scripts SQL en orden
- [ ] Usuarios de prueba creados (InsertUsuariosPrueba.sql)
- [ ] Archivo `.env` configurado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Backend corriendo (puerto 3001)
- [ ] Frontend corriendo (puerto 5173)
- [ ] Login exitoso con admin/admin123

---

## 🎉 ¡Todo Listo!

Tienes un sistema completo y funcional de gestión para la Clínica Dental Vaca Diez.

**Archivos totales:** 14
**Tamaño total:** ~30 MB
**Líneas de código:** ~3,500+

---

**Desarrollado con ❤️ para Clínica Dental Vaca Diez**

Versión 1.0 - Noviembre 2025
