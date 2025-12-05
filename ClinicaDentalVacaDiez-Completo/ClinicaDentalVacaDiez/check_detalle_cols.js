const { getConnection } = require('./config/database');

async function checkDetalleCols() {
    try {
        const pool = await getConnection();
        const res = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DetalleCitaTratamiento'");
        console.log(res.recordset.map(c => c.COLUMN_NAME));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkDetalleCols();
