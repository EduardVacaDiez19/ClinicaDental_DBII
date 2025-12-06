/**
 * Rutas de Autenticación
 * 
 * Define los endpoints de la API para registro y login de usuarios.
 * Todas las rutas son públicas y no requieren autenticación previa.
 * 
 * @module routes/authRoutes
 * @requires express
 * @requires ../controllers/authController
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * @route   POST api/auth/register
 * @desc    Registrar nuevo usuario en el sistema
 * @access  Public
 * @param {string} email - Email del usuario (usado como nombre de usuario)
 * @param {string} password - Contraseña del usuario
 * @returns {Object} Mensaje de éxito y estado 201
 */
router.post('/register', register);

/**
 * @route   POST api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Public
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} Token JWT y datos del usuario
 */
router.post('/login', login);

/**
 * Exportar enrutador de autenticación
 * 
 * @exports {express.Router} Enrutador con rutas de autenticación
 */
module.exports = router;
