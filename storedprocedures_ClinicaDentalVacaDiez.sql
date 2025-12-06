-- =============================================
-- Script: storedprocedures_ClinicaDentalVacaDiez.sql
-- Descripción: Procedimientos almacenados para el sistema
--              de gestión de clínica dental
-- Autor: Sistema de Gestión Clínica Dental
-- Fecha: 2024
-- =============================================

--
-- PROCEDIMIENTOS ALMACENADOS
-- Lógica de negocio encapsulada en la base de datos
--

-- =============================================
-- Procedimiento: InsertarPaciente
-- Descripción: Inserta un nuevo paciente en el sistema
-- Parámetros:
--   @Nombre - Nombre del paciente
--   @Apellido - Apellido del paciente
--   @FechaNacimiento - Fecha de nacimiento
--   @Genero - Género del paciente
--   @Telefono - Teléfono de contacto
--   @Correo - Email del paciente
--   @Direccion - Dirección completa
-- Retorna: Nada (inserta registro)
-- =============================================
create procedure InsertarPaciente
    @Nombre nvarchar(50),
    @Apellido nvarchar(50),
    @FechaNacimiento date,
    @Genero nvarchar(10),
    @Telefono nvarchar(20),
    @Correo nvarchar(50),
    @Direccion nvarchar(100)
as
begin
    -- Insertar nuevo paciente con todos sus datos personales
    insert into Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion)
    values (@Nombre, @Apellido, @FechaNacimiento, @Genero, @Telefono, @Correo, @Direccion);
end;
go




-- =============================================
-- Procedimiento: AgendarCita
-- Descripción: Agenda una nueva cita validando disponibilidad
-- Parámetros:
--   @PacienteID - ID del paciente
--   @OdontologoID - ID del odontólogo
--   @Fecha - Fecha de la cita
--   @Hora - Hora de la cita
--   @Motivo - Motivo de la consulta
-- Retorna: ID de la cita creada
-- Excepciones: Error si el odontólogo ya tiene cita en ese horario
-- =============================================
create procedure AgendarCita
    @PacienteID int,
    @OdontologoID int,
    @Fecha date,
    @Hora time,
    @Motivo nvarchar(100)
as
begin
    set nocount on; 

    -- Validar si el odontólogo ya tiene cita en esa fecha y hora
    if exists (select 1 from Citas 
               where OdontologoID = @OdontologoID 
               and FechaCita = @Fecha 
               and HoraCita = @Hora)
    begin
        -- Lanzar error si hay conflicto de horario
        ;throw 51000, 'El odontólogo ya tiene una cita asignada en ese horario.', 1;
    end

    -- Si está disponible, insertar la cita
    insert into Citas (PacienteID, OdontologoID, FechaCita, HoraCita, Motivo)
    values (@PacienteID, @OdontologoID, @Fecha, @Hora, @Motivo);

    -- Retornar ID de la cita creada
    select scope_identity() as NuevaCitaID;
end;
go




--Obtener el historial del paciente
create procedure obtenerhistorialpaciente
    @PacienteID int
as
begin
    set nocount on;

    select 
        c.FechaCita,
        c.HoraCita,
        (o.Nombre + ' ' + o.Apellido) AS Odontologo,
        c.Motivo,
        ISNULL(t.Nombre, 'Solo Consulta') AS Tratamiento, 
        d.Cantidad,
        d.PrecioTotal
   from Citas as c
    inner join Odontologos as o
    on c.OdontologoID = o.OdontologoID
    left join DetalleCitaTratamiento as d
    on c.CitaID = d.CitaID
    left join Tratamientos as t 
    on d.TratamientoID = t.TratamientoID
    where c.PacienteID = @PacienteID
    order by c.FechaCita desc;
end;
go




--Actualizar precio del tratamiento
create procedure ActualizarPrecioTratamiento
    @TratamientoID int,
    @NuevoPrecio decimal(10,2)
as
begin
    set nocount on;
    
    declare @PrecioViejo decimal(10,2);

    -- obtengo el precio actual antes de cambiarlo
    select @PrecioViejo = Costo from Tratamientos where TratamientoID = @TratamientoID;

    begin transaction;

    begin try
        -- Actualizo la tabla principal
        update Tratamientos
        set Costo = @NuevoPrecio
        where TratamientoID = @TratamientoID;
        -- Inserto el rastro en la tabla de historial
        insert into HistorialPrecios (TratamientoID, PrecioAnterior, PrecioNuevo)
        values (@TratamientoID, @PrecioViejo, @NuevoPrecio);

        commit transaction;
        print 'Precio actualizado y registrado en el historial.';
    end try
    begin catch
        if @@TRANCOUNT > 0 rollback transaction;
        throw;
    end catch
end;
go



--Exec de Agendar cita
declare @ID_NuevaCita int;
exec @ID_NuevaCita = AgendarCita 
    @PacienteID = 1, 
    @OdontologoID = 2, 
    @Fecha = '2025-12-20', 
    @Hora = '10:00', 
    @Motivo = 'Dolor en muela del juicio';

print 'Cita creada con ID: ' + CAST(@ID_NuevaCita AS VARCHAR);

--Obtener el historial del paciente
EXEC obtenerhistorialpaciente @PacienteID = 1;

--Insertar pacientes
exec InsertarPaciente
    @Nombre = 'Edu',
    @Apellido = 'Worship',
    @FechaNacimiento = '1995-08-12',
    @Genero = 'Masculino',
    @Telefono = '76543210',
    @Correo = 'edu.worship  @example.com',
