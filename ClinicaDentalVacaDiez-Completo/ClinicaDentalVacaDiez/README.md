# ClinicaDentalVacaDiez - Sistema Completo

## Descripción

Sistema de gestión completo para Clínica Dental Vaca Diez. Implementación production-ready con arquitectura RESTful, autenticación JWT, y gestión integral de citas, pacientes, odontólogos, tratamientos y facturación.

## Estructura del Proyecto

```
ClinicaDentalVacaDiez/
├── config/              # Configuración de base de datos
│   └── database.js      # Pool de conexiones SQL Server
├── controllers/         # Lógica de negocio
│   ├── authController.js       # Autenticación y autorización
│   ├── citasController.js      # Gestión de citas
│   ├── pacientesController.js  # CRUD de pacientes
│   ├── odontologosController.js # CRUD de odontólogos
│   ├── tratamientosController.js # Catálogo de tratamientos
│   ├── segurosController.js    # Seguros médicos
│   └── dashboardController.js  # Estadísticas y métricas
├── middleware/          # Middleware de Express
│   └── auth.js          # Autenticación JWT y autorización por roles
├── routes/              # Definición de endpoints
│   ├── auth.js          # Rutas de autenticación
│   ├── citas.js         # Rutas de citas
│   ├── pacientes.js     # Rutas de pacientes
│   ├── odontologos.js   # Rutas de odontólogos
│   ├── tratamientos.js  # Rutas de tratamientos
│   ├── seguros.js       # Rutas de seguros
│   └── dashboard.js     # Rutas de estadísticas
└── server.js            # Punto de entrada principal
```

## Instalación y Configuración

### Prerrequisitos

- Node.js >= 14.x
- SQL Server 2019 o superior
- npm o yarn

### Instalación

```bash
# Clonar repositorio
cd ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### Variables de Entorno

Crear archivo `.env` con:

```env
# Base de Datos
DB_SERVER=localhost
DB_DATABASE=ClinicaDental
DB_USER=sa
DB_PASSWORD=tu_contraseña
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion

