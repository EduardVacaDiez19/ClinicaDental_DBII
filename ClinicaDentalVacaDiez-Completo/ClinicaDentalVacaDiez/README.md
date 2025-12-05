# 🏥 Sistema de Gestión - Clínica Dental Vaca Diez

Sistema completo de gestión para clínicas dentales con backend API REST en Node.js + Express + SQL Server y frontend en React.

## 📋 Características

### Backend (API REST)
- ✅ Autenticación con JWT
- ✅ Control de roles (Administrador/Usuario)
- ✅ CRUD completo de Pacientes
- ✅ Gestión de Citas con validaciones
- ✅ Consulta de Odontólogos
- ✅ Integración con stored procedures de SQL Server
- ✅ Manejo de triggers y transacciones

### Frontend (React)
- ✅ Login con autenticación
- ✅ Dashboard interactivo
- ✅ Gestión de pacientes
- ✅ Gestión de citas
- ✅ Búsqueda en tiempo real
- ✅ Interfaz moderna y responsive
- ✅ Roles diferenciados

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js 18+
- Express.js
- mssql (cliente SQL Server)
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- React 18
- Fetch API para consumo de servicios
- CSS moderno con variables

### Base de Datos
- SQL Server
- Stored Procedures
- Triggers
- Transacciones
- Índices optimizados

## 📦 Instalación

### 1. Requisitos Previos

- Node.js 18 o superior
- SQL Server (2017 o superior)
- Git (opcional)

### 2. Configurar Base de Datos

1. Ejecuta los scripts SQL en este orden:

```sql
-- 1. Crear las tablas
.\CreacionDeTablas_ClinicaDentalVacaDiez.sql

-- 2. Crear los índices
.\CreacionDeIndices_ClinicaDentalVacaDiez.sql

-- 3. Crear stored procedures
.\storedprocedures_ClinicaDentalVacaDiez.sql

-- 4. Crear triggers
.\Triggers_ClinicaDentalVacaDiez.sql

-- 5. Crear transacciones
.\Transacciones_ClinicaDentalVacaDiez.sql

-- 6. Configurar usuarios (IMPORTANTE)
.\database\setup-usuarios.sql
```

### 3. Instalar Dependencias del Backend

```bash
cd ClinicaDentalVacaDiez
npm install
```

### 4. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# Configuración de la base de datos
DB_SERVER=localhost
DB_DATABASE=ClinicaDental
DB_USER=sa
DB_PASSWORD=TU_PASSWORD_AQUI
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true

# Puerto del servidor
PORT=3000

# JWT Secret (cámbialo en producción)
JWT_SECRET=una_clave_muy_segura_y_aleatoria_2024

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500
```

### 5. Iniciar el Servidor

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### 6. Abrir el Frontend

Abre el archivo `public/index.html` en tu navegador o usa un servidor local:

```bash
# Opción 1: Con Python
python -m http.server 5500

# Opción 2: Con Node.js http-server
npx http-server public -p 5500

# Opción 3: Con Live Server en VS Code
# Clic derecho en index.html -> Open with Live Server
```

Accede a: `http://localhost:5500`

## 👥 Usuarios de Prueba

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo (crear, editar, eliminar)

### Usuario Regular
- **Usuario:** `usuario`
- **Contraseña:** `user123`
- **Permisos:** Solo lectura y agendar citas

### Recepción
- **Usuario:** `recepcion`
- **Contraseña:** `recepcion123`
- **Permisos:** Solo lectura y agendar citas

## 📚 Estructura del Proyecto

```
ClinicaDentalVacaDiez/
├── config/
│   └── database.js          # Configuración de SQL Server
├── controllers/
│   ├── authController.js    # Autenticación
│   ├── pacientesController.js
│   ├── citasController.js
│   └── odontologosController.js
├── middleware/
│   └── auth.js              # Middleware JWT
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── pacientes.js
│   ├── citas.js
│   └── odontologos.js
├── database/
│   └── setup-usuarios.sql   # Script de usuarios
├── public/
│   └── index.html           # Frontend React
├── server.js                # Servidor principal
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
```

### Pacientes (Requiere autenticación)
```
GET    /api/pacientes         # Listar todos
GET    /api/pacientes/:id     # Obtener por ID
GET    /api/pacientes/:id/historial  # Historial del paciente
POST   /api/pacientes         # Crear (admin)
PUT    /api/pacientes/:id     # Actualizar (admin)
DELETE /api/pacientes/:id     # Eliminar (admin)
```

### Citas (Requiere autenticación)
```
GET    /api/citas             # Listar todas
GET    /api/citas/:id         # Obtener por ID
GET    /api/citas/fecha/:fecha # Por fecha
POST   /api/citas             # Crear
PUT    /api/citas/:id         # Actualizar
DELETE /api/citas/:id         # Cancelar (admin)
```

### Odontólogos (Requiere autenticación)
```
GET    /api/odontologos       # Listar todos
GET    /api/odontologos/:id   # Obtener por ID
GET    /api/odontologos/:id/agenda # Agenda del odontólogo
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles
- ✅ Validación de horarios (triggers)
- ✅ Prevención de citas duplicadas
- ✅ Protección contra eliminación de facturas (triggers)
- ✅ Transacciones para operaciones críticas

## 🎯 Reglas de Negocio Implementadas

1. **Horario de Atención:** 08:00 - 20:00 (validado por trigger)
2. **No Duplicar Citas:** Un odontólogo no puede tener dos citas a la misma hora
3. **Integridad de Datos:** Las facturas no se pueden eliminar (protegido por trigger)
4. **Precios:** No se permite bajar precios sin autorización (trigger)
5. **Auditoría:** Se registran todas las eliminaciones de pacientes

## 🧪 Pruebas

### Probar la Conexión
```bash
curl http://localhost:3000/health
```

### Probar Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Probar Endpoints (con token)
```bash
# Obtener el token del login anterior
TOKEN="tu_token_jwt_aqui"

# Listar pacientes
curl http://localhost:3000/api/pacientes \
  -H "Authorization: Bearer $TOKEN"
```

## 📝 Notas Importantes

### En Producción:

1. **Cambia las credenciales por defecto**
2. **Usa variables de entorno seguras**
3. **Configura HTTPS**
4. **Implementa rate limiting**
5. **Añade logs más robustos**
6. **Configura CORS apropiadamente**
7. **Usa un secret JWT fuerte y aleatorio**

### Troubleshooting

**Error de conexión a SQL Server:**
- Verifica que SQL Server esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que SQL Server permita conexiones TCP/IP
- Verifica el firewall

**Error de CORS:**
- Añade tu dominio a `ALLOWED_ORIGINS` en `.env`
- Reinicia el servidor después de cambiar `.env`

**Error 401 Unauthorized:**
- Verifica que el token JWT sea válido
- El token expira en 8 horas por defecto

## 🚀 Características Futuras

- [ ] Reportes en PDF
- [ ] Notificaciones por email
- [ ] Calendario visual de citas
- [ ] Gestión de tratamientos
- [ ] Historia clínica completa
- [ ] Dashboard de estadísticas
- [ ] Exportación de datos
- [ ] App móvil

## 👨‍💻 Autor

Desarrollado por Edu para la Clínica Dental Vaca Diez

## 📄 Licencia

MIT License - Uso libre para fines educativos y comerciales

---

**¿Necesitas ayuda?** Abre un issue o contacta al equipo de desarrollo.
