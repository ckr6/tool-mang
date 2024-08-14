const express = require('express');
const { notifyOverdueLoans } = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/overdue-loans', protect, admin, notifyOverdueLoans);

module.exports = router;
