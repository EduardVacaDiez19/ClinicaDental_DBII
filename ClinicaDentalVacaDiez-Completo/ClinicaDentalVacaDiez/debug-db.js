require('dotenv').config();
const sql = require('mssql');

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
    }
};

console.log('Probando conexión SQL Auth con:', {
    server: config.server,
    user: config.user,
    database: config.database
});

sql.connect(config).then(pool => {
    console.log('✅ ¡Conexión exitosa con usuario SQL!');
    pool.close();
    process.exit(0);
}).catch(err => {
    console.log('❌ Error de conexión:');
    console.log(err.message);
    process.exit(1);
});
