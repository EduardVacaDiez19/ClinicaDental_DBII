const { getConnection, sql } = require('../config/database');

// Obtener todos los odontólogos
async function getAllOdontologos(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                OdontologoID,
                Nombre,
                Apellido,
                Especialidad,
                Telefono,
                Correo
            FROM Odontologos
            ORDER BY Apellido, Nombre
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo odontólogos:', error);
        res.status(500).json({ error: 'Error al obtener odontólogos' });
    }
}

// Obtener odontólogo por ID
async function getOdontologoById(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    OdontologoID,
                    Nombre,
                    Apellido,
                    Especialidad,
                    Telefono,
                    Correo
                FROM Odontologos
                WHERE OdontologoID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Odontólogo no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error obteniendo odontólogo:', error);
        res.status(500).json({ error: 'Error al obtener odontólogo' });
    }
}

// Obtener agenda del odontólogo
async function getAgendaOdontologo(req, res) {
    try {
        const { id } = req.params;
        const { fecha } = req.query;

        const pool = await getConnection();

        let query = `
            SELECT 
                c.CitaID,
                c.FechaCita,
                c.HoraCita,
                c.Motivo,
                p.Nombre + ' ' + p.Apellido as Paciente,
                p.Telefono
            FROM Citas c
            INNER JOIN Pacientes p ON c.PacienteID = p.PacienteID
            WHERE c.OdontologoID = @id
        `;

        const request = pool.request().input('id', sql.Int, id);

        if (fecha) {
            query += ' AND c.FechaCita = @fecha';
            request.input('fecha', sql.Date, fecha);
        } else {
            query += ' AND c.FechaCita >= CAST(GETDATE() AS DATE)';
        }

        query += ' ORDER BY c.FechaCita, c.HoraCita';

        const result = await request.query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo agenda:', error);
        res.status(500).json({ error: 'Error al obtener agenda' });
    }
}

async function createOdontologo(req, res) {
    try {
        const { nombre, apellido, especialidad, telefono, correo } = req.body;
        const pool = await getConnection();

        await pool.request()
            .input('Nombre', sql.NVarChar, nombre)
            .input('Apellido', sql.NVarChar, apellido)
            .input('Especialidad', sql.NVarChar, especialidad)
            .input('Telefono', sql.NVarChar, telefono)
            .input('Correo', sql.NVarChar, correo)
            .query(`
                INSERT INTO Odontologos (Nombre, Apellido, Especialidad, Telefono, Correo)
                VALUES (@Nombre, @Apellido, @Especialidad, @Telefono, @Correo)
            `);

        res.status(201).json({ message: 'Odontólogo creado exitosamente' });
    } catch (error) {
        console.error('Error creando odontólogo:', error);
        res.status(500).json({ error: 'Error al crear odontólogo' });
    }
}

module.exports = {
    getAllOdontologos,
    getOdontologoById,
    getAgendaOdontologo,
    createOdontologo
};
