
const { getConnection, sql } = require('./config/database');

async function checkFacturasSchema() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Facturas'
        `);
        console.log('Columns in Facturas table:', result.recordset);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkFacturasSchema();
