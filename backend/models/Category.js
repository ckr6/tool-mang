const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config'); // Ajuste este caminho para apontar para config.js

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fields: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

module.exports = Category;
