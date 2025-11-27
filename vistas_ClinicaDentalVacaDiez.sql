--Vistas
-- Resumen de Citas del Día (Para la recepcionista)
CREATE VIEW v_AgendaDelDia AS
SELECT 
    c.CitaID,
    c.HoraCita,
    (p.Nombre + ' ' + p.Apellido) AS Paciente,
    (o.Nombre + ' ' + o.Apellido) AS Odontologo,
    c.Motivo
FROM Citas c
JOIN Pacientes p ON c.PacienteID = p.PacienteID
JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
WHERE c.FechaCita = CAST(GETDATE() AS DATE);
GO

-- Facturación Global (Para el dueño)
CREATE VIEW v_ReporteFacturacion AS
SELECT 
    YEAR(FechaFactura) AS Anio,
    MONTH(FechaFactura) AS Mes,
    COUNT(*) AS CantidadFacturas,
    SUM(Total) AS TotalDinero
FROM Facturas
GROUP BY YEAR(FechaFactura), MONTH(FechaFactura);
GO