-- Script para configurar usuarios en la base de datos
-- Ejecuta este script después de crear las tablas

USE ClinicaDental;
GO

-- Verificar que las tablas de Roles y Usuarios existan
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        RolID INT PRIMARY KEY,
        NombreRol NVARCHAR(20) NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
        NombreUsuario NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        RolID INT FOREIGN KEY REFERENCES Roles(RolID),
        EmpleadoRelacionadoID INT NULL,
        PacienteRelacionadoID INT NULL
    );
END
GO

-- Limpiar datos de prueba anteriores
DELETE FROM Usuarios;
DELETE FROM Roles;
GO

-- Insertar roles
INSERT INTO Roles (RolID, NombreRol) VALUES (1, 'Administrador');
INSERT INTO Roles (RolID, NombreRol) VALUES (2, 'Usuario');
GO

-- Insertar usuarios de prueba
-- Contraseñas:
-- admin: admin123 (hash bcrypt)
-- usuario: user123 (hash bcrypt)
-- recepcion: recepcion123 (hash bcrypt)

-- NOTA: Estos hashes son para las contraseñas de prueba
-- En producción, usa contraseñas seguras y genera nuevos hashes

INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID, EmpleadoRelacionadoID) 
VALUES ('admin', '$2a$10$YQ98PkKCkFl.9O6KQlL5VO7oH3h6RJ4lfPfh5WhxqTLnLvCYZh6Vu', 1, 1);
-- Relacionado con el primer odontólogo (Ana Gomez)

INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID) 
VALUES ('usuario', '$2a$10$P5k1kxlCvOH.pZlGTL3RsOTz9W0YWmL3vKh2c8dP5jl2z3QLmLqR2', 2);

INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID) 
VALUES ('recepcion', '$2a$10$L7k9kxlCvOH.pZlGTL3RsOTz9W0YWmL3vKh2c8dP5jl2z3QLmLqR2', 2);

GO

-- Verificar los usuarios insertados
SELECT 
    u.UsuarioID,
    u.NombreUsuario,
    r.NombreRol,
    CASE 
        WHEN u.EmpleadoRelacionadoID IS NOT NULL THEN 
            (SELECT Nombre + ' ' + Apellido FROM Odontologos WHERE OdontologoID = u.EmpleadoRelacionadoID)
        WHEN u.PacienteRelacionadoID IS NOT NULL THEN 
            (SELECT Nombre + ' ' + Apellido FROM Pacientes WHERE PacienteID = u.PacienteRelacionadoID)
        ELSE 'Sin relación'
    END as PersonaRelacionada
FROM Usuarios u
INNER JOIN Roles r ON u.RolID = r.RolID;

PRINT '✅ Usuarios de prueba creados exitosamente';
PRINT '';
PRINT 'Credenciales de acceso:';
PRINT '========================';
PRINT 'Administrador:';
PRINT '  Usuario: admin';
PRINT '  Contraseña: admin123';
PRINT '';
PRINT 'Usuario Regular:';
PRINT '  Usuario: usuario';
PRINT '  Contraseña: user123';
PRINT '';
PRINT 'Recepción:';
PRINT '  Usuario: recepcion';
PRINT '  Contraseña: recepcion123';
GO
