# 🏥 Sistema Completo - Clínica Dental Vaca Diez

## ✅ LO QUE HE CREADO PARA TI

He desarrollado un sistema COMPLETO para tu clínica dental que incluye:

### 📦 Backend (API REST - Node.js)
- ✅ Servidor Express.js profesional
- ✅ Autenticación JWT segura
- ✅ Conexión a SQL Server
- ✅ Controladores para Pacientes, Citas y Odontólogos
- ✅ Middleware de autenticación y autorización
- ✅ Integración con tus stored procedures
- ✅ Manejo de errores robusto
- ✅ CORS configurado
- ✅ Documentación de API

### 🎨 Frontend (React)
- ✅ Interfaz moderna y minimalista
- ✅ Login con autenticación real
- ✅ Dashboard interactivo
- ✅ Gestión completa de pacientes
- ✅ Gestión completa de citas
- ✅ Búsqueda en tiempo real
- ✅ Diseño responsive
- ✅ Modales para formularios
- ✅ Indicadores visuales de estado

### 🗄️ Base de Datos
- ✅ Scripts SQL para crear usuarios
- ✅ Usuarios de prueba con contraseñas hasheadas
- ✅ Integración con tus tablas existentes
- ✅ Validaciones con triggers
- ✅ Transacciones implementadas

## 📂 ARCHIVOS ENTREGADOS

```
ClinicaDentalVacaDiez/
│
├── 📄 README.md                    # Documentación completa
├── 📄 QUICKSTART.md                # Guía rápida
├── 📄 package.json                 # Dependencias Node.js
├── 📄 .env.example                 # Plantilla de configuración
├── 📄 .gitignore                   # Para control de versiones
├── 📄 server.js                    # Servidor principal
│
├── config/
│   └── database.js                 # Configuración SQL Server
│
├── controllers/                    # Lógica de negocio
│   ├── authController.js           # Login y registro
│   ├── pacientesController.js      # CRUD pacientes
│   ├── citasController.js          # CRUD citas
│   └── odontologosController.js    # Consulta odontólogos
│
├── middleware/
│   └── auth.js                     # Autenticación JWT
│
├── routes/                         # Rutas de la API
│   ├── auth.js
│   ├── pacientes.js
│   ├── citas.js
│   └── odontologos.js
│
├── database/
│   └── setup-usuarios.sql          # ⭐ IMPORTANTE: Crear usuarios
│
└── public/
    └── index.html                  # Frontend React completo
```

## 🚀 CÓMO INICIAR (PASO A PASO)

### 1️⃣ Preparar Base de Datos (10 minutos)

```sql
-- En SQL Server Management Studio, ejecuta EN ORDEN:

-- Ya ejecutados (tu base de datos actual):
✅ CreacionDeTablas_ClinicaDentalVacaDiez.sql
✅ CreacionDeIndices_ClinicaDentalVacaDiez.sql
✅ storedprocedures_ClinicaDentalVacaDiez.sql
✅ Triggers_ClinicaDentalVacaDiez.sql
✅ Transacciones_ClinicaDentalVacaDiez.sql

-- NUEVO - Debes ejecutar:
⭐ database/setup-usuarios.sql
```

Este último script creará:
- Tabla Usuarios (si no existe)
- Tabla Roles (si no existe)
- 3 usuarios de prueba con contraseñas hasheadas

### 2️⃣ Instalar Backend (5 minutos)

```bash
# 1. Navegar a la carpeta del proyecto
cd ClinicaDentalVacaDiez

# 2. Instalar dependencias de Node.js
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env con tus datos
# Necesitas cambiar:
#   - DB_SERVER (tu servidor, ej: localhost o IP)
#   - DB_PASSWORD (tu contraseña de SQL Server)
#   - JWT_SECRET (genera una clave aleatoria)

# 5. Iniciar el servidor
npm start
```

Verás algo como:
```
=================================
🏥 Clínica Dental Vaca Diez API
=================================
✅ Servidor corriendo en puerto 3000
📍 URL: http://localhost:3000
=================================
```

### 3️⃣ Abrir Frontend (2 minutos)

**Opción A - Simple (Doble clic):**
- Abre: `public/index.html` en tu navegador

**Opción B - Con servidor local (Recomendado):**
```bash
# Desde la carpeta del proyecto
npx http-server public -p 5500

# Abre en navegador: http://localhost:5500
```

### 4️⃣ Probar el Sistema (2 minutos)

1. Abre el frontend
2. Usa estas credenciales:
   - **Admin:** admin / admin123
   - **Usuario:** usuario / user123
3. ¡Explora el sistema!

## 🔑 USUARIOS CREADOS

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | admin123 | Administrador | Crear, Editar, Eliminar todo |
| usuario | user123 | Usuario | Ver y Agendar citas |
| recepcion | recepcion123 | Usuario | Ver y Agendar citas |

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Para Administradores
- Ver todos los pacientes
- Crear nuevos pacientes
- Editar información de pacientes
- Eliminar pacientes (con validaciones)
- Ver todas las citas
- Agendar nuevas citas
- Cancelar citas
- Ver detalles completos

### ✅ Para Usuarios
- Ver todos los pacientes
- Ver detalles de pacientes
- Ver todas las citas
- Agendar nuevas citas
- Ver detalles de citas

### ✅ Validaciones Automáticas
- No se pueden agendar citas fuera del horario (8am-8pm)
- No se pueden duplicar citas del mismo doctor
- Las contraseñas están encriptadas con bcrypt
- Los tokens JWT expiran en 8 horas
- Las facturas no se pueden eliminar (trigger)
- Los precios no se pueden bajar sin autorización (trigger)

