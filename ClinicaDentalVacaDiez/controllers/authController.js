const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/database');

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        const pool = await getConnection();
        
        // Buscar usuario en la base de datos
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT 
                    u.UsuarioID,
                    u.NombreUsuario,
                    u.PasswordHash,
                    u.RolID,
                    r.NombreRol,
                    CASE 
                        WHEN u.EmpleadoRelacionadoID IS NOT NULL THEN 
                            (SELECT Nombre + ' ' + Apellido FROM Odontologos WHERE OdontologoID = u.EmpleadoRelacionadoID)
                        WHEN u.PacienteRelacionadoID IS NOT NULL THEN 
                            (SELECT Nombre + ' ' + Apellido FROM Pacientes WHERE PacienteID = u.PacienteRelacionadoID)
                        ELSE 'Usuario'
                    END as NombreCompleto
                FROM Usuarios u
                INNER JOIN Roles r ON u.RolID = r.RolID
                WHERE u.NombreUsuario = @username
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.PasswordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                userId: user.UsuarioID,
                username: user.NombreUsuario,
                role: user.NombreRol
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.UsuarioID,
                username: user.NombreUsuario,
                name: user.NombreCompleto,
                role: user.NombreRol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function register(req, res) {
    try {
        const { username, password, roleId, nombre } = req.body;

        if (!username || !password || !roleId) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const pool = await getConnection();

        // Verificar si el usuario ya existe
        const checkUser = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT UsuarioID FROM Usuarios WHERE NombreUsuario = @username');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('passwordHash', sql.NVarChar, hashedPassword)
            .input('roleId', sql.Int, roleId)
            .query(`
                INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID)
                VALUES (@username, @passwordHash, @roleId)
            `);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
    login,
    register
};
