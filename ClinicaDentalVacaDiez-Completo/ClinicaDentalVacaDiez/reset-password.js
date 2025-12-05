const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

async function resetPassword() {
    try {
        const pool = await sql.connect(config);

        // Generar nuevo hash para 'admin123'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        console.log('Nuevo hash generado:', hashedPassword);

        // Actualizar usuario admin
        const result = await pool.request()
            .input('password', sql.NVarChar, hashedPassword)
            .query("UPDATE Usuarios SET PasswordHash = @password WHERE NombreUsuario = 'admin'");

        console.log('Filas afectadas:', result.rowsAffected);
        console.log('✅ Contraseña de admin reseteada a: admin123');

        pool.close();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

resetPassword();
