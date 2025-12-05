const { getConnection } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const pool = await getConnection();
        const sqlContent = fs.readFileSync(path.join(__dirname, 'add-insurance-column.sql'), 'utf8');

        await pool.request().query(sqlContent);
        console.log('Migración ejecutada.');
        process.exit(0);
    } catch (error) {
        console.error('Error en migración:', error);
        process.exit(1);
    }
}

runMigration();
