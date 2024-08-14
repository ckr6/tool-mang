const { Op } = require('sequelize');
const Asset = require('../models/Asset');
const User = require('../models/User');
const Loan = require('../models/Loan');

const generateReport = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    const users = await User.findAll();
    const activeLoans = await Loan.findAll({
      where: {
        returned: false
      },
      include: [User, Asset]
    });
    const overdueLoans = await Loan.findAll({
      where: {
        endDate: {
          [Op.lt]: new Date()
        },
        returned: false
      },
      include: [User, Asset]
    });

    const report = {
      totalAssets: assets.length,
      totalUsers: users.length,
      totalActiveLoans: activeLoans.length,
      totalOverdueLoans: overdueLoans.length,
      activeLoans,
      overdueLoans,
      assets,
      users
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };
