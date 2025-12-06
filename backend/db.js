/**
 * Módulo de Conexión a la Base de Datos
 *
 * Maneja la conexión a SQL Server usando el driver msnodesqlv8.
 * Proporciona gestión de la conexión con retroceso automático a modo
 * simulado para desarrollo y pruebas.
 *
 * @module db
 * @requires mssql/msnodesqlv8
 * @requires dotenv
 */

const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

/**
 * Cadena de configuración para la base de datos SQL Server
 * Utiliza autenticación de Windows (Trusted Connection) para conectar
 * a la instancia local de SQL Server
 * @constant {string}
 */
const dbConfig = "server=localhost;Database=ClinicaDental_DBII;Trusted_Connection=Yes;Driver=msnodesqlv8";

/**
 * Instancia global del pool de conexión
 * @type {sql.ConnectionPool|null}
 */
let pool = null;

/**
 * Establecer conexión a la base de datos
 *
 * Intenta conectar a SQL Server usando la cadena de configuración.
 * Cuando la conexión falla, cambia a modo simulado para permitir
 * el desarrollo sin una base de datos real.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Registra el error de conexión y cambia a modo simulado
 */
const connectDB = async () => {
    try {
        pool = await sql.connect(dbConfig);
        console.log('SQL Server Connected...');
    } catch (err) {
        console.error('Database connection failed, switching to MOCK mode:', err.message);
        pool = null;
    }
};

/**
 * Crea un objeto de solicitud de base de datos simulado para desarrollo/pruebas
 *
 * Proporciona una implementación simulada que emula operaciones de base de datos
 * sin requerir una conexión real. Devuelve resultados vacíos por defecto
 * con manejo especial para consultas comunes.
 *
 * @function mockRequest
 * @returns {Object} Objeto de solicitud simulado con métodos input() y query()
 */
const mockRequest = () => {
    return {
        input: () => mockRequest(),
        query: async (q) => {
            console.log('Mock Query Executed:', q);
            if (q.includes('SELECT * FROM Usuarios')) {
                return { recordset: [] }; // No users found initially
            }
            if (q.includes('INSERT INTO Usuarios')) {
                return { rowsAffected: [1] };
            }
            return { recordset: [] };
        }
    };
};

/**
 * Obtener objeto de solicitud de base de datos
 * 
 * Retorna ya sea un objeto de solicitud de base de datos real (si está conectado) o un objeto
 * simulado para desarrollo/pruebas. Esto permite que los controladores funcionen
 * sin problemas independientemente del estado de conexión de la base de datos.
 * 
 * @function getRequest
 * @returns {sql.Request|Object} Objeto de solicitud de base de datos o equivalente simulado
 */
const getRequest = () => {
    if (pool) {
        return pool.request();
    }
    return mockRequest();
};

/**
 * Exportar módulos de base de datos
 * 
 * Proporciona acceso a la conexión SQL, función de conexión y utilidad para
 * obtener objetos de solicitud. Los controladores deben usar getRequest() para
 * compatibilidad con modo simulado.
 * 
 * @exports {Object} Módulo con connectDB, sql y getRequest
 */
module.exports = { connectDB, sql, getRequest };
