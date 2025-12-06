const jwt = require('jsonwebtoken');

// Fallback JWT_SECRET con warning si no está definido
const JWT_SECRET = process.env.JWT_SECRET || 'clinica-dental-secret-key-dev-only';
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET no está definido. Usando clave por defecto (solo para desarrollo).');
}

/**
 * Middleware de autenticacion JWT
 * @function authenticateToken
 * @param {Object} req - objeto de peticion Express
 * @param {Object} req.headers.authorization - header con formato 'Bearer TOKEN'
 * @param {Object} res - objeto de respuesta Express
 * @param {Function} next - callback para continuar al siguiente middleware
 * @returns {void} llama a next() si token valido, o responde con error 401/403
 * @description extrae y verifica token JWT del header Authorization, adjunta datos del usuario a req.user
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Auth Middleware - Header:', authHeader);

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }

        req.user = user;
        next();
    });
}

/**
 * Middleware de autorizacion por rol
 * @function authorizeRole
 * @param {...string} roles - roles permitidos para acceder al endpoint
 * @returns {Function} middleware que valida si req.user.role esta en la lista de roles permitidos
 * @description debe usarse despues de authenticateToken, verifica que el usuario tenga uno de los roles especificados
 * @example
 * router.get('/admin', authenticateToken, authorizeRole('Administrador'), handler)
 */
function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado. No tiene los permisos requeridos.' });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeAdmin
};
