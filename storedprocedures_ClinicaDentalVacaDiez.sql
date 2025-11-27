--Stored Procedure

--Insertar Pacientes
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
    insert into Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion)
    values (@Nombre, @Apellido, @FechaNacimiento, @Genero, @Telefono, @Correo, @Direccion);
end;
go




--Agendar Citas
create procedure AgendarCita
    @PacienteID int,
    @OdontologoID int,
    @Fecha date,
    @Hora time,
    @Motivo nvarchar(100)
as
begin
    set nocount on; 

    -- 1. aqui voy a validar si el doctor ya tiene cita a esa misma fecha y hora
    if exists (select 1 from Citas 
               where OdontologoID = @OdontologoID 
               and FechaCita = @Fecha 
               and HoraCita = @Hora)
    begin
        -- Si existe, voy a lanzar un error y no inserto nada
        ;throw 51000, 'El odontólogo ya tiene una cita asignada en ese horario.', 1;
    end

    -- Si está libre, insertamos la cita
    insert into Citas (PacienteID, OdontologoID, FechaCita, HoraCita, Motivo)
    values (@PacienteID, @OdontologoID, @Fecha, @Hora, @Motivo);

    -- Devuelvo el ID de la nueva cita creada
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
