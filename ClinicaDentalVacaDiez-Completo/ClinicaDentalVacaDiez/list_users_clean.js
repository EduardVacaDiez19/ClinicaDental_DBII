const { getConnection } = require('./config/database');

async function listUsersClean() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT NombreUsuario, RolID, PacienteRelacionadoID FROM Usuarios");
        console.log(JSON.stringify(result.recordset, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listUsersClean();
