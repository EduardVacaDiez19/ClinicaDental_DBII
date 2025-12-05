const { getConnection } = require('../config/database');

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
