const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/pacientes - Obtener todos los pacientes
router.get('/', pacientesController.getAllPacientes);

// GET /api/pacientes/:id - Obtener paciente por ID
router.get('/:id', pacientesController.getPacienteById);

// GET /api/pacientes/:id/historial - Obtener historial del paciente
router.get('/:id/historial', pacientesController.getHistorialPaciente);

// POST /api/pacientes - Crear nuevo paciente (solo admin)
router.post('/', authorizeAdmin, pacientesController.createPaciente);

// PUT /api/pacientes/:id - Actualizar paciente (solo admin)
router.put('/:id', authorizeAdmin, pacientesController.updatePaciente);

// DELETE /api/pacientes/:id - Eliminar paciente (solo admin)
router.delete('/:id', authorizeAdmin, pacientesController.deletePaciente);

module.exports = router;
