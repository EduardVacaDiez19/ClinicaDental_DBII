-- Crear SP para historial de paciente
IF OBJECT_ID('sp_ObtenerHistorialPaciente', 'P') IS NOT NULL
    DROP PROCEDURE sp_ObtenerHistorialPaciente;
GO

CREATE PROCEDURE sp_ObtenerHistorialPaciente
    @PacienteID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        c.CitaID,
        c.FechaCita,
        c.HoraCita,
        c.Motivo,
        CASE 
            WHEN c.FechaCita < CAST(GETDATE() AS DATE) THEN 'Realizada'
            WHEN c.FechaCita = CAST(GETDATE() AS DATE) THEN 'Hoy'
            ELSE 'Programada'
        END as Estado,
        o.Nombre + ' ' + o.Apellido as Odontologo,
        o.Especialidad
    FROM Citas c
    INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
    WHERE c.PacienteID = @PacienteID
    ORDER BY c.FechaCita DESC, c.HoraCita DESC;
END
GO

-- Crear tabla Inventario si no existe
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Inventario')
BEGIN
    CREATE TABLE Inventario (
        ProductoID INT PRIMARY KEY IDENTITY(1,1),
        NombreProducto NVARCHAR(100) NOT NULL,
        Stock INT NOT NULL DEFAULT 0,
        StockMinimo INT NOT NULL DEFAULT 10,
        UltimaActualizacion DATETIME DEFAULT GETDATE()
    );

    -- Datos de prueba
    INSERT INTO Inventario (NombreProducto, Stock, StockMinimo) VALUES 
    ('Anestesia Local', 5, 20), -- Stock bajo
    ('Guantes Latex', 100, 50),
    ('Mascarillas', 8, 15), -- Stock bajo
    ('Amalgama', 30, 10);
END
GO
