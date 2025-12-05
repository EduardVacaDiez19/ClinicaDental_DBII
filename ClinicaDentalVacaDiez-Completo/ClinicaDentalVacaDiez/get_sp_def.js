const { getConnection } = require('./config/database');

async function getSpDefinition() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("sp_helptext 'sp_GenerarFactura'");
        result.recordset.forEach(row => process.stdout.write(row.Text));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getSpDefinition();
