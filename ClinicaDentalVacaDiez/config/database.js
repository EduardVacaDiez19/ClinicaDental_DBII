const sql = require('mssql/msnodesqlv8'); // Asegúrate de tener instalado 'msnodesqlv8'

const config = {
    server: process.env.DB_SERVER || 'localhost', // Ojo: Si es Express suele ser 'localhost\\SQLEXPRESS'
    database: process.env.DB_DATABASE || 'ClinicaDental',
    
    // --- CAMBIOS PARA WINDOWS AUTH ---
    // 1. ELIMINAR O COMENTAR ESTAS LÍNEAS:
    // Para Windows Auth, NO se envían usuario ni contraseña, 
    // toma automáticamente el usuario de tu sesión de Windows.
    // user: process.env.DB_USER,      <-- COMENTADO
    // password: process.env.DB_PASSWORD, <-- COMENTADO

    driver: 'msnodesqlv8', // Esto es correcto y necesario
    port: parseInt(process.env.DB_PORT) || 1433,
    
    options: {
        // 2. AGREGAR ESTA LÍNEA:
        trustedConnection: true, // Indica explícitamente autenticación de confianza (Windows)
        
        encrypt: process.env.DB_ENCRYPT === 'true', // Generalmente 'false' en local
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true', // 'true' para desarrollo local
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
        
        pool = await sql.connect(config);
        console.log('✅ Conexión exitosa a SQL Server con Autenticación de Windows');
        
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