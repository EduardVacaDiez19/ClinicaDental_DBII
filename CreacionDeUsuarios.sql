-- =============================================================================
-- UNIFIED USERS TABLE SCHEMA
-- =============================================================================
-- WARNING: Este archivo reemplaza a CreacionDeUsuarios.sql
--
-- PROBLEMA DETECTADO:
-- - CreacionDeTablas_ClinicaDentalVacaDiez.sql define: NombreUsuario, PasswordHash, RolID (FK a Roles)
-- - CreacionDeUsuarios.sql define: Email, Password, Rol (string)
--
-- SOLUCIÓN: Usar SOLO el schema de CreacionDeTablas, que es consistente con el backend
-- del directorio ClinicaDentalVacaDiez-Completo (authController.js usa NombreUsuario, PasswordHash, RolID)
-- =============================================================================

-- La tabla Usuarios ya está definida en CreacionDeTablas_ClinicaDentalVacaDiez.sql
-- Este script es SOLO para referencia y compatibilidad

-- DO NOT RUN THIS IF CreacionDeTablas already executed

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    -- Primero asegurarse de que existe la tabla Roles
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
    BEGIN
        CREATE TABLE Roles (
            RolID INT PRIMARY KEY,
            NombreRol NVARCHAR(20) NOT NULL
        );

        INSERT INTO Roles VALUES (1, 'Administrador');
        INSERT INTO Roles VALUES (2, 'Usuario');
    END

    -- Crear tabla Usuarios con schema correcto
    CREATE TABLE Usuarios (
        UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
        NombreUsuario NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        RolID INT FOREIGN KEY REFERENCES Roles(RolID),
        EmpleadoRelacionadoID INT NULL,
        PacienteRelacionadoID INT NULL
    );

    PRINT 'Usuarios table created with unified schema';
END
GO

-- =============================================================================
-- DEPRECATED: The following schema from CreacionDeUsuarios.sql is INCOMPATIBLE
-- with the backend code and should NOT be used:
--
-- CREATE TABLE Usuarios (
--     Email NVARCHAR(100),        -- Backend uses NombreUsuario
--     Password NVARCHAR(255),     -- Backend uses PasswordHash
--     Rol NVARCHAR(20)            -- Backend uses RolID (INT FK)
-- );
-- =============================================================================
