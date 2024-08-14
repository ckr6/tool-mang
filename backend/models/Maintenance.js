const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Asset = require('./Asset');

const Maintenance = sequelize.define('Maintenance', {
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Asset,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

Maintenance.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = Maintenance;
