const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'ClinicaDental',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function getConnection() {
    try {
        if (pool) {
            return pool;
        }

        console.log(`Intentando conectar a SQL Server en ${config.server}...`);
        pool = await sql.connect(config);
        console.log('✅ Conexión exitosa a SQL Server');

        return pool;
    } catch (error) {
        console.error('❌ Error conectando a SQL Server:', error);
        throw error;
    }
}

async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Conexión cerrada correctamente');
        }
    } catch (error) {
        console.error('Error cerrando la conexión:', error);
    }
}

module.exports = {
    getConnection,
    closeConnection,
    sql
};