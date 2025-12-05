USE [master]
GO
-- Crear login si no existe
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'ClinicaUser')
BEGIN
    CREATE LOGIN [ClinicaUser] WITH PASSWORD=N'ClinicaDental2024!', DEFAULT_DATABASE=[ClinicaDental], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
END
GO

USE [ClinicaDental]
GO
-- Crear usuario en la BD si no existe
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'ClinicaUser')
BEGIN
    CREATE USER [ClinicaUser] FOR LOGIN [ClinicaUser]
END
GO
-- Dar permisos
ALTER ROLE [db_owner] ADD MEMBER [ClinicaUser]
GO
