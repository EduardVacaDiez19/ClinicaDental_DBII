const { getConnection } = require('../config/database');

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
