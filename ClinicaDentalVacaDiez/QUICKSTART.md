# 🚀 Guía de Inicio Rápido

## Paso 1: Configurar Base de Datos

1. Abre SQL Server Management Studio
2. Ejecuta los scripts en orden:
   - `CreacionDeTablas_ClinicaDentalVacaDiez.sql`
   - `CreacionDeIndices_ClinicaDentalVacaDiez.sql`
   - `storedprocedures_ClinicaDentalVacaDiez.sql`
   - `Triggers_ClinicaDentalVacaDiez.sql`
   - `Transacciones_ClinicaDentalVacaDiez.sql`
   - `database/setup-usuarios.sql` ⭐ IMPORTANTE

## Paso 2: Configurar Backend

```bash
# 1. Copiar archivo de configuración
cp .env.example .env

# 2. Editar .env y configurar:
#    - DB_SERVER (tu servidor SQL Server)
#    - DB_PASSWORD (tu contraseña)
#    - JWT_SECRET (genera uno seguro)

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor
npm start
```

## Paso 3: Abrir Frontend

```bash
# Opción A: Con navegador directo
# Abre: public/index.html

# Opción B: Con servidor local
npx http-server public -p 5500
# Abre: http://localhost:5500
```

## Paso 4: Probar el Sistema

### Login
- **Admin:** admin / admin123
- **Usuario:** usuario / user123

### URLs Importantes
- **Backend API:** http://localhost:3000
- **Frontend:** http://localhost:5500 (o donde abras el HTML)
- **Health Check:** http://localhost:3000/health
- **Documentación API:** http://localhost:3000/

## ⚠️ Problemas Comunes

### "Cannot connect to SQL Server"
✅ Verifica que SQL Server esté corriendo
✅ Revisa usuario y contraseña en .env
✅ Habilita TCP/IP en SQL Server Configuration Manager

### "CORS Error"
✅ Añade tu URL del frontend a ALLOWED_ORIGINS en .env
✅ Reinicia el servidor backend

### "Invalid credentials"
✅ Asegúrate de haber ejecutado `database/setup-usuarios.sql`
✅ Los hashes de contraseña están correctos en ese script

### "Port 3000 already in use"
✅ Cambia el puerto en .env (PORT=3001)
✅ O cierra la aplicación que usa el puerto 3000

## 📱 Crear Nuevos Usuarios

### Método 1: Desde SQL Server
```sql
-- Primero genera el hash de la contraseña con bcrypt
-- Luego inserta en la BD

INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID)
VALUES ('nuevo_usuario', '$2a$10$hash_generado_aqui', 2);
```

### Método 2: Desde la API (requiere estar logueado como admin)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "username": "nuevo_usuario",
    "password": "contraseña123",
    "roleId": 2
  }'
```

## 🎯 Próximos Pasos

1. ✅ Configura tu información real de la clínica
2. ✅ Importa tus pacientes existentes
3. ✅ Configura los odontólogos reales
4. ✅ Comienza a agendar citas
5. ✅ Personaliza los colores y logo

## 📞 Soporte

Si tienes problemas, revisa:
1. README.md completo
2. Logs del servidor (consola)
3. Consola del navegador (F12)

---
**¡Listo para usar!** 🎉
