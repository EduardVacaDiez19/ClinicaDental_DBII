const { getConnection } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const pool = await getConnection();
        const sqlContent = fs.readFileSync(path.join(__dirname, 'update_invoice_logic.sql'), 'utf8');

        // Split by GO to run in batches
        const batches = sqlContent.split('GO');

        for (const batch of batches) {
            if (batch.trim()) {
                await pool.request().query(batch);
                console.log('Batch executed successfully.');
            }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
