/**
 * Clínica Dental Vaca Diez - Backend Server
 * 
 * Main Express server configuration and initialization for the dental clinic
 * management system API. Handles middleware setup, database connection,
 * and route registration.
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
 * Server port configuration
 * Uses environment variable PORT or defaults to 5000
 * @constant {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 * 
 * Configures CORS for cross-origin requests and JSON body parsing
 * for incoming request bodies
 */
app.use(cors());
app.use(express.json());

/**
 * Initialize database connection
 * Establishes connection to SQL Server database with fallback to mock mode
 */
connectDB();

/**
 * API Routes Configuration
 * 
 * Registers authentication routes under /api/auth prefix
 * All authentication endpoints are handled by authRoutes module
 */
app.use('/api/auth', require('./routes/authRoutes'));

/**
 * Health Check Endpoint
 * 
 * @route GET /
 * @desc Confirms API is running and accessible
 * @access Public
 * @returns {string} API status message
 */
app.get('/', (req, res) => {
  res.send('Clinica Dental Vaca Diez API Running');
});

/**
 * Start Express Server
 * 
 * Initializes the HTTP server and begins listening for incoming requests
 * on the configured port
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
