const { getConnection } = require('./config/database');
const fs = require('fs');

async function getSpDefinition() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("sp_helptext 'sp_GenerarFactura'");
        const text = result.recordset.map(row => row.Text).join('');
        fs.writeFileSync('sp_def.sql', text);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getSpDefinition();
