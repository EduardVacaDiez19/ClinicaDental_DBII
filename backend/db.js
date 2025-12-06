/**
 * Database Connection Module
 * 
 * Handles SQL Server database connection using msnodesqlv8 driver.
 * Provides connection management with automatic fallback to mock mode
 * for development and testing purposes.
 * 
 * @module db
 * @requires mssql/msnodesqlv8
 * @requires dotenv
 */

const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

/**
 * SQL Server database configuration string
 * Uses Windows Authentication (Trusted Connection) to connect to local SQL Server instance
 * @constant {string}
 */
const dbConfig = "server=localhost;Database=ClinicaDental_DBII;Trusted_Connection=Yes;Driver=msnodesqlv8";

/**
 * Global connection pool instance
 * @type {sql.ConnectionPool|null}
 */
let pool = null;

/**
 * Establish database connection
 * 
 * Attempts to connect to SQL Server using the configured connection string.
 * Falls back to mock mode if connection fails, allowing development without database.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Logs connection error and switches to mock mode
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
 * Creates a mock database request object for development/testing
 * 
 * Provides a mock implementation that simulates database operations
 * without requiring an actual database connection. Returns empty results
 * by default with special handling for common queries.
 * 
 * @function mockRequest
 * @returns {Object} Mock request object with input() and query() methods
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
