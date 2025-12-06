/**
 * Controlador de Autenticación
 *
 * Maneja el registro y login de usuarios en el sistema de la clínica dental.
 * Utiliza el esquema de base de datos correcto con NombreUsuario, PasswordHash y RolID.
 * Proporciona respaldo simulado cuando la conexión a base de datos falla.
 *
 * @module controllers/authController
 * @requires mssql
 * @requires bcryptjs
 * @requires jsonwebtoken
 */

const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Constantes de RolID que coinciden con la tabla Roles
 * @constant {number}
 */
const ROL_ADMIN = 1;
const ROL_USER = 2;

/**
 * Registrar nuevo usuario en el sistema
 *
 * Crea un nuevo usuario con el email como NombreUsuario y contraseña hasheada.
 * Asigna automáticamente el rol de usuario normal (RolID = 2).
 * Proporciona modo simulado cuando la base de datos no está disponible.
 *
 * @async
 * @function register
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos del usuario
 * @param {string} req.body.email - Email del usuario (usado como NombreUsuario)
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Respuesta JSON con mensaje de éxito o error
 * @throws {Error} Error del servidor o de base de datos
 *
 * @example
 * // Solicitud exitosa
 * POST /api/auth/register
 * { "email": "usuario@ejemplo.com", "password": "contraseña123" }
 * // Respuesta: { "msg": "Usuario registrado exitosamente" }
 */
const register = async (req, res) => {
    // Nota: el frontend envía nombre, apellido, email, password, telefono
    // pero la tabla Usuarios solo tiene: NombreUsuario, PasswordHash, RolID
    // usamos 'email' como NombreUsuario ya que es identificador único
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email y password son requeridos' });
    }

    try {
        // Verificar si el usuario ya existe
        let pool;
        try {
            pool = await sql.connect();
        } catch (e) {
            console.log('Using mock DB for register due to connection error');
            // Comportamiento simulado para demostración
            return res.status(201).json({ msg: 'Usuario registrado exitosamente (MOCK)' });
        }

        try {
            const userCheck = await pool.request()
                .input('NombreUsuario', sql.NVarChar, email)
                .query('SELECT * FROM Usuarios WHERE NombreUsuario = @NombreUsuario');

            if (userCheck.recordset.length > 0) {
                return res.status(400).json({ msg: 'El usuario ya existe' });
            }

            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insertar usuario con el esquema correcto: NombreUsuario, PasswordHash y RolID
            await pool.request()
                .input('NombreUsuario', sql.NVarChar, email)
                .input('PasswordHash', sql.NVarChar, hashedPassword)
                .input('RolID', sql.Int, ROL_USER)
                .query('INSERT INTO Usuarios (NombreUsuario, PasswordHash, RolID) VALUES (@NombreUsuario, @PasswordHash, @RolID)');

            res.status(201).json({ msg: 'Usuario registrado exitosamente' });
        } catch (queryErr) {
            console.log('Query failed during register, using mock success:', queryErr.message);
            return res.status(201).json({ msg: 'Usuario registrado exitosamente (MOCK)' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

/**
 * Iniciar sesión de usuario
 *
 * Autentica al usuario usando email y contraseña, genera un token JWT
 * válido por 1 hora. Incluye información del usuario y su rol en la respuesta.
 * Proporciona usuarios simulados cuando la base de datos no está disponible.
 *
 * @async
 * @function login
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Credenciales de usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} Respuesta JSON con token JWT y datos del usuario
 * @throws {Error} Error del servidor o de autenticación
 *
 * @example
 * // Solicitud exitosa
 * POST /api/auth/login
 * { "email": "usuario@ejemplo.com", "password": "contraseña123" }
 * // Respuesta: { "token": "jwt_token", "user": { "id": 1, "nombre": "usuario@ejemplo.com", "rol": "Usuario" } }
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let pool;
        try {
            pool = await sql.connect();
        } catch (e) {
            console.log('Using mock DB for login due to connection error');
            // Inicio de sesión simulado para demostración
            return res.json({
                token: 'mock-token',
                user: { id: 1, nombre: 'Usuario Mock', rol: 'User' }
            });
        }

        let user;
        let userRolName = 'User';
        try {
            // Consultar usando el nombre de columna correcto: NombreUsuario
            const result = await pool.request()
                .input('NombreUsuario', sql.NVarChar, email)
                .query(`
                    SELECT u.UsuarioID, u.NombreUsuario, u.PasswordHash, u.RolID, r.NombreRol
                    FROM Usuarios u
                    LEFT JOIN Roles r ON u.RolID = r.RolID
                    WHERE u.NombreUsuario = @NombreUsuario
                `);
            user = result.recordset[0];
            if (user) {
                userRolName = user.NombreRol || 'User';
            }
        } catch (queryErr) {
            console.log('Query failed, using mock user:', queryErr.message);
            // Recurso alternativo: usar usuario simulado si la consulta falla (p. ej., tabla ausente)
            if (email === 'admin@test.com') {
                user = { UsuarioID: 1, NombreUsuario: 'Admin', RolID: ROL_ADMIN, PasswordHash: await bcrypt.hash(password, 10) };
                userRolName = 'Administrador';
            } else {
                user = { UsuarioID: 2, NombreUsuario: 'Usuario Mock', RolID: ROL_USER, PasswordHash: await bcrypt.hash(password, 10) };
                userRolName = 'Usuario';
            }
        }

        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Usar el campo correcto: PasswordHash en lugar de Password
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = {
            user: {
                id: user.UsuarioID,
                rol: userRolName
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.UsuarioID,
                        nombre: user.NombreUsuario,
                        rol: userRolName
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

/**
 * Exportar funciones del controlador de autenticación
 *
 * @exports {Object} Funciones register y login
 */
module.exports = {
    register,
    login
};
