IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
CREATE TABLE Usuarios (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(20),
    Rol NVARCHAR(20) DEFAULT 'User', -- 'Admin', 'User'
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO
