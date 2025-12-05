-- Crear un paciente de prueba si no existe
IF NOT EXISTS (SELECT * FROM Pacientes WHERE Correo = 'usuario@prueba.com')
BEGIN
    INSERT INTO Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion)
    VALUES ('Usuario', 'Pruebas', '1990-01-01', 'M', '555-0000', 'usuario@prueba.com', 'Calle Falsa 123');
END

-- Obtener el ID del paciente recién creado o existente
DECLARE @PacienteID INT;
SELECT @PacienteID = PacienteID FROM Pacientes WHERE Correo = 'usuario@prueba.com';

-- Vincular el usuario 'usuario' con este paciente
UPDATE Usuarios
SET PacienteRelacionadoID = @PacienteID
WHERE NombreUsuario = 'usuario';

SELECT * FROM Usuarios WHERE NombreUsuario = 'usuario';
