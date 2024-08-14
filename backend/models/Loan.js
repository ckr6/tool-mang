const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./User');
const Asset = require('./Asset');

const Loan = sequelize.define('Loan', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Asset,
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  returned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Loan.belongsTo(User, { foreignKey: 'userId' });
Loan.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = Loan;
