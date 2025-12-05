const { getConnection } = require('./config/database');

async function fixSeguros() {
    try {
        const pool = await getConnection();
        // Update names to match what patients have
        await pool.request().query(`
            UPDATE Seguros SET Nombre = 'Caja Nacional' WHERE SeguroID = 1;
            UPDATE Seguros SET Nombre = 'Seguro Privado' WHERE SeguroID = 2;
            UPDATE Seguros SET Nombre = 'Universitario' WHERE SeguroID = 3;
        `);
        console.log('Seguros names updated successfully');

        const res = await pool.request().query('SELECT * FROM Seguros');
        console.log(JSON.stringify(res.recordset, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixSeguros();
