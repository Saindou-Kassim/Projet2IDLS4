const express = require('express');
const { getExams, createExam } = require('../controllers/examController');
const router = express.Router();

router.get('/', getExams);
//router.post('/', createExam);

module.exports = router;
