const express = require('express');
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, admin, createTicket);
router.get('/', protect, getTickets);
router.put('/:id/status', protect, admin, updateTicketStatus);

module.exports = router;
