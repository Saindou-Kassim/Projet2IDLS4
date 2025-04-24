const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route de connexion
router.post('/login', authController.login);

// Route de déconnexion (protégée)
router.post('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;
