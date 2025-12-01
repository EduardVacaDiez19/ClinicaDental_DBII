const { getConnection, sql } = require('../config/database');

// Obtener todas las citas
async function getAllCitas(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                c.CitaID,
                c.FechaCita,
                c.HoraCita,
                c.Motivo,
                p.Nombre + ' ' + p.Apellido as Paciente,
                p.PacienteID,
                o.Nombre + ' ' + o.Apellido as Odontologo,
                o.OdontologoID,
                o.Especialidad,
                CASE 
                    WHEN c.FechaCita < CAST(GETDATE() AS DATE) THEN 'Realizada'
                    WHEN c.FechaCita = CAST(GETDATE() AS DATE) THEN 'Hoy'
                    ELSE 'Programada'
                END as Estado
            FROM Citas c
            INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
            INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
            ORDER BY c.FechaCita DESC, c.HoraCita DESC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
}

// Obtener cita por ID
async function getCitaById(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    c.CitaID,
                    c.PacienteID,
                    c.OdontologoID,
                    c.FechaCita,
                    c.HoraCita,
                    c.Motivo,
                    p.Nombre + ' ' + p.Apellido as Paciente,
                    o.Nombre + ' ' + o.Apellido as Odontologo,
                    o.Especialidad
                FROM Citas c
                INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
                INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
                WHERE c.CitaID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error obteniendo cita:', error);
        res.status(500).json({ error: 'Error al obtener cita' });
    }
}

// Crear nueva cita
async function createCita(req, res) {
    try {
        const { pacienteId, odontologoId, fecha, hora, motivo } = req.body;

        if (!pacienteId || !odontologoId || !fecha || !hora || !motivo) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const pool = await getConnection();
        
        // Usar el stored procedure que valida disponibilidad
        const result = await pool.request()
            .input('pacienteId', sql.Int, pacienteId)
            .input('odontologoId', sql.Int, odontologoId)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.Time, hora)
            .input('motivo', sql.NVarChar, motivo)
            .execute('AgendarCita');

        res.status(201).json({ 
            message: 'Cita agendada exitosamente',
            citaId: result.recordset[0].NuevaCitaID
        });
    } catch (error) {
        console.error('Error creando cita:', error);
        
        // Error específico del trigger o stored procedure
        if (error.message.includes('ya tiene una cita')) {
            return res.status(409).json({ error: 'El odontólogo ya tiene una cita en ese horario' });
        }
        if (error.message.includes('horario')) {
            return res.status(400).json({ error: 'Fuera del horario de atención (08:00 - 20:00)' });
        }
        
        res.status(500).json({ error: 'Error al crear cita' });
    }
}

// Actualizar cita
async function updateCita(req, res) {
    try {
        const { id } = req.params;
        const { pacienteId, odontologoId, fecha, hora, motivo } = req.body;

        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .input('pacienteId', sql.Int, pacienteId)
            .input('odontologoId', sql.Int, odontologoId)
            .input('fecha', sql.Date, fecha)
            .input('hora', sql.Time, hora)
            .input('motivo', sql.NVarChar, motivo)
            .query(`
                UPDATE Citas
                SET PacienteID = @pacienteId,
                    OdontologoID = @odontologoId,
                    FechaCita = @fecha,
                    HoraCita = @hora,
                    Motivo = @motivo
                WHERE CitaID = @id
            `);

        res.json({ message: 'Cita actualizada exitosamente' });
    } catch (error) {
        console.error('Error actualizando cita:', error);
        res.status(500).json({ error: 'Error al actualizar cita' });
    }
}

// Cancelar/Eliminar cita
async function deleteCita(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        
        // Usar el stored procedure que maneja las relaciones
        await pool.request()
            .input('citaId', sql.Int, id)
            .execute('CancelarCita');

        res.json({ message: 'Cita cancelada exitosamente' });
    } catch (error) {
        console.error('Error cancelando cita:', error);
        res.status(500).json({ error: 'Error al cancelar cita' });
    }
}

// Obtener citas por fecha
async function getCitasByFecha(req, res) {
    try {
        const { fecha } = req.params;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('fecha', sql.Date, fecha)
            .query(`
                SELECT 
                    c.CitaID,
                    c.HoraCita,
                    c.Motivo,
                    p.Nombre + ' ' + p.Apellido as Paciente,
                    o.Nombre + ' ' + o.Apellido as Odontologo,
                    o.Especialidad
                FROM Citas c
                INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
                INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
                WHERE c.FechaCita = @fecha
                ORDER BY c.HoraCita
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo citas por fecha:', error);
        res.status(500).json({ error: 'Error al obtener citas' });
    }
}

module.exports = {
    getAllCitas,
    getCitaById,
    createCita,
    updateCita,
    deleteCita,
    getCitasByFecha
};
