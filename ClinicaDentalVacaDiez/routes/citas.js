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

// POST /api/citas - Crear nueva cita
router.post('/', citasController.createCita);

// PUT /api/citas/:id - Actualizar cita
router.put('/:id', citasController.updateCita);

// DELETE /api/citas/:id - Cancelar cita (solo admin)
router.delete('/:id', authorizeAdmin, citasController.deleteCita);

module.exports = router;
