# 🚀 Guía Rápida de Inicio - Clínica Dental Vaca Diez

## Pasos para ejecutar el proyecto

### 1️⃣ Preparar Base de Datos

**En SQL Server Management Studio o Azure Data Studio:**

```sql
-- Ejecutar EN ORDEN los siguientes scripts:
1. CreacionDeTablas_ClinicaDentalVacaDiez.sql
2. CreacionDeIndices_ClinicaDentalVacaDiez.sql
3. storedprocedures_ClinicaDentalVacaDiez.sql
4. Transacciones_ClinicaDentalVacaDiez.sql
5. Triggers_ClinicaDentalVacaDiez.sql
6. InsertUsuariosPrueba.sql (¡MUY IMPORTANTE!)
```

### 2️⃣ Configurar Credenciales

Editar el archivo `.env` en la raíz del proyecto:

```env
DB_USER=sa
DB_PASSWORD=TU_CONTRASEÑA_AQUI
DB_SERVER=localhost
DB_NAME=ClinicaDental
```

### 3️⃣ Instalar Dependencias (si es necesario)

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 4️⃣ Ejecutar la Aplicación

**Opción A - Dos Terminales:**

Terminal 1 (Backend):
```bash
node server.js
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Opción B - Una Terminal (Recomendado):**

Primero instalar concurrently:
```bash
npm install concurrently --save-dev
```

Agregar al package.json principal:
```json
"scripts": {
  "dev": "concurrently \"node server.js\" \"cd client && npm run dev\""
}
```

Luego ejecutar:
```bash
npm run dev
```

### 5️⃣ Acceder a la Aplicación

Abrir navegador en: `http://localhost:5173`

**Usuarios de prueba:**
- Admin: `admin` / `admin123`
- Usuario: `usuario` / `usuario123`

## ✅ Checklist de Verificación

- [ ] SQL Server está corriendo
- [ ] Base de datos creada con todos los scripts
- [ ] Usuarios de prueba insertados
- [ ] Archivo .env configurado correctamente
- [ ] Dependencias instaladas (npm install)
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173

## 🎨 Características del Sistema

### Como Administrador puedes:
- Ver dashboard con estadísticas
- Gestionar pacientes (crear, listar)
- Gestionar citas (crear, ver, cancelar)
- Ver catálogo de odontólogos
- Ver catálogo de tratamientos

### Como Usuario puedes:
- Gestionar pacientes (crear, listar)
- Agendar y ver citas
- Ver catálogo de odontólogos
- Ver catálogo de tratamientos

## 🐛 Problemas Comunes

**Error de conexión a DB:**
- Verificar que SQL Server esté corriendo
- Confirmar credenciales en .env
- Verificar que el firewall permita la conexión

**Puerto ya en uso:**
- Cambiar puerto en .env (backend)
- Cambiar puerto en vite.config.js (frontend)

**Usuarios no pueden iniciar sesión:**
- Verificar que ejecutaste InsertUsuariosPrueba.sql
- Los hashes deben ser exactamente los del script

## 📞 Soporte

Si encuentras algún problema, verifica primero el README.md completo.

---

¡Listo para empezar! 🎉
