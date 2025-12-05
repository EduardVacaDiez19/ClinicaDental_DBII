const { getConnection } = require('./config/database');

async function checkUsers() {
    try {
        const pool = await getConnection();
        const cols = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios'");
        console.log('Columns:', cols.recordset.map(c => c.COLUMN_NAME));

        const users = await pool.request().query("SELECT * FROM Usuarios");
        console.log('Users:', users.recordset);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUsers();
