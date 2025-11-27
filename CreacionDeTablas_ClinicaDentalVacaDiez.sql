CREATE DATABASE ClinicaDental;
GO

USE ClinicaDental;
GO

-- TABLA PACIENTES
CREATE TABLE Pacientes (
    PacienteID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Apellido NVARCHAR(50),
    FechaNacimiento DATE,
    Genero CHAR(1),
    Telefono NVARCHAR(20),
    Correo NVARCHAR(50),
    Direccion NVARCHAR(100)
);
GO

-- TABLA ODONTOLOGOS
CREATE TABLE Odontologos (
    OdontologoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Apellido NVARCHAR(50),
    Especialidad NVARCHAR(50),
    Telefono NVARCHAR(20),
    Correo NVARCHAR(50)
);
GO

-- TABLA TRATAMIENTOS
CREATE TABLE Tratamientos (
    TratamientoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Descripcion NVARCHAR(100),
    Costo DECIMAL(10,2)
);
GO

-- TABLA CITAS
CREATE TABLE Citas (
    CitaID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT FOREIGN KEY REFERENCES Pacientes(PacienteID),
    OdontologoID INT FOREIGN KEY REFERENCES Odontologos(OdontologoID),
    FechaCita DATE,
    HoraCita TIME,
    Motivo NVARCHAR(100)
);
GO

-- TABLA DETALLECITATRATAMIENTO
CREATE TABLE DetalleCitaTratamiento (
    DetalleID INT IDENTITY(1,1) PRIMARY KEY,
    CitaID INT FOREIGN KEY REFERENCES Citas(CitaID),
    TratamientoID INT FOREIGN KEY REFERENCES Tratamientos(TratamientoID),
    Cantidad INT,
    PrecioTotal DECIMAL(10,2)
);
GO

-- TABLA SEGUROS
CREATE TABLE Seguros (
    SeguroID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Telefono NVARCHAR(20),
    Correo NVARCHAR(50),
    Direccion NVARCHAR(100)
);
GO

-- TABLA PACIENTESEGUROS
CREATE TABLE PacientesSeguros (
    PacienteSeguroID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT FOREIGN KEY REFERENCES Pacientes(PacienteID),
    SeguroID INT FOREIGN KEY REFERENCES Seguros(SeguroID),
    NumeroPoliza NVARCHAR(50),
    FechaInicio DATE,
    FechaFin DATE
);
GO

-- TABLA CONSULTORIOS
CREATE TABLE Consultorios (
    ConsultorioID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Ubicacion NVARCHAR(100),
    Capacidad INT
);
GO

-- TABLA FACTURAS
CREATE TABLE Facturas (
    FacturaID INT IDENTITY(1,1) PRIMARY KEY,
    CitaID INT FOREIGN KEY REFERENCES Citas(CitaID),
    FechaFactura DATE,
    Total DECIMAL(10,2),
    MetodoPago NVARCHAR(20)
);
GO

CREATE TABLE TratamientoMedicamento(
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TratamientoID INT NOT NULL,
    MedicamentoID INT NOT NULL,
    Dosis VARCHAR(100) NULL,
    Frecuencia VARCHAR(100) NULL
);
GO

-- TABLA MEDICAMENTOS
CREATE TABLE Medicamentos (
    MedicamentoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Descripcion NVARCHAR(100),
    Stock INT,
    Precio DECIMAL(10,2)
);
GO

