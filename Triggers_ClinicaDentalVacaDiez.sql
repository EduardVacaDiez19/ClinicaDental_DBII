--Triggers
--Auditoria de borrado de pacientes
create trigger trg_AuditoriaBorradoPaciente
on Pacientes
after delete-- Se dispara después de que alguien borre
as
begin
    set nocount on;

    -- Inserto en la auditoría los datos que estaban en la tabla mágica 'deleted'
    insert into AuditoriaPacientes (PacienteID, NombreCompleto, UsuarioQueBorro)
    select 
        d.PacienteID, 
        d.Nombre + ' ' + d.Apellido, 
        SYSTEM_USER -- Captura el usuario que hizo el borrado
    from deleted d;

    print 'El paciente ha sido borrado, pero se guardó un registro en la auditoría.';
end;
go

--No borrar facturas
create trigger trg_ProhibidoBorrarFacturas
on Facturas
after delete
as
begin
    set nocount on;

    -- No necesito mirar qué se borró, simplemente digo que no.
    raiserror ('Acción Denegada: Las facturas no se pueden eliminar por motivos legales.', 16, 1);
    
    -- Deshacemos el borrado. Las facturas "resucitan".
    rollback transaction;
end;
go




--No agendar cita fuera de horario
create trigger trg_ValidarHorarioAtencion
on Citas
after insert, update
as
begin
    set nocount on;

    if exists (select 1 from inserted 
               where HoraCita < '08:00:00' OR HoraCita > '20:00:00')
    begin
        raiserror ('Error: La clínica solo atiende de 08:00 AM a 08:00 PM.', 16, 1);
        rollback transaction;
    end
end;
go

--Prohibido descuentos si no estan autorizados
create trigger trg_nobajarprecios
on tratamientos
after update
as
begin
    set nocount on;

    -- comparo la tabla 'inserted' (precio nuevo) con la 'deleted' (precio viejo)
    -- si el nuevo es menor que el viejo, bloqueo
    if exists (
        select 1 
        from inserted i
        inner join deleted d on i.tratamientoid = d.tratamientoid
        where i.costo < d.costo
    )
    begin
        raiserror ('seguridad: no esta permitido bajar los precios de los tratamientos.', 16, 1);
        rollback transaction;
    end
end;
go