const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./User');
const Asset = require('./Asset');

const Ticket = sequelize.define('Ticket', {
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
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Aberto' // Aberto, Em Progresso, Concluído
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Média' // Baixa, Média, Alta
  }
});

Ticket.belongsTo(User, { foreignKey: 'userId' });
Ticket.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = Ticket;
