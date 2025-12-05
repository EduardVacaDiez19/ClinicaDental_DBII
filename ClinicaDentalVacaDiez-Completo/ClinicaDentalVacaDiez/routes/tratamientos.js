const express = require('express');
const router = express.Router();
const tratamientosController = require('../controllers/tratamientosController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', tratamientosController.getAllTratamientos);

module.exports = router;
