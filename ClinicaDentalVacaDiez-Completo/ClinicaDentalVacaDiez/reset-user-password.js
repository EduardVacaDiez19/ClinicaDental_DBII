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

async function resetUserPassword() {
    try {
        const pool = await sql.connect(config);

        // Generar nuevo hash para 'user123'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('user123', salt);

        console.log('Nuevo hash generado para usuario:', hashedPassword);

        // Verificar si existe el usuario
        const checkUser = await pool.request()
            .input('username', sql.NVarChar, 'usuario')
            .query("SELECT UsuarioID FROM Usuarios WHERE NombreUsuario = @username");

        if (checkUser.recordset.length > 0) {
            // Actualizar usuario existente
            const result = await pool.request()
                .input('password', sql.NVarChar, hashedPassword)
                .input('username', sql.NVarChar, 'usuario')
                .query("UPDATE Usuarios SET PasswordHash = @password WHERE NombreUsuario = @username");
            console.log('✅ Contraseña de "usuario" reseteada a: user123');
        } else {
            // Crear usuario si no existe (RolID 2 suele ser Paciente/Usuario normal)
            // Primero verificamos qué RolID corresponde a Paciente
            const roles = await pool.request().query("SELECT RolID, NombreRol FROM Roles");
            console.log('Roles disponibles:', roles.recordset);

            // Asumimos RolID 2, pero ajustaremos si es necesario
            const result = await pool.request()
                .input('username', sql.NVarChar, 'usuario')
                .input('password', sql.NVarChar, hashedPassword)
                .query("INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID) VALUES (@username, @password, 2)");
            console.log('✅ Usuario "usuario" creado con contraseña: user123');
        }

        pool.close();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

resetUserPassword();
