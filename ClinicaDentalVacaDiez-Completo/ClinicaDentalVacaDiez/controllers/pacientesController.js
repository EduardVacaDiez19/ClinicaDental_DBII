const { getConnection, sql } = require('../config/database');

/**
 * Obtiene todos los pacientes del sistema
 * @async
 * @function getAllPacientes
 * @param {Object} req - objeto de peticion Express
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con JSON conteniendo array de pacientes ordenados por apellido
 */
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

/**
 * Obtiene un paciente especifico por su ID
 * @async
 * @function getPacienteById
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID del paciente a buscar
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con JSON del paciente encontrado o error 404
 */
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

/**
 * Crea un nuevo paciente en el sistema
 * @async
 * @function createPaciente
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.body.nombre - nombre del paciente
 * @param {string} req.body.apellido - apellido del paciente
 * @param {string} req.body.fechaNacimiento - fecha de nacimiento (formato YYYY-MM-DD)
 * @param {string} [req.body.genero='M'] - genero del paciente (M/F)
 * @param {string} req.body.telefono - numero de telefono
 * @param {string} req.body.correo - correo electronico
 * @param {string} req.body.direccion - direccion del paciente
 * @param {string} req.body.tipoSeguro - tipo de seguro medico
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con ID del paciente creado o error
 */
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

/**
 * Actualiza los datos de un paciente existente
 * @async
 * @function updatePaciente
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID del paciente a actualizar
 * @param {string} req.body.nombre - nuevo nombre del paciente
 * @param {string} req.body.apellido - nuevo apellido del paciente
 * @param {string} req.body.fechaNacimiento - nueva fecha de nacimiento
 * @param {string} req.body.genero - nuevo genero
 * @param {string} req.body.telefono - nuevo telefono
 * @param {string} req.body.correo - nuevo correo
 * @param {string} req.body.direccion - nueva direccion
 * @param {string} req.body.tipoSeguro - nuevo tipo de seguro
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con mensaje de exito o error
 * @description valida que el paciente existe antes de actualizar y que nombre/apellido esten presentes
 */
async function updatePaciente(req, res) {
    try {
        const { id } = req.params;
        const { nombre, apellido, fechaNacimiento, genero, telefono, correo, direccion, tipoSeguro } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido) {
            return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
        }

        const pool = await getConnection();

        // Verificar si el paciente existe antes de actualizar
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT PacienteID FROM Pacientes WHERE PacienteID = @id');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

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

/**
 * Elimina un paciente del sistema
 * @async
 * @function deletePaciente
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID del paciente a eliminar
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con mensaje de exito o error
 * @description usa stored procedure sp_EliminarPacienteCompleto que maneja relaciones en cascada
 */
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

/**
 * Obtiene el historial medico completo de un paciente
 * @async
 * @function getHistorialPaciente
 * @param {Object} req - objeto de peticion Express
 * @param {string} req.params.id - ID del paciente
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con array del historial medico del paciente
 * @description ejecuta stored procedure obtenerhistorialpaciente
 */
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
