const { getConnection } = require('./config/database');

async function checkSegurosTable() {
    try {
        const pool = await getConnection();
        console.log('--- Columnas de Seguros ---');
        const columns = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Seguros'");
        console.table(columns.recordset);

        console.log('--- Datos de Seguros ---');
        const data = await pool.request().query("SELECT * FROM Seguros");
        console.table(data.recordset);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSegurosTable();