------------------------------------------------------
-- INSERTAR ODONTOLOGOS
INSERT INTO Odontologos (Nombre, Apellido, Especialidad, Telefono, Correo)
VALUES
('Ana', 'Gomez', 'Ortodoncia', '555-1010', 'ana.gomez@mail.com'),
('Luis', 'Perez', 'Endodoncia', '555-1020', 'luis.perez@mail.com'),
('Marta', 'Lopez', 'Odontopediatria', '555-1030', 'marta.lopez@mail.com'),
('Carlos', 'Sanchez', 'Periodoncia', '555-1040', 'carlos.sanchez@mail.com'),
('Elena', 'Ramirez', 'Cirugia', '555-1050', 'elena.ramirez@mail.com'),
('Jorge', 'Torres', 'Implantes', '555-1060', 'jorge.torres@mail.com'),
('Lucia', 'Diaz', 'Protesis', '555-1070', 'lucia.diaz@mail.com'),
('Miguel', 'Vargas', 'Ortodoncia', '555-1080', 'miguel.vargas@mail.com'),
('Sofia', 'Mendez', 'Estetica', '555-1090', 'sofia.mendez@mail.com'),
('Daniel', 'Rojas', 'Endodoncia', '555-1100', 'daniel.rojas@mail.com');

-- INSERTAR TRATAMIENTOS
INSERT INTO Tratamientos (Nombre, Descripcion, Costo)
VALUES
('Limpieza', 'Limpieza dental profesional', 50.00),
('Obturacion', 'Relleno de cavidad dental', 80.00),
('Extraccion', 'Extraccion de pieza dental', 100.00),
('Ortodoncia', 'Colocacion de brackets', 1200.00),
('Blanqueamiento', 'Blanqueamiento dental', 200.00),
('Implante', 'Colocacion de implante dental', 1500.00);

-- INSERTAR SEGUROS
INSERT INTO Seguros (Nombre, Telefono, Correo, Direccion)
VALUES
('Dental Plus', '555-2010', 'contacto@dentalplus.com', 'Av. Salud 123'),
('Seguros Vitales', '555-2020', 'info@segurosvitales.com', 'Calle Bienestar 45'),
('OdontoCare', '555-2030', 'contacto@odontocare.com', 'Av. Sonrisa 77');

-- INSERTAR CONSULTORIOS
INSERT INTO Consultorios (Nombre, Ubicacion, Capacidad)
VALUES
('Consultorio 1', 'Planta Baja', 2),
('Consultorio 2', 'Primer Piso', 3),
('Consultorio 3', 'Segundo Piso', 2);

-- INSERTAR MEDICAMENTOS
INSERT INTO Medicamentos (Nombre, Descripcion, Stock, Precio)
VALUES
('Analgésico', 'Alivia dolor dental', 100, 10.00),
('Antibiótico', 'Previene infección', 50, 15.00),
('Enjuague Bucal', 'Higiene oral', 200, 5.00);

-- INSERTAR 1000 PACIENTES
DECLARE @i INT = 1;

WHILE @i <= 1000
BEGIN
    INSERT INTO Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion)
    VALUES (
        'Nombre' + CAST(@i AS NVARCHAR(10)),
        'Apellido' + CAST(@i AS NVARCHAR(10)),
        DATEADD(DAY, -ROUND(RAND() * 10000, 0), GETDATE()),
        CASE WHEN @i % 2 = 0 THEN 'M' ELSE 'F' END,
        '555-' + RIGHT('0000' + CAST(@i AS NVARCHAR(4)), 4),
        'paciente' + CAST(@i AS NVARCHAR(10)) + '@mail.com',
        'Direccion ' + CAST(@i AS NVARCHAR(10))
    );
    SET @i = @i + 1;
END

-- ASIGNAR SEGUROS A PACIENTES ALEATORIAMENTE
DECLARE @PacienteID INT = 1;
WHILE @PacienteID <= 1000
BEGIN
    INSERT INTO PacientesSeguros (PacienteID, SeguroID, NumeroPoliza, FechaInicio, FechaFin)
    VALUES (
        @PacienteID,
        (ABS(CHECKSUM(NEWID())) % 3) + 1, -- Seguro aleatorio entre 1 y 3
        'POL' + RIGHT('0000' + CAST(@PacienteID AS NVARCHAR(4)), 4),
        DATEADD(DAY, -ROUND(RAND() * 1000,0), GETDATE()),
        DATEADD(DAY, ROUND(RAND() * 1000,0), GETDATE())
    );
    SET @PacienteID = @PacienteID + 1;
END