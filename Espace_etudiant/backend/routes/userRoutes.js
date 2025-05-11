const express = require('express');
const router = express.Router();
const { saveLocation } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Route pour enregistrer la géolocalisation
router.post('/location', authenticate, saveLocation);

module.exports = router;
