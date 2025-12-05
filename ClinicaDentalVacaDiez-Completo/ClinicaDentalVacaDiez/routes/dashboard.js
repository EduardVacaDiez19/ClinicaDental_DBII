const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Estadísticas para Admin
router.get('/admin', authenticateToken, authorizeAdmin, dashboardController.getAdminStats);

// Estadísticas para Paciente
router.get('/paciente/:pacienteId', authenticateToken, dashboardController.getPatientStats);

module.exports = router;
