-- Creacion de los indices

--Para pacientes
create nonclustered index IX_Pacientes_Apellido_Nombre
on Pacientes (Apellido, Nombre);

create nonclustered index IX_Pacientes_Correo
on Pacientes (Correo);

create nonclustered index IX_Pacientes_Telefono
on Pacientes (Telefono);

--Para citas
create nonclustered index IX_Citas_FechaCita
on Citas (FechaCita)
include (HoraCita, PacienteID, OdontologoID);

create nonclustered index IX_Citas_PacienteID
on Citas (PacienteID) 
include (FechaCita, HoraCita);

create nonclustered index IX_Citas_OdontologoID
on Citas (OdontologoID)
include (FechaCita, HoraCita);

--Para los odontologos 
create nonclustered index IX_Odontologos_Especialidad
on Odontologos (Especialidad);

--Para la Factura
create nonclustered index IX_Facturas_CitaID
on Facturas (CitaID);

create nonclustered index IX_Facturas_FechaFactura
on Facturas (FechaFactura)
include (Total, MetodoPago);

--Para los seguros de los pacientes
create nonclustered index IX_PacientesSeguros_PacienteID
on PacientesSeguros (PacienteID)
include (FechaFin);

--Para tratamiento de medicamentos
create nonclustered index IX_TratamientoMedicamento_TratamientoID
on TratamientoMedicamento (TratamientoID);

create nonclustered index IX_TratamientoMedicamento_MedicamentoID
on TratamientoMedicamento (MedicamentoID);