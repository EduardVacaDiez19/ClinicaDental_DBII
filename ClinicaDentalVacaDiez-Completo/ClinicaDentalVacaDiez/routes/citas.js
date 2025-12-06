/**
 * Rutas de Gestión de Citas
 * 
 * Define todos los endpoints de la API para la administración de citas médicas.
 * Requiere autenticación para todas las operaciones. Incluye funciones para
 * crear, leer, actualizar y cancelar citas, así como generar facturas.
 * 
 * @module routes/citas
 * @requires express
 * @requires ../controllers/citasController
 * @requires ../middleware/auth
 */

const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

/**
 * Middleware de autenticación
 * Todas las rutas de citas requieren token JWT válido
 */
router.use(authenticateToken);

/**
 * @route   GET /api/citas
 * @desc    Obtener todas las citas del sistema
 * @access  Private (requiere autenticación)
 * @returns {Array} Lista de citas con información de paciente y odontólogo
 */
router.get('/', citasController.getAllCitas);

// IMPORTANT: Specific routes MUST come BEFORE parameterized routes
// Otherwise /fecha/:fecha would match /:id with id='fecha'

// GET /api/citas/fecha/:fecha - Obtener citas por fecha
router.get('/fecha/:fecha', citasController.getCitasByFecha);

// GET /api/citas/:id - Obtener cita por ID (must come AFTER /fecha/:fecha)
router.get('/:id', citasController.getCitaById);

// GET /api/citas/:id/detalle-pago - Obtener detalle de pago para una cita
router.get('/:id/detalle-pago', citasController.getDetallePago);

// POST /api/citas/:id/facturar - Generar factura para una cita
router.post('/:id/facturar', citasController.generarFactura);

// POST /api/citas - Crear nueva cita
router.post('/', citasController.createCita);

// PUT /api/citas/:id - Actualizar cita
router.put('/:id', citasController.updateCita);

// DELETE /api/citas/:id - Cancelar cita
router.delete('/:id', citasController.deleteCita);

module.exports = router;
