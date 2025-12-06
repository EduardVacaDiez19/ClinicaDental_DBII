const jwt = require('jsonwebtoken');

// Fallback JWT_SECRET con warning si no está definido
const JWT_SECRET = process.env.JWT_SECRET || 'clinica-dental-secret-key-dev-only';
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET no está definido. Usando clave por defecto (solo para desarrollo).');
}

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

function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'Administrador') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    next();
}

module.exports = {
    authenticateToken,
    authorizeAdmin
};
