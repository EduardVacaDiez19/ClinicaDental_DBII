IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pacientes' AND COLUMN_NAME = 'TipoSeguro')
BEGIN
    ALTER TABLE Pacientes ADD TipoSeguro NVARCHAR(100);
    PRINT 'Columna TipoSeguro agregada exitosamente.';
END
ELSE
BEGIN
    PRINT 'La columna TipoSeguro ya existe.';
END
