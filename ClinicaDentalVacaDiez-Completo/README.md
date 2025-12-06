# Sistema Completo - Clínica Dental Vaca Diez

## Descripción General

Sistema completo de gestión de clínica dental con arquitectura de tres capas: base de datos SQL Server, backend Node.js/Express y frontend React. Incluye gestión de pacientes, citas, odontólogos, tratamientos y facturación.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│              • Interfaz de usuario SPA                      │
│              • Comunicación vía API REST                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                   Backend (Node.js)                         │
│              • API REST con Express                         │
│              • Lógica de negocio                            │
│              • Autenticación JWT                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                 Base de Datos (SQL Server)                  │
│              • 12+ tablas relacionadas                     │
│              • Stored procedures                           │
│              • Triggers y transacciones                    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
ClinicaDental_DBII/
├── backend/                              # Backend simplificado
│   ├── server.js
│   ├── db.js
│   ├── controllers/
│   ├── routes/
│   └── tests/
├── frontend/                             # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── ClinicaDentalVacaDiez-Completo/       # Backend completo
│   └── ClinicaDentalVacaDiez/
│       ├── server.js
│       ├── controllers/                  # 7 controladores
│       ├── routes/                       # 7 archivos de rutas
│       ├── middleware/
│       └── config/
├── migrations/                           # Scripts de migración
├── *.sql                                # Scripts SQL
└── README.md
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **mssql** - Cliente SQL Server
- **bcryptjs** - Hashing de contraseñas
- **jsonwebtoken** - Autenticación JWT

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Herramienta de build
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Framework CSS

### Base de Datos
- **SQL Server** - Sistema de gestión de bases de datos
- **Stored Procedures** - Lógica almacenada
- **Triggers** - Automatización de procesos
- **Transacciones** - Integridad de datos

## 📋 Funcionalidades

### ✅ Implementadas
- **Autenticación de usuarios** con JWT
- **Gestión de pacientes** (CRUD completo)
- **Gestión de citas** con estados
- **Gestión de odontólogos** y especialidades
- **Gestión de tratamientos**
- **Sistema de facturación**
- **Panel de control** con estadísticas
- **Interfaz responsive** moderna

### 🔄 En Desarrollo
- **Reportes detallados**
- **Gestión de inventario**
- **Recordatorios automáticos**
- **Chat en tiempo real**

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js (v18+)
- SQL Server 2019+
- npm o yarn

### 1. Base de Datos
```sql
-- Ejecutar scripts SQL en orden:
1. CreacionDeTablas_ClinicaDentalVacaDiez.sql
2. CreacionDeIndices_ClinicaDentalVacaDiez.sql
3. CreacionDeUsuarios.sql
4. storedprocedures_ClinicaDentalVacaDiez.sql
5. Triggers_ClinicaDentalVacaDiez.sql
6. Transacciones_ClinicaDentalVacaDiez.sql
7. vistas_ClinicaDentalVacaDiez.sql
```

### 2. Backend Simplificado
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables
npm run dev
```

### 3. Backend Completo
```bash
cd ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez
npm install
cp .env.example .env  # Configurar variables
npm run dev
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔗 Endpoints de API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Pacientes
- `GET /api/pacientes` - Listar todos
- `GET /api/pacientes/:id` - Obtener por ID
- `POST /api/pacientes` - Crear nuevo
- `PUT /api/pacientes/:id` - Actualizar
- `DELETE /api/pacientes/:id` - Eliminar

### Citas
- `GET /api/citas` - Listar todas
- `GET /api/citas/:id` - Obtener por ID
- `GET /api/citas/fecha/:fecha` - Por fecha
- `POST /api/citas` - Crear nueva
- `PUT /api/citas/:id` - Actualizar
- `DELETE /api/citas/:id` - Cancelar
- `POST /api/citas/:id/facturar` - Generar factura

### Odontólogos
- `GET /api/odontologos` - Listar todos
- `GET /api/odontologos/:id` - Obtener por ID
- `POST /api/odontologos` - Crear nuevo
- `PUT /api/odontologos/:id` - Actualizar
- `DELETE /api/odontologos/:id` - Eliminar

### Tratamientos
- `GET /api/tratamientos` - Listar todos
- `GET /api/tratamientos/:id` - Obtener por ID
- `POST /api/tratamientos` - Crear nuevo
- `PUT /api/tratamientos/:id` - Actualizar
- `DELETE /api/tratamientos/:id` - Eliminar

## 📊 Esquema de Base de Datos

### Tablas Principales
- **Usuarios** - Usuarios del sistema
- **Roles** - Roles y permisos
- **Pacientes** - Información de pacientes
- **Odontólogos** - Datos de odontólogos
- **Citas** - Programación de citas
- **Tratamientos** - Catálogo de tratamientos
- **Facturas** - Gestión de facturación
- **Seguros** - Tipos de seguro
- **Especialidades** - Especialidades odontológicas

## 🔐 Seguridad

- **JWT** para autenticación
- **bcrypt** para hashing de contraseñas
- **Validación de entrada** en backend
- **CORS** configurado
- **SQL injection** protegido (parametrización)

## 🧪 Testing

```bash
# Backend
npm test

# Frontend
npm run test
```

## 🚀 Despliegue

### Producción Backend
```bash
npm run build
npm start
```

### Producción Frontend
```bash
npm run build
# Servir archivos desde dist/
```

## 📚 Documentación Adicional

- [Documentación Backend](./backend/README.md)
- [Documentación Frontend](./frontend/README.md)
- [Scripts SQL](./CreacionDeTablas_ClinicaDentalVacaDiez.sql)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 🐛 Reportar Problemas

Para reportar problemas o solicitar funciones:
1. Crear un issue en el repositorio
2. Proporcionar información detallada del problema
3. Incluir pasos para reproducir

## 📄 Licencia

Este proyecto es privado y pertenece a Clínica Dental Vaca Diez.

## 👥 Equipo

- **Desarrollador Principal** - [Tu nombre]
- **Diseñador de Base de Datos** - [Nombre]
- **Frontend Developer** - [Nombre]

---

**© 2024 Clínica Dental Vaca Diez - Todos los derechos reservados**