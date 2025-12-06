# Backend - Clínica Dental Vaca Diez

## Descripción

Backend del sistema de gestión de clínica dental construido con Node.js y Express. Proporciona una API RESTful para la autenticación de usuarios y gestión de datos de la clínica.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **mssql** - Cliente para SQL Server
- **bcryptjs** - Hashing de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno creando un archivo `.env`:
```env
PORT=5000
JWT_SECRET=tu_secreto_jwt_aqui
```

3. Asegurarse de tener SQL Server corriendo localmente con la base de datos `ClinicaDental_DBII`

## Estructura del Proyecto

```
backend/
├── server.js          # Servidor principal Express
├── db.js              # Configuración de conexión a base de datos
├── controllers/       # Controladores de la API
│   └── authController.js
├── routes/           # Rutas de la API
│   └── authRoutes.js
└── tests/            # Archivos de prueba
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Ejemplos de Uso

#### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña123"}'
```

#### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña123"}'
```

## Características

- ✅ Autenticación JWT
- ✅ Hashing seguro de contraseñas
- ✅ Manejo de errores
- ✅ Modo simulado para desarrollo sin base de datos
- ✅ CORS habilitado
- ✅ Respuestas JSON estandarizadas

## Base de Datos

El sistema está diseñado para trabajar con SQL Server con las siguientes tablas principales:
- `Usuarios` - Información de usuarios del sistema
- `Roles` - Roles y permisos de usuario

## Desarrollo sin Base de Datos

Si SQL Server no está disponible, el sistema automáticamente:
- Registra usuarios en modo simulado
- Permite login con credenciales simuladas
- Usuario admin: `admin@test.com` (cualquier contraseña)
- Usuario normal: cualquier otro email

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto es privado y pertenece a Clínica Dental Vaca Diez.