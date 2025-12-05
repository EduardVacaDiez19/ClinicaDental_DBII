const { getConnection } = require('./config/database');

async function checkSP() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("sp_helptext 'sp_GenerarFactura'");
        console.log('SP Definition:');
        result.recordset.forEach(row => process.stdout.write(row.Text));
        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSP();
