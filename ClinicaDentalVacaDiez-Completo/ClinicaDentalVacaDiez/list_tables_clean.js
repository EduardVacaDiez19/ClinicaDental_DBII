const { getConnection } = require('./config/database');

async function listTables() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME");
        result.recordset.forEach(row => console.log(row.TABLE_NAME));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listTables();
