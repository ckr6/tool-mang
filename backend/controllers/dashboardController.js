const Asset = require('../models/Asset');
const Ticket = require('../models/Ticket');
const Loan = require('../models/Loan');

const getDashboardData = async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const totalTickets = await Ticket.count();
    const totalLoans = await Loan.count();

    const ticketsByStatus = await Ticket.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });

    res.json({ totalAssets, totalTickets, totalLoans, ticketsByStatus });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };
