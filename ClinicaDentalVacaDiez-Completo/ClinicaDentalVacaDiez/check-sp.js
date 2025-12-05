const { getConnection } = require('./config/database');
const sql = require('mssql');

async function checkSPParams() {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query("SELECT PARAMETER_NAME, DATA_TYPE FROM information_schema.parameters WHERE SPECIFIC_NAME = 'AgendarCita'");

        console.log('Parámetros del SP AgendarCita:');
        console.table(result.recordset);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSPParams();