## 📡 API ENDPOINTS DISPONIBLES

### Autenticación
```
POST /api/auth/login
POST /api/auth/register
```

### Pacientes (requiere login)
```
GET    /api/pacientes              # Listar todos
GET    /api/pacientes/:id          # Uno específico
GET    /api/pacientes/:id/historial # Historial médico
POST   /api/pacientes              # Crear (admin)
PUT    /api/pacientes/:id          # Actualizar (admin)
DELETE /api/pacientes/:id          # Eliminar (admin)
```

### Citas (requiere login)
```
GET    /api/citas                  # Listar todas
GET    /api/citas/:id              # Una específica
GET    /api/citas/fecha/:fecha     # Por fecha
POST   /api/citas                  # Crear
PUT    /api/citas/:id              # Actualizar
DELETE /api/citas/:id              # Cancelar (admin)
```

### Odontólogos (requiere login)
```
GET    /api/odontologos            # Listar todos
GET    /api/odontologos/:id        # Uno específico
GET    /api/odontologos/:id/agenda # Agenda del doctor
```

## 🔧 CONFIGURACIÓN DEL ARCHIVO .env

```env
# Base de datos SQL Server
DB_SERVER=localhost                    # Tu servidor SQL
DB_DATABASE=ClinicaDental             # Nombre de tu BD
DB_USER=sa                            # Usuario SQL
DB_PASSWORD=TU_PASSWORD               # ⭐ Cambiar
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true

# Servidor backend
PORT=3000

# Seguridad JWT
JWT_SECRET=cambiar_por_texto_aleatorio_muy_largo  # ⭐ Cambiar

# CORS (dominios permitidos)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500
```

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### 1. "Cannot connect to database"
**Solución:**
- ✅ Verifica que SQL Server esté corriendo
- ✅ Revisa usuario y contraseña en .env
- ✅ Verifica que el puerto 1433 esté abierto
- ✅ En SQL Server Configuration Manager, habilita TCP/IP

### 2. "CORS policy error"
**Solución:**
- ✅ Añade la URL de tu frontend a ALLOWED_ORIGINS en .env
- ✅ Reinicia el servidor backend con npm start

### 3. "Invalid credentials" al hacer login
**Solución:**
- ✅ Ejecuta el script database/setup-usuarios.sql
- ✅ Verifica que la tabla Usuarios tenga registros
- ✅ Los hashes de contraseña deben coincidir con el script

### 4. "Port 3000 already in use"
**Solución:**
- ✅ Cambia PORT=3001 en .env
- ✅ O cierra la app que usa el puerto 3000

### 5. Frontend no se conecta con backend
**Solución:**
- ✅ Verifica que el backend esté corriendo (http://localhost:3000/health)
- ✅ Revisa la consola del navegador (F12) para ver errores
- ✅ Asegúrate de que la URL en ApiService sea correcta

## 📱 PRÓXIMOS PASOS SUGERIDOS

### Personalización Básica
1. Cambia los colores en el CSS (variables CSS en el `<style>`)
2. Añade el logo real de tu clínica
3. Personaliza los mensajes de bienvenida

### Seguridad para Producción
1. Cambia todas las contraseñas por defecto
2. Genera un JWT_SECRET fuerte y aleatorio
3. Configura HTTPS
4. Añade rate limiting
5. Implementa logs más detallados

### Funcionalidades Adicionales
1. Reportes en PDF
2. Envío de emails para confirmación de citas
3. Recordatorios automáticos
4. Historia clínica detallada
5. Gestión de pagos y facturas
6. Dashboard con gráficas
7. Calendario visual

## 🛠️ TECNOLOGÍAS USADAS

**Backend:**
- Node.js 18+
- Express.js 4.18
- mssql 10.0 (SQL Server client)
- jsonwebtoken 9.0
- bcryptjs 2.4
- cors, dotenv, body-parser

**Frontend:**
- React 18
- Vanilla CSS (sin frameworks)
- Fetch API

**Base de Datos:**
- SQL Server
- Stored Procedures
- Triggers
- Transacciones

## 📞 SOPORTE Y AYUDA

Si tienes problemas:

1. **Revisa los logs:**
   - Backend: Consola donde ejecutaste `npm start`
   - Frontend: Consola del navegador (F12)

2. **Verifica la conexión:**
   - Health check: http://localhost:3000/health
   - Debe responder: `{"status":"OK","database":"Connected"}`

3. **Prueba los endpoints:**
   - Documentación: http://localhost:3000/
   - Lista todos los endpoints disponibles

## ✨ CARACTERÍSTICAS ESPECIALES

### 🔒 Seguridad
- Contraseñas encriptadas con bcrypt (10 rounds)
- Tokens JWT con expiración
- Middleware de autenticación
- Control de roles granular
- Validación de datos en backend

### 🚀 Performance
- Índices optimizados en SQL Server
- Conexión pool para base de datos
- Queries eficientes
- Paginación lista para implementar

### 💼 Profesional
- Código limpio y documentado
- Estructura modular y escalable
- Manejo de errores apropiado
- Logs informativos
- Preparado para producción

## 🎉 ¡LISTO PARA USAR!

Todo está configurado y listo. Solo necesitas:
1. ✅ Ejecutar el script de usuarios
2. ✅ Configurar tu .env
3. ✅ Ejecutar npm install
4. ✅ Iniciar con npm start
5. ✅ Abrir el frontend

**¡Tu clínica dental ya tiene un sistema moderno de gestión!** 🦷✨

---

**Desarrollado con 💙 para Clínica Dental Vaca Diez**

*¿Preguntas? Revisa README.md o QUICKSTART.md*
