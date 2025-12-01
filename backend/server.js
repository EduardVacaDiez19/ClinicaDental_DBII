const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('Clinica Dental Vaca Diez API Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
