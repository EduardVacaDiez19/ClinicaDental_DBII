-- Migration: Add TipoSeguro column to Pacientes table
-- This column is required by the application but missing from the original schema
-- The application queries p.TipoSeguro in pacientesController.js and citasController.js

-- Check if column exists before adding (idempotent migration)
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Pacientes'
    AND COLUMN_NAME = 'TipoSeguro'
)
BEGIN
    ALTER TABLE Pacientes
    ADD TipoSeguro NVARCHAR(50) NULL;

    PRINT 'Column TipoSeguro added to Pacientes table';
END
ELSE
BEGIN
    PRINT 'Column TipoSeguro already exists in Pacientes table';
END
GO

-- Also ensure Seguros table has Descuento column (used in citasController.js getDetallePago)
IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'Seguros'
    AND COLUMN_NAME = 'Descuento'
)
BEGIN
    ALTER TABLE Seguros
    ADD Descuento DECIMAL(3,2) DEFAULT 0.00;

    -- Update existing seguros with default discounts
    UPDATE Seguros SET Descuento = 0.10 WHERE Nombre = 'Dental Plus';
    UPDATE Seguros SET Descuento = 0.15 WHERE Nombre = 'Seguros Vitales';
    UPDATE Seguros SET Descuento = 0.05 WHERE Nombre = 'OdontoCare';

    PRINT 'Column Descuento added to Seguros table with default values';
END
ELSE
BEGIN
    PRINT 'Column Descuento already exists in Seguros table';
END
GO
