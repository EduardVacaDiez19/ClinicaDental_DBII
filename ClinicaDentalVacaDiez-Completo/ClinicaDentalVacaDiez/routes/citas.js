const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/citas - Obtener todas las citas
router.get('/', citasController.getAllCitas);

// GET /api/citas/:id - Obtener cita por ID
router.get('/:id', citasController.getCitaById);

// GET /api/citas/fecha/:fecha - Obtener citas por fecha
router.get('/fecha/:fecha', citasController.getCitasByFecha);

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
