const express = require('express');
const router = express.Router();
const odontologosController = require('../controllers/odontologosController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/odontologos - Obtener todos los odontólogos
router.get('/', odontologosController.getAllOdontologos);

// POST /api/odontologos - Crear nuevo odontólogo (solo admin)
router.post('/', authorizeAdmin, odontologosController.createOdontologo);

// GET /api/odontologos/:id - Obtener odontólogo por ID
router.get('/:id', odontologosController.getOdontologoById);

// GET /api/odontologos/:id/agenda - Obtener agenda del odontólogo
router.get('/:id/agenda', odontologosController.getAgendaOdontologo);

module.exports = router;
