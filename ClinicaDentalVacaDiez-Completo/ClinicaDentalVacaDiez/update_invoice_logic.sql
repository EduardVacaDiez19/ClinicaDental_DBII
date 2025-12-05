-- Add Descuento column to Seguros if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Seguros' AND COLUMN_NAME = 'Descuento')
BEGIN
    ALTER TABLE Seguros ADD Descuento DECIMAL(5,2) DEFAULT 0;
END
GO

-- Update existing insurances with some example discounts
UPDATE Seguros SET Descuento = 0.00 WHERE Nombre = 'Ninguno';
UPDATE Seguros SET Descuento = 1.00 WHERE Nombre = 'SUS'; -- 100% discount? Or maybe specific logic. Let's say 100% for now or 0 if it covers everything. Let's assume 1.00 (100%) implies free.
UPDATE Seguros SET Descuento = 0.20 WHERE Nombre = 'Caja Nacional'; -- 20% discount
UPDATE Seguros SET Descuento = 0.25 WHERE Nombre = 'Caja Petrolera';
UPDATE Seguros SET Descuento = 0.50 WHERE Nombre = 'Seguro Universitario';
UPDATE Seguros SET Descuento = 0.10 WHERE Nombre = 'Seguro Privado';
UPDATE Seguros SET Descuento = 0.15 WHERE Nombre = 'Dental Plus';
GO

-- Modify sp_GenerarFactura to apply discount
ALTER PROCEDURE sp_GenerarFactura
    @CitaID INT,
    @MetodoPago NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalCalculado DECIMAL(10,2);
    DECLARE @PacienteID INT;
    DECLARE @TipoSeguro NVARCHAR(100);
    DECLARE @Descuento DECIMAL(5,2);
    DECLARE @TotalConDescuento DECIMAL(10,2);

    -- 1. VALIDACIÓN: ¿Ya existe una factura?
    IF EXISTS (SELECT 1 FROM Facturas WHERE CitaID = @CitaID)
    BEGIN
        ;THROW 51003, 'Error: Esta cita ya ha sido facturada anteriormente.', 1;
    END

    -- 2. OBTENER DATOS
    SELECT @PacienteID = PacienteID FROM Citas WHERE CitaID = @CitaID;
    
    -- Obtener seguro del paciente (usando el nombre guardado en Pacientes)
    SELECT @TipoSeguro = TipoSeguro FROM Pacientes WHERE PacienteID = @PacienteID;
    
    -- Obtener descuento del seguro
    -- Si no tiene seguro o no coincide, descuento es 0
    SELECT @Descuento = ISNULL(Descuento, 0) 
    FROM Seguros 
    WHERE Nombre = @TipoSeguro;

    SET @Descuento = ISNULL(@Descuento, 0);

    -- 3. CÁLCULO BASE
    SELECT @TotalCalculado = ISNULL(SUM(PrecioTotal), 0)
    FROM DetalleCitaTratamiento
    WHERE CitaID = @CitaID;

    IF @TotalCalculado = 0
    BEGIN
        ;THROW 51004, 'No se puede generar factura: No hay tratamientos registrados o el total es 0.', 1;
    END

    -- 4. APLICAR DESCUENTO
    -- Descuento es un porcentaje (ej: 0.20 para 20%)
    SET @TotalConDescuento = @TotalCalculado * (1 - @Descuento);

    -- 5. INSERCIÓN
    INSERT INTO Facturas (CitaID, FechaFactura, Total, MetodoPago)
    VALUES (@CitaID, GETDATE(), @TotalConDescuento, @MetodoPago);

    -- 6. RETORNAR RESULTADO (para que el backend lo pueda leer)
    SELECT 
        @CitaID as CitaID,
        @TotalCalculado as Subtotal,
        @Descuento as DescuentoAplicado,
        @TotalConDescuento as TotalPagar,
        'Factura generada exitosamente' as Mensaje;
END;
GO
