const { getConnection } = require('../config/database');

/**
 * Obtiene todos los tratamientos dentales disponibles
 * @async
 * @function getAllTratamientos
 * @param {Object} req - objeto de peticion Express
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con array de tratamientos ordenados por nombre, incluyendo costos
 */
async function getAllTratamientos(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT TratamientoID, Nombre as NombreTratamiento, Costo FROM Tratamientos ORDER BY Nombre');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo tratamientos:', error);
        res.status(500).json({ error: 'Error al obtener tratamientos' });
    }
}

module.exports = {
    getAllTratamientos
};
