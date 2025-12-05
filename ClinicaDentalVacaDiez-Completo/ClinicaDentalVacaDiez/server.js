const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getConnection, closeConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const citasRoutes = require('./routes/citas');
const odontologosRoutes = require('./routes/odontologos');
const dashboardRoutes = require('./routes/dashboard');
const segurosRoutes = require('./routes/seguros');
const tratamientosRoutes = require('./routes/tratamientos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: true, // Permitir cualquier origen en desarrollo
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Servir archivos estáticos
app.use(express.static('public'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/odontologos', odontologosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seguros', segurosRoutes);
app.use('/api/tratamientos', tratamientosRoutes);

// Información de la API
app.get('/api/info', (req, res) => {
    res.json({
        message: 'API de Clínica Dental Vaca Diez',
        version: '1.0.0',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register'
            },
            pacientes: {
                getAll: 'GET /api/pacientes',
                getById: 'GET /api/pacientes/:id',
                getHistorial: 'GET /api/pacientes/:id/historial',
                create: 'POST /api/pacientes',
                update: 'PUT /api/pacientes/:id',
                delete: 'DELETE /api/pacientes/:id'
            },
            citas: {
                getAll: 'GET /api/citas',
                getById: 'GET /api/citas/:id',
                getByFecha: 'GET /api/citas/fecha/:fecha',
                create: 'POST /api/citas',
                update: 'PUT /api/citas/:id',
                delete: 'DELETE /api/citas/:id'
            },
            odontologos: {
                getAll: 'GET /api/odontologos',
                getById: 'GET /api/odontologos/:id',
                getAgenda: 'GET /api/odontologos/:id/agenda'
            }
        }
    });
});

// Ruta de salud (health check)
app.get('/health', async (req, res) => {
    try {
        const pool = await getConnection();
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message
        });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
async function startServer() {
    try {
        // Probar conexión a la base de datos
        await getConnection();

        app.listen(PORT, () => {
            console.log('=================================');
            console.log('🏥 Clínica Dental Vaca Diez API');
            console.log('=================================');
            console.log(`✅ Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📊 Health Check: http://localhost:${PORT}/health`);
            console.log(`📚 Documentación: http://localhost:${PORT}/`);
            console.log('=================================');
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejo de señales de terminación
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await closeConnection();
    process.exit(0);
});

startServer();

module.exports = app;