# Servidor
PORT=3000
NODE_ENV=development
```

### Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## API Endpoints

### Autenticación

#### POST `/api/auth/login`
Autentica usuario y retorna token JWT.

**Body:**
```json
{
  "username": "usuario@example.com",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "Administrador"
  }
}
```

#### POST `/api/auth/register`
Registra nuevo usuario.

**Body:**
```json
{
  "username": "nuevo@example.com",
  "password": "contraseña123",
  "roleId": 2
}
```

### Citas

#### GET `/api/citas`
Obtiene todas las citas (requiere autenticación).

#### GET `/api/citas/:id`
Obtiene cita por ID.

#### POST `/api/citas`
Crea nueva cita.

**Body:**
```json
{
  "pacienteId": 1,
  "odontologoId": 2,
  "fecha": "2024-12-10",
  "hora": "14:30",
  "motivo": "Limpieza dental",
  "tratamientoId": 3
}
```

#### PUT `/api/citas/:id`
Actualiza cita existente.

#### DELETE `/api/citas/:id`
Cancela cita (admin o paciente propietario).

#### GET `/api/citas/fecha/:fecha`
Obtiene citas de una fecha específica.

#### GET `/api/citas/:id/detalle-pago`
Obtiene pre-factura de una cita.

#### POST `/api/citas/:id/generar-factura`
Genera factura final.

**Body:**
```json
{
  "metodoPago": "Tarjeta"
}
```

### Pacientes

#### GET `/api/pacientes`
Lista todos los pacientes (solo admin).

#### GET `/api/pacientes/:id`
Obtiene paciente por ID.

#### POST `/api/pacientes`
Crea nuevo paciente (solo admin).

**Body:**
```json
{
  "nombre": "María",
  "apellido": "González",
  "fechaNacimiento": "1990-05-15",
  "genero": "F",
  "telefono": "555-1234",
  "correo": "maria@example.com",
  "direccion": "Av. Principal 123",
  "tipoSeguro": "Básico"
}
```

#### PUT `/api/pacientes/:id`
Actualiza paciente (solo admin).

#### DELETE `/api/pacientes/:id`
Elimina paciente y registros relacionados (solo admin).

#### GET `/api/pacientes/:id/historial`
Obtiene historial médico del paciente.

### Odontólogos

#### GET `/api/odontologos`
Lista todos los odontólogos.

#### GET `/api/odontologos/:id`
Obtiene odontólogo por ID.

#### GET `/api/odontologos/:id/agenda`
Obtiene agenda de citas del odontólogo.

**Query params:**
- `fecha` (opcional): Filtrar por fecha específica

#### POST `/api/odontologos`
Crea nuevo odontólogo (solo admin).

**Body:**
```json
{
  "nombre": "Dr. Carlos",
  "apellido": "Ramírez",
  "especialidad": "Ortodoncia",
  "telefono": "555-5678",
  "correo": "carlos@clinica.com"
}
```

### Tratamientos

#### GET `/api/tratamientos`
Lista todos los tratamientos disponibles con costos.

### Seguros

#### GET `/api/seguros`
Lista todos los seguros médicos con descuentos.

### Dashboard

#### GET `/api/dashboard/admin`
Estadísticas para administradores (solo admin).

**Response:**
```json
{
  "citasHoy": 5,
  "doctoresActivos": 3,
  "pacientesTotales": 150,
  "totalFacturado": 25000.50,
  "alertasStock": [...]
}
```

#### GET `/api/dashboard/paciente/:pacienteId`
Estadísticas para pacientes.

**Response:**
```json
{
  "proximaCita": {...},
  "citasPendientes": 2,
  "tipoSeguro": "Premium"
}
```

## Middleware

### `authenticateToken`
Verifica token JWT en header `Authorization: Bearer <token>`.

**Uso:**
```javascript
router.get('/ruta-protegida', authenticateToken, handler);
```

### `authorizeRole(...roles)`
Verifica que el usuario tenga uno de los roles especificados.

**Uso:**
```javascript
router.delete('/admin-only',
  authenticateToken,
  authorizeRole('Administrador'),
  handler
);
```

## Modelos de Base de Datos

### Tablas Principales

- **Usuarios**: Autenticación y autorización
- **Roles**: Administrador, Usuario
- **Pacientes**: Información de pacientes
- **Odontologos**: Información de doctores
- **Citas**: Agendamiento de consultas
- **Tratamientos**: Catálogo de servicios
- **Seguros**: Planes de seguro médico
- **Facturas**: Facturación de servicios
- **DetalleFactura**: Líneas de factura
- **Medicamentos**: Inventario de medicamentos

### Stored Procedures

- `sp_GenerarFactura`: Genera factura completa con cálculos
- `sp_EliminarPacienteCompleto`: Elimina paciente y relaciones en cascada
- `obtenerhistorialpaciente`: Retorna historial médico completo

## Seguridad

### Autenticación
- Tokens JWT con expiración de 8 horas
- Passwords hasheados con bcrypt (salt=10)
- Validación de credenciales contra BD

### Autorización
- Middleware de roles granular
- Validación de permisos por endpoint
- Usuarios solo pueden acceder a sus propios datos
- Administradores tienen acceso completo

### Validaciones
- Validación de existencia de recursos antes de operaciones
- Validación de campos requeridos
- Sanitización de inputs
- Manejo de errores con mensajes apropiados

## Manejo de Errores

Todos los endpoints retornan errores en formato JSON:

```json
{
  "error": "Descripción del error"
}
```

### Códigos HTTP

- `200`: Éxito
- `201`: Recurso creado
- `400`: Error de validación
- `401`: No autenticado
- `403`: No autorizado
- `404`: Recurso no encontrado
- `500`: Error del servidor

## Logging

El sistema incluye logging en consola para:
- Conexiones a base de datos
- Errores de queries
- Autenticación fallida
- Operaciones críticas

## Performance

### Optimizaciones

- Pool de conexiones SQL Server (max: 10, min: 0)
- Patrón singleton para conexión a BD
- Índices en tablas principales
- Queries optimizadas con JOINs apropiados

### Límites

- Timeout de conexión idle: 30 segundos
- Tamaño máximo de pool: 10 conexiones
- Token JWT expira en 8 horas

## Troubleshooting

### Error de Conexión a BD

```
❌ Error conectando a SQL Server
```

**Solución:**
1. Verificar que SQL Server esté corriendo
2. Validar credenciales en `.env`
3. Confirmar firewall permite puerto 1433
4. Verificar `trustServerCertificate=true` si es desarrollo local

### Token Inválido

```
{ "error": "Token inválido o expirado" }
```

**Solución:**
1. Verificar que JWT_SECRET sea el mismo en servidor
2. Re-autenticarse para obtener nuevo token
3. Verificar formato del header: `Authorization: Bearer <token>`

### Permisos Denegados

```
{ "error": "Acceso denegado. No tiene los permisos requeridos." }
```

**Solución:**
1. Verificar que el usuario tenga el rol apropiado
2. Confirmar que el token sea válido
3. Revisar que el middleware de autorización esté configurado correctamente

## Scripts Útiles

El directorio raíz contiene scripts de utilidad:

- `debug-db.js`: Verifica conexión a BD
- `test-login.js`: Prueba endpoint de login
- `reset-password.js`: Resetea contraseña de usuario
- `check_seguros.js`: Verifica tabla de seguros
- `list_tables.js`: Lista todas las tablas de BD

## Desarrollo

### Agregar Nuevo Endpoint

1. Crear función en controlador apropiado
2. Añadir JSDOC completo
3. Definir ruta en archivo de rutas
4. Aplicar middleware de autenticación/autorización
5. Documentar en este README

### Convenciones de Código

- Usar async/await para operaciones asíncronas
- Manejar todos los errores con try/catch
- Retornar siempre JSON
- Usar nombres descriptivos en español
- Documentar con JSDOC

## Licencia

Proyecto académico - Universidad [Nombre]

## Contacto

Para soporte o consultas, contactar al equipo de desarrollo.
