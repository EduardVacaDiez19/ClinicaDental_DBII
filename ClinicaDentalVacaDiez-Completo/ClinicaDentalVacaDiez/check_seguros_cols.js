const { getConnection } = require('./config/database');

async function checkSegurosTable() {
    try {
        const pool = await getConnection();
        const columns = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Seguros'");
        columns.recordset.forEach(c => console.log(c.COLUMN_NAME));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSegurosTable();
