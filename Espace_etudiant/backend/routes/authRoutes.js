const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);   // OK : login est défini
router.post('/signup', authController.signup); // OK : signup est défini

module.exports = router;
