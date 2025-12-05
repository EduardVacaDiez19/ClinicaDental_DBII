const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('./config/database');

async function resetPassword() {
    try {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await getConnection();
        await pool.request()
            .input('pass', sql.NVarChar, hashedPassword)
            .query("UPDATE Usuarios SET PasswordHash = @pass WHERE NombreUsuario = 'usuario'");

        console.log('Password reset for usuario');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

resetPassword();
