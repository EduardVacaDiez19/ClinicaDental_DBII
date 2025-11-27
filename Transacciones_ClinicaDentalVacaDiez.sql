--Transacciones
--Cancelar la cita de un paciente
create procedure CancelarCita
    @CitaID int
as
begin
    
    begin transaction; 

    begin try
        
        delete from DetalleCitaTratamiento where CitaID = @CitaID; 
        delete from Facturas where CitaID = @CitaID;               
        delete from Citas where CitaID = @CitaID;                  

        commit transaction;
        print '¡Éxito! Todo se borró correctamente.';
    end try
    begin catch
        
        rollback transaction;
        
        print 'Error: No se borró nada para proteger los datos.';
        throw; 
    end catch
end;
go

--Eliminar un paciente
create procedure sp_EliminarPacienteCompleto
    @PacienteID int
as
begin
    set nocount on;

    begin transaction;

    begin try
        -- Borrar los registros en la tabla hija 
        delete from PacientesSeguros 
        where PacienteID = @PacienteID;

        -- Borrar el registro en la tabla padre
        delete from Pacientes 
        where PacienteID = @PacienteID;

        commit transaction;
        print 'Paciente y sus datos asociados fueron eliminados.';
    end try
    begin catch
        
        if @@TRANCOUNT > 0
            rollback transaction;
           
        throw;
    end catch
end;
go

--Registrar nueva cita y paciente
create procedure sp_RegistrarNuevoPacienteYCita
    @Nombre nvarchar(50),
    @Apellido nvarchar(50),
    @Telefono nvarchar(20),
    @OdontologoID int,
    @Fecha date,
    @Hora time,
    @Motivo nvarchar(100)
as
begin
    set nocount on;

    begin transaction;

    begin try
       
        if exists (select 1 from Citas 
                   where OdontologoID = @OdontologoID 
                   and FechaCita = @Fecha 
                   and HoraCita = @Hora)
        begin
            ;throw 51000, 'Error: El odontólogo no está disponible en ese horario. No se registró al paciente.', 1;
        end

        insert into Pacientes (Nombre, Apellido, Telefono, FechaNacimiento, Genero, Correo, Direccion)
        values (@Nombre, @Apellido, @Telefono, GETDATE(), 'M', 'juss@correo.com', 'Sin direccion');
        

        declare @NuevoID int;
        set @NuevoID = scope_identity();

        insert into Citas (PacienteID, OdontologoID, FechaCita, HoraCita, Motivo)
        values (@NuevoID, @OdontologoID, @Fecha, @Hora, @Motivo);

        commit transaction;
        
        print '¡Éxito! Paciente registrado con ID ' + CAST(@NuevoID AS VARCHAR) + ' y cita agendada.';
    end try
    begin catch
        
        if @@TRANCOUNT > 0
        begin
            rollback transaction;
        end

        ;throw;
    end catch
end;
GO

