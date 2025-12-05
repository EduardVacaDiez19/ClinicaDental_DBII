const { getConnection } = require('./config/database');

async function updateSeguros() {
    try {
        const pool = await getConnection();
        // Update discounts for known insurances
        await pool.request().query(`
            UPDATE Seguros SET Descuento = 0.20 WHERE Nombre LIKE '%Caja Nacional%';
            UPDATE Seguros SET Descuento = 0.15 WHERE Nombre LIKE '%Seguro Privado%';
            UPDATE Seguros SET Descuento = 0.10 WHERE Nombre LIKE '%Universitario%';
        `);
        console.log('Seguros updated successfully');

        const res = await pool.request().query('SELECT * FROM Seguros');
        console.log(res.recordset);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateSeguros();
