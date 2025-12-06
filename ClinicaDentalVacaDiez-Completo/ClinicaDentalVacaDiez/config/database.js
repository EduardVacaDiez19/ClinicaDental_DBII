/**
 * @fileoverview Modulo de configuracion y conexion a SQL Server
 * @module config/database
 * @requires mssql
 * @requires dotenv
 */

const sql = require('mssql');
require('dotenv').config();

/**
 * Configuracion de conexion a SQL Server
 * @const {Object} config
 * @property {string} server - servidor de base de datos
 * @property {string} database - nombre de la base de datos
 * @property {string} user - usuario de autenticacion
 * @property {string} password - contraseña de autenticacion
 * @property {number} port - puerto de conexion (default: 1433)
 * @property {Object} options - opciones de conexion
 * @property {Object} pool - configuracion del pool de conexiones
 */
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

/**
 * Obtiene o crea una conexion al pool de SQL Server
 * @async
 * @function getConnection
 * @returns {Promise<sql.ConnectionPool>} pool de conexiones activo
 * @throws {Error} si falla la conexion a la base de datos
 * @description implementa patron singleton para reutilizar la misma conexion
 */
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

/**
 * Cierra la conexion al pool de SQL Server
 * @async
 * @function closeConnection
 * @returns {Promise<void>}
 * @description libera recursos del pool y resetea la variable global
 */
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
