const { getConnection } = require('./config/database');

async function checkSegurosColumns() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Seguros'");
        console.log(JSON.stringify(result.recordset, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSegurosColumns();
