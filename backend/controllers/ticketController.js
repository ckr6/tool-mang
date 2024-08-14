const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Asset = require('../models/Asset');

const createTicket = async (req, res) => {
  const { userId, assetId, description, priority } = req.body;
  try {
    const ticket = await Ticket.create({ userId, assetId, description, priority });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ include: [User, Asset] });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      ticket.status = status;
      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createTicket, getTickets, updateTicketStatus };
