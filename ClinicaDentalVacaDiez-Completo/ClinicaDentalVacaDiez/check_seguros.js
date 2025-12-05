const { getConnection } = require('./config/database');

async function checkSeguros() {
    try {
        const pool = await getConnection();
        // Check for tables with 'Seguro' in name
        const tables = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%Seguro%'");
        console.log('Tablas encontradas:', tables.recordset);

        if (tables.recordset.length > 0) {
            const tableName = tables.recordset[0].TABLE_NAME;
            console.log(`Columnas de ${tableName}:`);
            const columns = await pool.request().query(`SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);
            console.table(columns.recordset);

            // If it looks like a catalog, show some data
            const data = await pool.request().query(`SELECT TOP 5 * FROM ${tableName}`);
            console.log('Datos de ejemplo:', data.recordset);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSeguros();
