const { getConnection } = require('./config/database');

async function findStoredProcedures() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT ROUTINE_NAME, ROUTINE_DEFINITION 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_TYPE = 'PROCEDURE' 
            AND (ROUTINE_NAME LIKE '%Factura%' OR ROUTINE_NAME LIKE '%Cobrar%')
        `);

        console.log('Found Procedures:');
        result.recordset.forEach(proc => {
            console.log(`\n--- ${proc.ROUTINE_NAME} ---`);
            console.log(proc.ROUTINE_DEFINITION);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

findStoredProcedures();
