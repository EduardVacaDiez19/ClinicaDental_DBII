const { getConnection } = require('./config/database');

async function updateSeguros() {
    try {
        const pool = await getConnection();
        // Force update by ID if names don't match exactly
        await pool.request().query(`
            UPDATE Seguros SET Descuento = 0.20 WHERE SeguroID = 1; 
            UPDATE Seguros SET Descuento = 0.15 WHERE SeguroID = 2; 
            UPDATE Seguros SET Descuento = 0.10 WHERE SeguroID = 3; 
            UPDATE Seguros SET Descuento = 0.05 WHERE SeguroID = 4;
            UPDATE Seguros SET Descuento = 0.08 WHERE SeguroID = 5;
            UPDATE Seguros SET Descuento = 0.12 WHERE SeguroID = 6;
        `);
        console.log('Seguros updated successfully');

        const res = await pool.request().query('SELECT * FROM Seguros');
        console.log(JSON.stringify(res.recordset, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateSeguros();
