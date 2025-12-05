const { getConnection } = require('./config/database');

async function listProcedures() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_TYPE = 'PROCEDURE'
            AND (ROUTINE_NAME LIKE '%Factura%' OR ROUTINE_NAME LIKE '%Cobrar%' OR ROUTINE_NAME LIKE '%Generar%')
        `);
        console.log(JSON.stringify(result.recordset, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listProcedures();
