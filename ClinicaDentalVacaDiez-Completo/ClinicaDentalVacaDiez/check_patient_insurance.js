const { getConnection } = require('./config/database');

async function checkPatientInsurance() {
    try {
        const pool = await getConnection();
        const res = await pool.request().query(`
            SELECT 
                p.PacienteID, 
                p.Nombre, 
                p.Apellido, 
                p.TipoSeguro, 
                s.Descuento 
            FROM Pacientes p 
            LEFT JOIN Seguros s ON p.TipoSeguro = s.Nombre 
            WHERE p.PacienteID = 2003
        `);
        console.log(JSON.stringify(res.recordset, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkPatientInsurance();
