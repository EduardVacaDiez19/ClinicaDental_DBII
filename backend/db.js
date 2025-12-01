const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const dbConfig = "server=localhost;Database=ClinicaDental_DBII;Trusted_Connection=Yes;Driver=msnodesqlv8";

let pool = null;

const connectDB = async () => {
    try {
        pool = await sql.connect(dbConfig);
        console.log('SQL Server Connected...');
    } catch (err) {
        console.error('Database connection failed, switching to MOCK mode:', err.message);
        pool = null;
    }
};

// Mock wrapper for request
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

// Export a wrapper that checks if pool is connected
const getRequest = () => {
    if (pool) {
        return pool.request();
    }
    return mockRequest();
};

// We need to monkey-patch sql.connect or how it's used in controllers
// But since controllers import 'sql' from 'mssql', they use the global sql object usually?
// Actually my db.js exports { connectDB, sql }.
// If I change the export to return a wrapped object it might break things if I'm not careful.
// Let's just export the original sql but if connection failed, we might need to handle it in controllers.
// BETTER APPROACH: Update controllers to use a helper from db.js to get request.

module.exports = { connectDB, sql };
