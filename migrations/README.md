# Migraciones - Clínica Dental Vaca Diez

## Descripción

Este directorio contiene scripts de migración y datos de prueba para el sistema de gestión de la clínica dental. Los scripts aquí incluidos permiten poblar la base de datos con información inicial para pruebas y demostraciones.

## Archivos Disponibles

### 📋 Scripts de Datos de Prueba

- **`inserts_citas.sql`** - Inserta citas médicas de ejemplo
- **`inserts_odontologos.sql`** - Datos de odontólogos de prueba
- **`inserts_pacientes.sql`** - Información de pacientes de muestra
- **`inserts_tratamientos.sql`** - Catálogo de tratamientos de ejemplo

## 🚀 Uso

### Ejecutar Todas las Migraciones
```bash
# Conectarse a SQL Server y ejecutar en orden:
1. inserts_pacientes.sql
2. inserts_odontologos.sql  
3. inserts_tratamientos.sql
4. inserts_citas.sql
```

### Ejecutar Individualmente
```bash
# Ejemplo con sqlcmd
sqlcmd -S localhost -d ClinicaDental -i inserts_pacientes.sql
```

## 📊 Datos de Prueba Incluidos

### Pacientes
- 20 pacientes con datos realistas
- Nombres, apellidos, fechas de nacimiento
- Información de contacto completa

### Odontólogos
- 5 odontólogos especializados
- Diferentes especialidades (Ortodoncia, Endodoncia, etc.)
- Horarios y contacto profesional

### Tratamientos
- 15 tratamientos dentales comunes
- Descripciones y costos actualizados
- Categorías por especialidad

### Citas
- 30 citas programadas
- Diferentes estados (Programada, Realizada, Cancelada)
- Distribución en el tiempo actual

## 🔧 Personalización

### Agregar Más Datos
```sql
-- Ejemplo de nuevo paciente
INSERT INTO Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion)
VALUES ('Juan', 'Pérez', '1990-05-15', 'M', '555-1234', 'juan@email.com', 'Calle Principal 123');
```

### Modificar Datos Existentes
```sql
-- Actualizar costo de tratamiento
UPDATE Tratamientos SET Costo = 150.00 WHERE TratamientoID = 1;
```

## ⚠️ Notas Importantes

### Base de Datos Requerida
Estos scripts asumen que:
- La base de datos `ClinicaDental` existe
- Las tablas han sido creadas previamente
- Las relaciones de claves foráneas están establecidas

### Orden de Ejecución
**IMPORTANTE**: Ejecutar en el orden correcto debido a las dependencias de claves foráneas:
1. Pacientes (tabla base)
2. Odontólogos (tabla base)
3. Tratamientos (tabla base)
4. Citas (depende de pacientes y odontólogos)

### Limpieza de Datos
Para eliminar todos los datos de prueba:
```sql
-- Ejecutar en orden inverso
DELETE FROM Citas;
DELETE FROM Tratamientos;
DELETE FROM Odontologos;
DELETE FROM Pacientes;
DBCC CHECKIDENT ('Pacientes', RESEED, 0);
```

## 🧪 Pruebas Recomendadas

Después de ejecutar las migraciones, verificar:

```sql
-- Contar registros
SELECT 'Pacientes' as Tabla, COUNT(*) as Total FROM Pacientes
UNION ALL
SELECT 'Odontologos', COUNT(*) FROM Odontologos
UNION ALL
SELECT 'Tratamientos', COUNT(*) FROM Tratamientos
UNION ALL
SELECT 'Citas', COUNT(*) FROM Citas;

-- Verificar integridad de datos
SELECT c.CitaID, p.Nombre as Paciente, o.Nombre as Odontologo, c.FechaCita
FROM Citas c
JOIN Pacientes p ON c.PacienteID = p.PacienteID
JOIN Odontologos o ON c.OdontologoID = o.OdontologoID;
```

## 🔄 Actualización de Datos

### Para Actualizar Todos los Datos
1. Limpiar tablas existentes
2. Ejecutar scripts en orden
3. Verificar integridad

### Para Agregar Datos Adicionales
1. Crear nuevos scripts siguiendo la nomenclatura
2. Documentar los cambios
3. Probar en ambiente de desarrollo primero

## 📞 Soporte

Si encuentra problemas al ejecutar estos scripts:
1. Verificar que la base de datos existe
2. Confirmar que las tablas están creadas
3. Revisar mensajes de error de SQL Server
4. Verificar permisos del usuario de base de datos

## 📄 Licencia

Estos scripts son propiedad de Clínica Dental Vaca Diez y son para uso interno del sistema.