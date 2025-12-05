
CREATE PROCEDURE sp_GenerarFactura
    @CitaID INT,
    @MetodoPago NVARCHAR(20) -- Ej: 'Efectivo', 'Tarjeta', 'Seguro'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalCalculado DECIMAL(10,2);

    -- 1. VALIDACIÓN: ¿Ya existe una factura para esta cita?
    -- No queremos cobrar dos veces la misma cita
    IF EXISTS (SELECT 1 FROM Facturas WHERE CitaID = @CitaID)
    BEGIN
        ;THROW 51003, 'Error: Esta cita ya ha sido facturada anteriormente.', 1;
    END

    -- 2. CÁLCULO: Sumar el precio de todos los tratamientos de esa cita
    -- Usamos ISNULL por si la suma devuelve NULL (no hay tratamientos), que lo convierta en 0
    SELECT @TotalCalculado = ISNULL(SUM(PrecioTotal), 0)
    FROM DetalleCitaTratamiento
    WHERE CitaID = @CitaID;

    -- 3. VALIDACIÓN: No podemos facturar si el total es 0
    IF @TotalCalculado = 0
    BEGIN
        ;THROW 51004, 'No se puede generar factura: No hay tratamientos registrados o el total es 0.', 1;
    END

    -- 4. INSERCIÓN: Crear la factura
    INSERT INTO Facturas (CitaID, FechaFactura, Total, MetodoPago)
    VALUES (@CitaID, GETDATE(), @TotalCalculado, @MetodoPago);

    -- 5. CONFIRMACIÓN
    PRINT 'Factura generada exitosamente. Total a pagar: ' + CAST(@TotalCalculado AS NVARCHAR(20));
END;
