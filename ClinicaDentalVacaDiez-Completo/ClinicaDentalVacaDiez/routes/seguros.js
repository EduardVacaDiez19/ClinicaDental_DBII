const express = require('express');
const router = express.Router();
const segurosController = require('../controllers/segurosController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', segurosController.getAllSeguros);

module.exports = router;
