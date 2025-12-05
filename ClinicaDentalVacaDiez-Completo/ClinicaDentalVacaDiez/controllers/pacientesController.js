const { getConnection, sql } = require('../config/database');

// Obtener todos los pacientes
async function getAllPacientes(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                PacienteID,
                Nombre,
                Apellido,
                FechaNacimiento,
                Genero,
                Telefono,
                Correo,
                Direccion,
                TipoSeguro
            FROM Pacientes
            ORDER BY Apellido, Nombre
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo pacientes:', error);
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
}

// Obtener un paciente por ID
async function getPacienteById(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    PacienteID,
                    Nombre,
                    Apellido,
                    FechaNacimiento,
                    Genero,
                    Telefono,
                    Correo,
                    Direccion,
                    TipoSeguro
                FROM Pacientes
                WHERE PacienteID = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error obteniendo paciente:', error);
        res.status(500).json({ error: 'Error al obtener paciente' });
    }
}

// Crear nuevo paciente
async function createPaciente(req, res) {
    try {
        const { nombre, apellido, fechaNacimiento, genero, telefono, correo, direccion, tipoSeguro } = req.body;

        if (!nombre || !apellido || !fechaNacimiento) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const pool = await getConnection();

        const result = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .input('fechaNacimiento', sql.Date, fechaNacimiento)
            .input('genero', sql.Char, genero || 'M')
            .input('telefono', sql.NVarChar, telefono)
            .input('correo', sql.NVarChar, correo)
            .input('direccion', sql.NVarChar, direccion)
            .input('tipoSeguro', sql.NVarChar, tipoSeguro)
            .query(`
                INSERT INTO Pacientes (Nombre, Apellido, FechaNacimiento, Genero, Telefono, Correo, Direccion, TipoSeguro)
                OUTPUT INSERTED.PacienteID
                VALUES (@nombre, @apellido, @fechaNacimiento, @genero, @telefono, @correo, @direccion, @tipoSeguro)
            `);

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            pacienteId: result.recordset[0].PacienteID
        });
    } catch (error) {
        console.error('Error creando paciente:', error);
        res.status(500).json({ error: 'Error al crear paciente' });
    }
}

// Actualizar paciente
async function updatePaciente(req, res) {
    try {
        const { id } = req.params;
        const { nombre, apellido, fechaNacimiento, genero, telefono, correo, direccion, tipoSeguro } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .input('fechaNacimiento', sql.Date, fechaNacimiento)
            .input('genero', sql.Char, genero)
            .input('telefono', sql.NVarChar, telefono)
            .input('correo', sql.NVarChar, correo)
            .input('direccion', sql.NVarChar, direccion)
            .input('tipoSeguro', sql.NVarChar, tipoSeguro)
            .query(`
                UPDATE Pacientes
                SET Nombre = @nombre,
                    Apellido = @apellido,
                    FechaNacimiento = @fechaNacimiento,
                    Genero = @genero,
                    Telefono = @telefono,
                    Correo = @correo,
                    Direccion = @direccion,
                    TipoSeguro = @tipoSeguro
                WHERE PacienteID = @id
            `);

        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        console.error('Error actualizando paciente:', error);
        res.status(500).json({ error: 'Error al actualizar paciente' });
    }
}

// Eliminar paciente
async function deletePaciente(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        // Usar el stored procedure que maneja las relaciones
        await pool.request()
            .input('pacienteId', sql.Int, id)
            .execute('sp_EliminarPacienteCompleto');

        res.json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando paciente:', error);
        res.status(500).json({ error: 'Error al eliminar paciente' });
    }
}

// Obtener historial de paciente
async function getHistorialPaciente(req, res) {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        const result = await pool.request()
            .input('pacienteId', sql.Int, id)
            .execute('obtenerhistorialpaciente');

        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
}

module.exports = {
    getAllPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getHistorialPaciente
};
