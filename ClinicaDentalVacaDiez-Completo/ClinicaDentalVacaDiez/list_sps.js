const { getConnection } = require('./config/database');

async function listProcedures() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_TYPE = 'PROCEDURE'
        `);
        console.table(result.recordset);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listProcedures();
