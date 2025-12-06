/**
 * Clínica Dental Vaca Diez - Servidor Backend
 *
 * Configuración e inicialización principal del servidor Express para la API
 * del sistema de gestión de la clínica dental. Maneja la configuración de
 * middleware, la conexión a la base de datos y el registro de rutas.
 *
 * @module server
 * @requires express
 * @requires cors
 * @requires dotenv
 * @requires ./db
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');

dotenv.config();

/**
 * Express application instance
 * @constant {express.Application}
 */
const app = express();

/**
 * Configuración del puerto del servidor
 * Usa la variable de entorno PORT o por defecto 5000
 * @constant {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Configuración de middleware
 *
 * Configura CORS para peticiones cross-origin y el parseo de JSON
 * para los cuerpos de las solicitudes entrantes
 */
app.use(cors());
app.use(express.json());

/**
 * Inicializar la conexión a la base de datos
 * Establece la conexión con SQL Server con retroceso a modo simulado
 */
connectDB();

/**
 * Configuración de rutas de la API
 *
 * Registra las rutas de autenticación bajo el prefijo /api/auth
 * Todos los endpoints de autenticación son manejados por el módulo authRoutes
 */
app.use('/api/auth', require('./routes/authRoutes'));

/**
 * Endpoint de verificación de estado
 *
 * @route GET /
 * @desc Confirma que la API está en funcionamiento y accesible
 * @access Público
 * @returns {string} Mensaje de estado de la API
 */
app.get('/', (req, res) => {
  res.send('Clinica Dental Vaca Diez API Running');
});

/**
 * Iniciar el servidor Express
 *
 * Inicializa el servidor HTTP y comienza a escuchar las solicitudes
 * entrantes en el puerto configurado
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
