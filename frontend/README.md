# Frontend - Clínica Dental Vaca Diez

## Descripción

Interfaz de usuario moderna para el sistema de gestión de clínica dental. Construida con React 19, Vite y Tailwind CSS, proporciona una experiencia de usuario fluida y responsive.

## Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento de aplicaciones SPA
- **Tailwind CSS** - Framework de CSS utility-first
- **PostCSS** - Procesamiento de CSS

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
```bash
# Copiar archivo de ejemplo si existe
cp .env.example .env
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/         # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Services.jsx
│   │   └── About.jsx
│   ├── App.jsx        # Componente principal
│   ├── main.jsx       # Punto de entrada
│   └── index.css      # Estilos globales
├── public/            # Archivos estáticos
└── package.json       # Dependencias y scripts
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## Uso

### Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construcción
```bash
npm run build
```

Genera archivos optimizados en la carpeta `dist/`

## Páginas y Rutas

- `/` - Página de inicio con hero section y servicios
- `/login` - Formulario de inicio de sesión
- `/register` - Formulario de registro
- `/services` - Lista de servicios dentales
- `/about` - Información sobre la clínica
- `/dashboard` - Panel de control (requiere autenticación)

## Componentes Principales

### Navbar
Barra de navegación responsive con enlaces a todas las secciones.

### Footer
Pie de página con información de contacto y enlaces importantes.

### Páginas
- **Home** - Landing page con hero y servicios
- **Login** - Formulario con manejo de errores y modo simulado
- **Register** - Registro de nuevos usuarios
- **Dashboard** - Panel principal (placeholder)
- **Services** - Showcase de servicios
- **About** - Información institucional

## Integración con Backend

El frontend se comunica con el backend a través de:
- URL base: `http://localhost:5000/api`
- Endpoints de autenticación: `/auth/login`, `/auth/register`
- Almacenamiento de tokens en localStorage
- Manejo de errores con respaldo simulado

## Características

- ✅ Diseño responsive con Tailwind CSS
- ✅ Enrutamiento cliente-servidor con React Router
- ✅ Formularios con validación
- ✅ Manejo de estado con hooks de React
- ✅ Integración con API REST
- ✅ Modo simulado para desarrollo
- ✅ Optimización de imágenes
- ✅ Accesibilidad mejorada

## Estilos y Temas

La aplicación utiliza una paleta de colores consistente:
- **Color primario**: Sky blue
- **Color secundario**: Slate/gray
- **Fondo**: Blanco y grises claros
- **Tipografía**: Sistema de fuentes nativo

## Desarrollo sin Backend

Si el backend no está disponible, los formularios de login:
- Aceptan cualquier email/contraseña
- `admin@test.com` → Usuario administrador simulado
- Otros emails → Usuario normal simulado
- Redirigen al dashboard automáticamente

## Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Solución de Problemas

### Puerto ya en uso
Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente disponible.

### Build falla
Asegúrese de que todas las dependencias estén instaladas:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS no funciona
Verificar que PostCSS esté correctamente configurado en `postcss.config.js`.

## Licencia

Este proyecto es privado y pertenece a Clínica Dental Vaca Diez.