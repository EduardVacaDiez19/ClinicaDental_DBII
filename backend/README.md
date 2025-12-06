# Backend - Clínica Dental Vaca Diez

## Descripción

Directorio del backend alternativo/legacy del sistema de gestión de clínica dental. Contiene una implementación simplificada con funcionalidades básicas de autenticación y conexión a base de datos.

## Estructura

```
backend/
├── controllers/          # Controladores de lógica de negocio
│   ├── authController.js # Autenticación y registro de usuarios
│   └── verify_all_fixes.test.js # Suite de tests de verificación
├── routes/              # Definición de rutas HTTP
│   └── authRoutes.js    # Rutas de autenticación
├── tests/               # Tests unitarios y de integración
│   ├── authController.test.js # Tests del controlador de auth
│   └── new_fixes_verification.test.js # Tests de bugs corregidos
├── db.js                # Módulo de conexión a base de datos
└── server.js            # Punto de entrada del servidor Express
```

## Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto con:

```env
# Base de Datos
DB_SERVER=localhost
DB_DATABASE=ClinicaDental
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Servidor
PORT=5000
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Ejecutar tests
npm test
```

## Módulos Principales

### `db.js`
Módulo de conexión a SQL Server con patrón singleton y fallback a mock para desarrollo.

**Funciones principales:**
- `getConnection()`: Obtiene pool de conexiones
- `getRequest()`: Obtiene request object para queries
- `mockRequest`: Request simulado para desarrollo sin BD

### `controllers/authController.js`
Controlador de autenticación con soporte para registro y login.

**Endpoints:**
- `POST /api/auth/register`: Registro de nuevos usuarios
- `POST /api/auth/login`: Autenticación y generación de JWT

**Características:**
- Hash de contraseñas con bcrypt (salt=10)
- Generación de tokens JWT con expiración de 1h
- Fallback a modo mock si BD no disponible
- Validación de esquema correcto (NombreUsuario, PasswordHash, RolID)

### `server.js`
Servidor Express con configuración de middleware y rutas.

**Middleware configurado:**
- CORS para desarrollo
- Body parser para JSON
- Rutas de autenticación en `/api/auth`

## Tests

### Ejecutar Tests

```bash
# Todos los tests
node controllers/verify_all_fixes.test.js
node tests/authController.test.js
node tests/new_fixes_verification.test.js

# O usar npm
npm test
```

### Cobertura de Tests

- **verify_all_fixes.test.js**: 8 tests de verificación de bugs históricos
- **authController.test.js**: 6 tests de esquema y funcionalidad de auth
- **new_fixes_verification.test.js**: 7 tests de bugs corregidos recientemente

## Notas de Desarrollo

### Diferencias con ClinicaDentalVacaDiez-Completo

Este backend es una versión simplificada. Para producción, usar el backend completo en:
`/ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez/`

### Modo Mock

El sistema incluye fallbacks a datos mock cuando la BD no está disponible, útil para:
- Desarrollo sin acceso a SQL Server
- Tests de integración
- Demos y presentaciones

### Esquema de Base de Datos

El controlador usa el esquema correcto:
- `NombreUsuario` (no `Username`)
- `PasswordHash` (no `Password`)
- `RolID` como INT (no `Rol` como string)

## Dependencias Principales

- **express**: Framework web
- **mssql**: Cliente SQL Server
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Generación de tokens JWT
- **dotenv**: Gestión de variables de entorno
- **cors**: Middleware CORS

## Troubleshooting

### Error de Conexión a BD

Si aparece error de conexión:
1. Verificar que SQL Server esté corriendo
2. Validar credenciales en `.env`
3. Confirmar que puerto 1433 esté abierto
4. El sistema usará modo mock automáticamente

### Tests Fallando

Si los tests fallan:
1. Verificar que archivos del proyecto completo existan
2. Revisar rutas relativas en los tests
3. Confirmar que no hay cambios de esquema en BD

## Contacto y Soporte

Para issues o preguntas sobre este módulo, referirse a la documentación principal del proyecto.
