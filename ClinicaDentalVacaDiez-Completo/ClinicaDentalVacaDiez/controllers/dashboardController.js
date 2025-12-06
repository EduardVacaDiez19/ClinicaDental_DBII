const { getConnection, sql } = require('../config/database');

async function getAdminStats(req, res) {
    try {
        const pool = await getConnection();

        // Citas para hoy
        const citasHoyResult = await pool.request().query(`
            SELECT COUNT(*) as count
            FROM Citas
            WHERE FechaCita = CAST(GETDATE() AS DATE)
        `);
        const citasHoy = citasHoyResult.recordset[0].count;

        // Doctores activos
        const doctoresResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM Odontologos
        `);
        const doctoresActivos = doctoresResult.recordset[0].count;

        // Stock bajo - using Medicamentos table (Inventario doesn't exist in schema)
        // Medicamentos has: MedicamentoID, Nombre, Descripcion, Stock, Precio
        const stockBajoResult = await pool.request().query(`
            SELECT Nombre as NombreProducto, Stock, 10 as StockMinimo
            FROM Medicamentos
            WHERE Stock < 10
        `);
        const alertasStock = stockBajoResult.recordset;

        const pacientesResult = await pool.request().query(`
            SELECT COUNT(*) as count FROM Pacientes
        `);
        const pacientesTotales = pacientesResult.recordset[0].count;

        // Total Facturado
        const facturadoResult = await pool.request().query(`
            SELECT SUM(Total) as total FROM Facturas
        `);
        const totalFacturado = facturadoResult.recordset[0].total || 0;

        res.json({
            citasHoy,
            doctoresActivos,
            pacientesTotales,
            totalFacturado,
            alertasStock
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas de admin:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
}

async function getPatientStats(req, res) {
    try {
        const { pacienteId } = req.params;

        // Validar que pacienteId sea un número válido
        if (!pacienteId || isNaN(parseInt(pacienteId))) {
            return res.status(400).json({ error: 'ID de paciente inválido' });
        }

        const pool = await getConnection();

        // Verificar primero si el paciente existe
        const pacienteCheck = await pool.request()
            .input('pacienteId', sql.Int, pacienteId)
            .query('SELECT PacienteID, TipoSeguro FROM Pacientes WHERE PacienteID = @pacienteId');

        if (pacienteCheck.recordset.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        const tipoSeguro = pacienteCheck.recordset[0].TipoSeguro || null;

        // Próxima cita
        const proximaCitaResult = await pool.request()
            .input('pacienteId', sql.Int, pacienteId)
            .query(`
                SELECT TOP 1
                    c.FechaCita,
                    c.HoraCita,
                    o.Nombre + ' ' + o.Apellido as Odontologo
                FROM Citas c
                INNER JOIN Odontologos o ON c.OdontologoID = o.OdontologoID
                WHERE c.PacienteID = @pacienteId
                AND c.FechaCita >= CAST(GETDATE() AS DATE)
                ORDER BY c.FechaCita ASC, c.HoraCita ASC
            `);

        const proximaCita = proximaCitaResult.recordset[0] || null;

        // Citas pendientes
        const citasPendientesResult = await pool.request()
            .input('pacienteId', sql.Int, pacienteId)
            .query(`
                SELECT COUNT(*) as count
                FROM Citas
                WHERE PacienteID = @pacienteId
                AND FechaCita >= CAST(GETDATE() AS DATE)
            `);
        const citasPendientes = citasPendientesResult.recordset[0].count;

        res.json({
            proximaCita,
            citasPendientes,
            tipoSeguro
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas de paciente:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
}

module.exports = {
    getAdminStats,
    getPatientStats
};
