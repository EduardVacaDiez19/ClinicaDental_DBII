require('dotenv').config();
const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'ClinicaDental',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true',
        enableArithAbort: true
    }
};

console.log('Intentando conectar con la configuración:', {
    ...config,
    password: '***'
});

async function testConnection() {
    try {
        await sql.connect(config);
        console.log('✅ Conexión exitosa!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
        if (err.code === 'ELOGIN') {
            console.log('💡 Pista: Verifica tu usuario y contraseña en el archivo .env');
        } else if (err.code === 'ESOCKET') {
            console.log('💡 Pista: Verifica que el servidor SQL Server esté corriendo y habilitado para TCP/IP en el puerto ' + config.port);
        }
        process.exit(1);
    }
}

testConnection();
