const { getConnection, sql } = require('./config/database');

async function updatePatient() {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, 2003)
            .query("UPDATE Pacientes SET TipoSeguro = 'Caja Nacional' WHERE PacienteID = @id");
        console.log('Updated patient');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

updatePatient();
