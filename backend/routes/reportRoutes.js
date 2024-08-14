const express = require('express');
const { generateReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/generate', protect, admin, generateReport);

module.exports = router;
