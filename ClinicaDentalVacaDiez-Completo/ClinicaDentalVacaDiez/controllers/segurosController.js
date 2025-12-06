const { getConnection } = require('../config/database');

/**
 * Obtiene todos los seguros medicos disponibles
 * @async
 * @function getAllSeguros
 * @param {Object} req - objeto de peticion Express
 * @param {Object} res - objeto de respuesta Express
 * @returns {Promise<void>} responde con array de seguros ordenados por nombre, incluyendo descuentos
 */
async function getAllSeguros(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT SeguroID, Nombre, Descuento FROM Seguros ORDER BY Nombre');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error obteniendo seguros:', error);
        res.status(500).json({ error: 'Error al obtener seguros' });
    }
}

module.exports = {
    getAllSeguros
};
