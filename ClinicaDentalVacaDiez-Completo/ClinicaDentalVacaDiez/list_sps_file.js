const { getConnection } = require('./config/database');
const fs = require('fs');

async function listProcedures() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_TYPE = 'PROCEDURE'
        `);
        fs.writeFileSync('procs.txt', JSON.stringify(result.recordset, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listProcedures();
